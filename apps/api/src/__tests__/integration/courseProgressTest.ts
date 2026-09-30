import { ApolloServer } from "@apollo/server";
import { PrismaClient } from "@prisma/client";
import { GraphQLContext } from "@graphql/context";
import { getTestServer } from "./server";
import { makeAdminContext, makeUserContext } from "./context";
import {
  seedUsers,
  cleanAll,
  cleanCourses,
  ADMIN_USER_ID,
  REGULAR_USER_ID,
  SECOND_REGULAR_USER_ID,
} from "./seed";

const prisma = new PrismaClient();

function singleResult(result: any) {
  expect(result.body.kind).toBe("single");
  return result.body.singleResult;
}

const COURSE_PROGRESS = `
  query CourseProgress($courseId: ID!, $userId: ID) {
    courseProgress(courseId: $courseId, userId: $userId) {
      courseId
      totalNodes
      completedNodes
      xpEarned
    }
  }
`;

async function seedCourse(title: string) {
  const course = await prisma.course.create({
    data: { title, status: "PUBLISHED", authorId: ADMIN_USER_ID },
  });
  const tree = await prisma.skillTree.create({
    data: { courseId: course.id, title: `${title} Tree` },
  });
  const node = (step: number) =>
    prisma.skillNode.create({
      data: {
        treeId: tree.id,
        title: `${title} Node ${step}`,
        step,
        orderInStep: 0,
        posX: step,
        xpReward: 10,
      },
    });
  return { course, tree, nodeA: await node(1), nodeB: await node(2), deletedNode: await node(3) };
}

function xp(userId: string, amount: number, reason: string, rewardKey: string) {
  return prisma.xpEvent.create({ data: { userId, amount, reason, rewardKey } });
}

describe("courseProgress.xpEarned", () => {
  let server: ApolloServer<GraphQLContext>;
  let courseId: string;

  beforeAll(async () => {
    server = await getTestServer();
    await seedUsers(prisma);
  });

  beforeEach(async () => {
    const main = await seedCourse("Main");
    courseId = main.course.id;
    const quiz = await prisma.quiz.create({ data: { nodeId: main.nodeB.id } });

    // Counted: node XP and quiz XP (quiz_pass rewardKey is the quiz id).
    await xp(REGULAR_USER_ID, 10, "node_completion", main.nodeA.id);
    await xp(REGULAR_USER_ID, 25, "quiz_pass", quiz.id);

    // Excluded: XP from a node that was later soft-deleted.
    await xp(REGULAR_USER_ID, 100, "node_completion", main.deletedNode.id);
    await prisma.skillNode.update({
      where: { id: main.deletedNode.id },
      data: { deletedAt: new Date() },
    });

    // Excluded: XP from another course.
    const other = await seedCourse("Other");
    await xp(REGULAR_USER_ID, 1000, "node_completion", other.nodeA.id);

    // Excluded: another user's XP in this course.
    await xp(SECOND_REGULAR_USER_ID, 500, "node_completion", main.nodeA.id);
  });

  afterEach(async () => {
    await prisma.xpEvent.deleteMany({});
    await cleanCourses(prisma);
  });

  afterAll(async () => {
    await prisma.xpEvent.deleteMany({});
    await cleanAll(prisma);
    await prisma.$disconnect();
  });

  async function run(ctx: GraphQLContext, variables: { courseId: string; userId?: string }) {
    return singleResult(
      await server.executeOperation({ query: COURSE_PROGRESS, variables }, { contextValue: ctx }),
    );
  }

  it("sums node and quiz XP for the current user in this course only", async () => {
    const res = await run(makeUserContext(prisma, REGULAR_USER_ID), { courseId });
    expect(res.errors).toBeUndefined();
    expect(res.data.courseProgress).toMatchObject({ courseId, totalNodes: 2, xpEarned: 35 });
  });

  it("lets an admin read another user's XP", async () => {
    const res = await run(makeAdminContext(prisma, ADMIN_USER_ID), {
      courseId,
      userId: SECOND_REGULAR_USER_ID,
    });
    expect(res.errors).toBeUndefined();
    expect(res.data.courseProgress.xpEarned).toBe(500);
  });

  it("rejects a non-admin userId override", async () => {
    const res = await run(makeUserContext(prisma, REGULAR_USER_ID), {
      courseId,
      userId: SECOND_REGULAR_USER_ID,
    });
    expect(res.errors?.[0]?.message).toBe("Admin access required");
    expect(res.data?.courseProgress ?? null).toBeNull();
  });

  it("returns Course not found for a malformed courseId", async () => {
    const res = await run(makeUserContext(prisma, REGULAR_USER_ID), { courseId: "1" });
    expect(res.errors?.[0]?.message).toBe("Course not found");
  });
});
