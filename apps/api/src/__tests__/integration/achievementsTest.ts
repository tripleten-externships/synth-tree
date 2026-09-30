import { readFileSync } from "fs";
import { join } from "path";
import { ApolloServer } from "@apollo/server";
import { PrismaClient } from "@prisma/client";
import { GraphQLContext } from "@graphql/context";
import { getTestServer } from "./server";
import { makeUserContext } from "./context";
import { seedUsers, cleanAll, REGULAR_USER_ID, SECOND_REGULAR_USER_ID } from "./seed";

const prisma = new PrismaClient();

function singleResult(result: any) {
  expect(result.body.kind).toBe("single");
  return result.body.singleResult;
}

// Execute the client's real document (not a copy) so a field the client asks
// for but the schema doesn't expose fails here instead of in the browser.
function clientDocument(relativePath: string): string {
  const source = readFileSync(
    join(__dirname, "../../../../client-frontend/src/graphql", relativePath),
    "utf8",
  );
  const match = source.match(/gql`([\s\S]*?)`/);
  if (!match) throw new Error(`No gql document found in ${relativePath}`);
  return match[1];
}

const COMPLETE_NODE_PROGRESS = clientDocument("mutations/completeNodeProgress.ts");

const FIRST_STEP_ID = "test-first-step";

async function seedNode() {
  const course = await prisma.course.create({
    data: { title: "Achievements Course", status: "DRAFT", authorId: REGULAR_USER_ID },
  });
  const tree = await prisma.skillTree.create({
    data: { courseId: course.id, title: "Achievements Tree" },
  });
  return prisma.skillNode.create({
    data: { treeId: tree.id, title: "Achievements Node", step: 1, orderInStep: 0, xpReward: 10 },
  });
}

describe("achievements (resolver level)", () => {
  let server: ApolloServer<GraphQLContext>;

  beforeAll(async () => {
    server = await getTestServer();
    await seedUsers(prisma);
    await prisma.achievement.upsert({
      where: { id: FIRST_STEP_ID },
      update: {},
      create: {
        id: FIRST_STEP_ID,
        name: "First Step",
        description: "Complete your first lesson",
        icon: "footsteps",
        color: "primary",
        trigger: "lesson_completed_count:1",
      },
    });
  });

  afterEach(async () => {
    await prisma.userAchievement.deleteMany({});
    await prisma.userDailyQuest.deleteMany({});
    await prisma.xpEvent.deleteMany({});
    await prisma.userXp.deleteMany({});
    await prisma.userStreak.deleteMany({});
    await prisma.userNodeProgress.deleteMany({});
    await prisma.skillNode.deleteMany({});
    await prisma.skillTree.deleteMany({});
    await prisma.course.deleteMany({});
  });

  afterAll(async () => {
    await prisma.userAchievement.deleteMany({});
    await prisma.achievement.deleteMany({ where: { id: FIRST_STEP_ID } });
    await cleanAll(prisma);
    await prisma.$disconnect();
  });

  it("completes a lesson via the client's COMPLETE_NODE_PROGRESS document and awards First Step", async () => {
    const node = await seedNode();

    const res = singleResult(
      await server.executeOperation(
        { query: COMPLETE_NODE_PROGRESS, variables: { nodeId: node.id } },
        { contextValue: makeUserContext(prisma, REGULAR_USER_ID) },
      ),
    );

    expect(res.errors).toBeUndefined();
    expect(res.data.completeNodeProgress.progress.status).toBe("COMPLETED");
    expect(res.data.completeNodeProgress.xpAwarded).toBeGreaterThan(0);

    const earned = await prisma.userAchievement.findUnique({
      where: {
        userId_achievementId: { userId: REGULAR_USER_ID, achievementId: FIRST_STEP_ID },
      },
    });
    expect(earned).not.toBeNull();
  });

  describe("privacy: another learner's email is not reachable", () => {
    const OTHER_EMAIL = "user2@test.com";

    beforeEach(async () => {
      await prisma.userAchievement.createMany({
        data: [
          { userId: REGULAR_USER_ID, achievementId: FIRST_STEP_ID },
          { userId: SECOND_REGULAR_USER_ID, achievementId: FIRST_STEP_ID },
        ],
      });
    });

    async function runAsLearner(query: string) {
      return singleResult(
        await server.executeOperation(
          { query },
          { contextValue: makeUserContext(prisma, REGULAR_USER_ID) },
        ),
      );
    }

    it("myAchievements returns only safe fields for the viewer's own rows", async () => {
      const res = await runAsLearner(clientDocument("queries/myAchievements.ts"));

      expect(res.errors).toBeUndefined();
      expect(res.data.myAchievements).toHaveLength(1);
      expect(res.data.myAchievements[0].achievement).toEqual({
        id: FIRST_STEP_ID,
        name: "First Step",
        description: "Complete your first lesson",
        icon: "footsteps",
        color: "primary",
      });
    });

    it.each([
      [
        "Achievement.userAchievements -> user",
        `query { myAchievements { achievement { userAchievements { user { id email } } } } }`,
      ],
      ["UserAchievement.user", `query { myAchievements { user { id email } } }`],
      ["Achievement.trigger", `query { myAchievements { achievement { trigger } } }`],
      [
        "User.userAchievements via Course.author",
        `query { publicGetAllCourses { author { userAchievements { user { email } } } } }`,
      ],
    ])("rejects %s", async (_label, query) => {
      await prisma.course.create({
        data: { title: "Other's Course", status: "PUBLISHED", authorId: SECOND_REGULAR_USER_ID },
      });

      const res = await runAsLearner(query);

      expect(res.errors?.[0]?.extensions?.code).toBe("GRAPHQL_VALIDATION_FAILED");
      expect(res.data).toBeUndefined();
      expect(JSON.stringify(res)).not.toContain(OTHER_EMAIL);
    });

    it("User.achievements is empty for another user and populated for self", async () => {
      await prisma.course.createMany({
        data: [
          { title: "Other's Course", status: "PUBLISHED", authorId: SECOND_REGULAR_USER_ID },
          { title: "My Course", status: "PUBLISHED", authorId: REGULAR_USER_ID },
        ],
      });

      const res = await runAsLearner(
        `query { publicGetAllCourses { authorId author { achievements { id } } } }`,
      );

      expect(res.errors).toBeUndefined();
      const byAuthor = Object.fromEntries(
        res.data.publicGetAllCourses.map((c: any) => [c.authorId, c.author.achievements]),
      );
      expect(byAuthor[SECOND_REGULAR_USER_ID]).toEqual([]);
      expect(byAuthor[REGULAR_USER_ID]).toEqual([{ id: FIRST_STEP_ID }]);
    });
  });
});
