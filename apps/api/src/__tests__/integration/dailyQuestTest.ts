import { ApolloServer } from "@apollo/server";
import { PrismaClient } from "@prisma/client";
import { GraphQLContext } from "@graphql/context";
import { getTestServer } from "./server";
import { makeUserContext } from "./context";
import { seedUsers, cleanAll, REGULAR_USER_ID } from "./seed";
import { DAILY_QUESTS } from "src/services/dailyQuests";

const prisma = new PrismaClient();

function singleResult(result: any) {
  expect(result.body.kind).toBe("single");
  return result.body.singleResult;
}

async function seedNode() {
  const course = await prisma.course.create({
    data: { title: "Quest Course", status: "DRAFT", authorId: REGULAR_USER_ID },
  });
  const tree = await prisma.skillTree.create({
    data: { courseId: course.id, title: "Quest Tree" },
  });
  const node = await prisma.skillNode.create({
    data: { treeId: tree.id, title: "Quest Node", step: 1, orderInStep: 0 },
  });
  return { node };
}

const MY_DAILY_QUESTS = `
  query MyDailyQuests {
    myDailyQuests {
      questKey
      current
      goal
      completed
    }
  }
`;

const COMPLETE_NODE = `
  mutation CompleteNodeProgress($nodeId: ID!) {
    completeNodeProgress(nodeId: $nodeId) {
      id
      status
    }
  }
`;

describe("Daily quests", () => {
  let server: ApolloServer<GraphQLContext>;

  beforeAll(async () => {
    server = await getTestServer();
    await seedUsers(prisma);
  });

  afterEach(async () => {
    await prisma.userDailyQuest.deleteMany({});
    await prisma.quizAttempt.deleteMany({});
    await prisma.quiz.deleteMany({});
    await prisma.userNodeProgress.deleteMany({});
    await prisma.skillNode.deleteMany({});
    await prisma.skillTree.deleteMany({});
    await prisma.course.deleteMany({});
  });

  afterAll(async () => {
    await prisma.userDailyQuest.deleteMany({});
    await cleanAll(prisma);
    await prisma.$disconnect();
  });

  it("returns exactly today's quest set for the current user", async () => {
    const res = singleResult(
      await server.executeOperation(
        { query: MY_DAILY_QUESTS },
        { contextValue: makeUserContext(prisma, REGULAR_USER_ID) },
      ),
    );

    expect(res.errors).toBeUndefined();
    const quests = res.data.myDailyQuests;
    expect(quests).toHaveLength(DAILY_QUESTS.length);
    expect(quests.every((q: any) => q.current === 0 && q.completed === false)).toBe(true);
  });

  it("counts a lesson only once even if completeNodeProgress is called repeatedly on the same node", async () => {
    const { node } = await seedNode();
    const ctx = makeUserContext(prisma, REGULAR_USER_ID);

    // Call the completion mutation twice on the SAME node.
    for (let i = 0; i < 2; i++) {
      const res = singleResult(
        await server.executeOperation(
          { query: COMPLETE_NODE, variables: { nodeId: node.id } },
          { contextValue: ctx },
        ),
      );
      expect(res.errors).toBeUndefined();
      expect(res.data.completeNodeProgress.status).toBe("COMPLETED");
    }

    const lessonQuest = await prisma.userDailyQuest.findFirst({
      where: { userId: REGULAR_USER_ID, questKey: "complete_2_lessons" },
    });

    // Progress must reflect one lesson, not two — repeat calls on an
    // already-completed node must not inflate the quest.
    expect(lessonQuest?.current).toBe(1);
    expect(lessonQuest?.completed).toBe(false);
  });

  it("completes the 2-lesson quest once two distinct nodes are completed", async () => {
    const { node: nodeA } = await seedNode();
    const { node: nodeB } = await seedNode();
    const ctx = makeUserContext(prisma, REGULAR_USER_ID);

    for (const node of [nodeA, nodeB]) {
      const res = singleResult(
        await server.executeOperation(
          { query: COMPLETE_NODE, variables: { nodeId: node.id } },
          { contextValue: ctx },
        ),
      );
      expect(res.errors).toBeUndefined();
    }

    const lessonQuest = await prisma.userDailyQuest.findFirst({
      where: { userId: REGULAR_USER_ID, questKey: "complete_2_lessons" },
    });

    expect(lessonQuest?.current).toBe(2);
    expect(lessonQuest?.completed).toBe(true);
  });

  it("blocks completing a node whose required quiz has not been passed", async () => {
    const { node } = await seedNode();
    await prisma.quiz.create({
      data: { nodeId: node.id, title: "Gate Quiz", required: true },
    });
    const ctx = makeUserContext(prisma, REGULAR_USER_ID);

    const res = singleResult(
      await server.executeOperation(
        { query: COMPLETE_NODE, variables: { nodeId: node.id } },
        { contextValue: ctx },
      ),
    );

    expect(res.errors?.[0]?.message).toMatch(/required quiz/i);
    expect(res.data?.completeNodeProgress ?? null).toBeNull();

    // Node must not be marked complete and the lesson quest must not advance.
    const progress = await prisma.userNodeProgress.findUnique({
      where: { userId_nodeId: { userId: REGULAR_USER_ID, nodeId: node.id } },
    });
    expect(progress?.status ?? null).not.toBe("COMPLETED");

    const lessonQuest = await prisma.userDailyQuest.findFirst({
      where: { userId: REGULAR_USER_ID, questKey: "complete_2_lessons" },
    });
    expect(lessonQuest?.current ?? 0).toBe(0);
  });

  it("allows completing a node once its required quiz has a passed attempt", async () => {
    const { node } = await seedNode();
    const quiz = await prisma.quiz.create({
      data: { nodeId: node.id, title: "Gate Quiz", required: true },
    });
    await prisma.quizAttempt.create({
      data: { quizId: quiz.id, userId: REGULAR_USER_ID, passed: true },
    });
    const ctx = makeUserContext(prisma, REGULAR_USER_ID);

    const res = singleResult(
      await server.executeOperation(
        { query: COMPLETE_NODE, variables: { nodeId: node.id } },
        { contextValue: ctx },
      ),
    );

    expect(res.errors).toBeUndefined();
    expect(res.data.completeNodeProgress.status).toBe("COMPLETED");
  });
});
