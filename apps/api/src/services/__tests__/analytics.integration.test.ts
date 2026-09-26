import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { graphql, GraphQLError } from "graphql";
import { schema } from "../../schema";
import { calculateAdminAnalytics, type AnalyticsRange } from "../analytics";

const integration = process.env.TEST_DATABASE_URL ? describe : describe.skip;
const now = new Date("2026-09-25T12:00:00Z");
const at = (days: number) => new Date(now.getTime() - days * 86400000);
const query = `query Analytics($range: AnalyticsRange!) {
  adminAnalytics(range: $range) {
    activeLearners { current previous percentChange }
    lessonsCompleted { current previous percentChange }
    avgSessionMinutes { current previous percentChange }
    courseCompletionRate { current previous percentChange }
  }
}`;

integration("admin analytics integration (isolated seeded database)", () => {
  const schemaName = `analytics_test_${randomUUID().replace(/-/g, "")}`;
  let db: PrismaClient;
  let clock: jest.SpyInstance;
  let schemaCreated = false;

  beforeAll(async () => {
    const url = new URL(process.env.TEST_DATABASE_URL!);
    if (!["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)) {
      throw new Error("Analytics integration tests require a local TEST_DATABASE_URL");
    }
    url.searchParams.set("schema", schemaName);
    db = new PrismaClient({ datasources: { db: { url: url.toString() } } });
    await db.$executeRawUnsafe(`CREATE SCHEMA "${schemaName}"`);
    schemaCreated = true;
    execFileSync(
      process.execPath,
      [
        require.resolve("prisma/build/index.js"),
        "db",
        "push",
        "--skip-generate",
        "--schema",
        path.resolve(__dirname, "../../../prisma/schema.prisma"),
      ],
      { env: { ...process.env, DATABASE_URL: url.toString() }, stdio: "pipe" },
    );
    const users = [
      "a",
      "b",
      "c",
      "d",
      "e",
      "old",
      "admin",
      "profile",
      "notstarted",
      "boundary",
      "previousBoundary",
      "future",
    ];
    await db.user.createMany({
      data: users.map((id) => ({
        id,
        email: `${id}@analytics.test`,
        role: id === "admin" ? ("ADMIN" as const) : ("USER" as const),
        createdAt: at(2300),
        updatedAt: at(1),
      })),
    });
    const course = await db.course.create({
      data: { title: "Analytics fixture", authorId: "admin" },
    });
    const tree = await db.skillTree.create({ data: { title: "Tree", courseId: course.id } });
    const nodes: { id: string }[] = [];
    for (let i = 0; i < 8; i++) {
      nodes.push(
        await db.skillNode.create({
          data: { title: `Lesson ${i}`, treeId: tree.id, orderInStep: i, posX: i },
        }),
      );
    }
    const quiz = await db.quiz.create({ data: { nodeId: nodes[0].id } });
    await db.quizAttempt.createMany({
      data: ["a", "c", "admin"].map((userId) => ({ userId, quizId: quiz.id, takenAt: at(4) })),
    });
    await db.xpEvent.createMany({
      data: [
        ["a", 2],
        ["b", 3],
        ["b", 2],
        ["d", 20],
        ["e", 50],
        ["old", 2200],
        ["admin", 1],
        ["boundary", 7],
        ["previousBoundary", 14],
        ["future", 0],
        ["future", -1],
      ].map(([userId, days]) => ({
        userId: String(userId),
        amount: 10,
        reason: "node_completion",
        createdAt: at(Number(days)),
      })),
    });
    const completions: [string, number, number][] = [
      ["a", 2, 10],
      ["a", 10, 10],
      ["b", 7, 7],
      ["d", 20, 20],
      ["e", 50, 50],
      ["old", 2200, 2200],
      ["admin", 1, 1],
    ];
    await db.userNodeProgress.createMany({
      data: completions.map(([userId, completed, created], i) => ({
        userId,
        nodeId: nodes[i].id,
        status: "COMPLETED",
        createdAt: at(created),
        completedAt: at(completed),
        updatedAt: userId === "a" ? at(1) : at(completed),
      })),
    });
    await db.userNodeProgress.create({
      data: {
        userId: "notstarted",
        nodeId: nodes[7].id,
        status: "NOT_STARTED",
        createdAt: at(1),
        updatedAt: at(1),
      },
    });
    clock = jest.spyOn(Date, "now").mockReturnValue(now.getTime());
  }, 60000);

  afterAll(async () => {
    clock?.mockRestore();
    if (schemaCreated) await db.$executeRawUnsafe(`DROP SCHEMA "${schemaName}" CASCADE`);
    await db?.$disconnect();
  });

  const context = (admin = true, authenticated = true) => ({
    prisma: db,
    user: authenticated ? { uid: admin ? "admin" : "a", role: admin ? "ADMIN" : "USER" } : null,
    auth: {
      requireAuth: () => {
        if (!authenticated) throw new GraphQLError("Authentication required");
        return admin ? "admin" : "a";
      },
      getUserId: () => (authenticated ? "admin" : null),
      isAdmin: () => admin,
    },
  });

  async function sqlCounts(start: Date | null, end: Date) {
    const [row] = await db.$queryRaw<{ active: number; lessons: number }[]>`
      WITH activity AS (
        SELECT "userId", "createdAt" AS happened FROM "UserNodeProgress" WHERE status <> 'NOT_STARTED'
        UNION ALL SELECT "userId", "updatedAt" FROM "UserNodeProgress" WHERE status <> 'NOT_STARTED'
        UNION ALL SELECT "userId", "completedAt" FROM "UserNodeProgress" WHERE status <> 'NOT_STARTED'
        UNION ALL SELECT "userId", "createdAt" FROM "XpEvent"
        UNION ALL SELECT "userId", "takenAt" FROM "QuizAttempt"
      )
      SELECT (
        SELECT COUNT(DISTINCT a."userId")::int FROM activity a JOIN "User" u ON u.id = a."userId"
        WHERE u.role = 'USER' AND (${start}::timestamp IS NULL OR a.happened >= ${start}) AND a.happened < ${end}
      ) AS active, (
        SELECT COUNT(*)::int FROM "UserNodeProgress" p JOIN "User" u ON u.id = p."userId"
        WHERE u.role = 'USER' AND p.status = 'COMPLETED'
          AND (${start}::timestamp IS NULL OR p."completedAt" >= ${start}) AND p."completedAt" < ${end}
      ) AS lessons`;
    return row;
  }

  it.each([
    ["7d", "SEVEN_DAYS", 7, 4, 2, 2, 1],
    ["30d", "THIRTY_DAYS", 30, 6, 1, 4, 1],
    ["90d", "NINETY_DAYS", 90, 7, 0, 5, 0],
    ["all", "ALL", null, 8, null, 6, null],
  ] as const)(
    "%s matches hand-counted fixtures and independent SQL",
    async (range, publicRange, days, active, previousActive, lessons, previousLessons) => {
      const response = await graphql({
        schema,
        source: query,
        variableValues: { range: publicRange },
        contextValue: context(),
      });
      expect(response.errors).toBeUndefined();
      const result = response.data!.adminAnalytics as any;
      expect(result.activeLearners.current).toBe(active);
      expect(result.activeLearners.previous).toBe(previousActive);
      expect(result.lessonsCompleted.current).toBe(lessons);
      expect(result.lessonsCompleted.previous).toBe(previousLessons);
      const currentSQL = await sqlCounts(days === null ? null : at(days), now);
      expect(currentSQL).toEqual({ active, lessons });
      if (days !== null)
        expect(await sqlCounts(at(days * 2), at(days))).toEqual({
          active: previousActive,
          lessons: previousLessons,
        });
      const change = (current: number, previous: number | null) =>
        !previous ? null : Number((((current - previous) / previous) * 100).toFixed(1));
      expect(result.activeLearners.percentChange).toBe(change(active, previousActive));
      expect(result.lessonsCompleted.percentChange).toBe(change(lessons, previousLessons));
      expect(result.avgSessionMinutes).toEqual({
        current: null,
        previous: null,
        percentChange: null,
      });
      expect(result.courseCompletionRate).toEqual(result.avgSessionMinutes);
    },
  );

  it("rejects invalid ranges and authorizes even a cached request", async () => {
    for (const ctx of [context(false), context(false, false)]) {
      const response = await graphql({
        schema,
        source: query,
        variableValues: { range: "SEVEN_DAYS" },
        contextValue: ctx,
      });
      expect(response.errors).toHaveLength(1);
    }
    const invalid = await graphql({
      schema,
      source: query,
      variableValues: { range: "8d" },
      contextValue: context(),
    });
    expect(invalid.errors).toHaveLength(1);
  });

  it("keeps each range cached for one minute, then refreshes", async () => {
    const run = (range: string) =>
      graphql({ schema, source: query, variableValues: { range }, contextValue: context() });
    const before = await run("SEVEN_DAYS");
    await db.xpEvent.create({
      data: { userId: "boundary", amount: 10, reason: "node_completion", createdAt: at(1) },
    });
    await db.xpEvent.create({
      data: { userId: "profile", amount: 10, reason: "node_completion", createdAt: at(1) },
    });
    expect((await run("SEVEN_DAYS")).data).toEqual(before.data);
    expect((await run("THIRTY_DAYS")).data!.adminAnalytics).not.toEqual(
      before.data!.adminAnalytics,
    );
    clock.mockReturnValue(now.getTime() + 60000);
    const refreshed = await run("SEVEN_DAYS");
    expect(refreshed.errors).toBeUndefined();
    expect((refreshed.data!.adminAnalytics as any).activeLearners.current).toBe(6);
    clock.mockReturnValue(now.getTime());
  });

  it("returns zero counts but null changes for an empty period", async () => {
    const result = await calculateAdminAnalytics(db, "7d" as AnalyticsRange, at(3000));
    expect(result.activeLearners).toEqual({ current: 0, previous: 0, percentChange: null });
    expect(result.lessonsCompleted).toEqual(result.activeLearners);
  });
});
