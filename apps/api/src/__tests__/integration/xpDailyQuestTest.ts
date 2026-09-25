import { ApolloServer } from "@apollo/server";
import { PrismaClient } from "@prisma/client";
import { GraphQLContext } from "@graphql/context";
import { getTestServer } from "./server";
import { makeUserContext } from "./context";
import { seedUsers, cleanAll, REGULAR_USER_ID } from "./seed";

const prisma = new PrismaClient();

function singleResult(result: any) {
  expect(result.body.kind).toBe("single");
  return result.body.singleResult;
}

const COMPLETE_NODE = `
  mutation CompleteNodeProgress($nodeId: ID!) {
    completeNodeProgress(nodeId: $nodeId) {
      progress {
        id
        status
      }
      xpAwarded
    }
  }
`;

async function seedNode(xpReward: number) {
  const course = await prisma.course.create({
    data: { title: "XP Course", status: "DRAFT", authorId: REGULAR_USER_ID },
  });
  const tree = await prisma.skillTree.create({ data: { courseId: course.id, title: "XP Tree" } });
  return prisma.skillNode.create({
    data: { treeId: tree.id, title: "XP Node", step: 1, orderInStep: 0, xpReward },
  });
}

function xpQuest() {
  return prisma.userDailyQuest.findMany({
    where: { userId: REGULAR_USER_ID, questKey: "earn_50_xp" },
  });
}

describe("Earn 50 XP daily quest", () => {
  let server: ApolloServer<GraphQLContext>;

  beforeAll(async () => {
    server = await getTestServer();
    await seedUsers(prisma);
  });

  afterEach(async () => {
    await prisma.userDailyQuest.deleteMany({});
    await prisma.xpEvent.deleteMany({});
    await prisma.userXp.deleteMany({});
    await prisma.userNodeProgress.deleteMany({});
    await prisma.skillNode.deleteMany({});
    await prisma.skillTree.deleteMany({});
    await prisma.course.deleteMany({});
  });

  afterAll(async () => {
    await prisma.userDailyQuest.deleteMany({});
    await prisma.xpEvent.deleteMany({});
    await prisma.userXp.deleteMany({});
    await cleanAll(prisma);
    await prisma.$disconnect();
  });

  async function complete(nodeId: string) {
    const res = singleResult(
      await server.executeOperation(
        { query: COMPLETE_NODE, variables: { nodeId } },
        { contextValue: makeUserContext(prisma, REGULAR_USER_ID) },
      ),
    );
    expect(res.errors).toBeUndefined();
    expect(res.data.completeNodeProgress.progress.status).toBe("COMPLETED");
  }

  it("advances by awarded XP, accumulates, caps at 50 and completes once", async () => {
    const a = await seedNode(30);
    const b = await seedNode(30);
    const c = await seedNode(30);

    await complete(a.id);
    let rows = await xpQuest();
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ current: 30, goal: 50, completed: false });

    // Repeat completion of the same node must not re-award XP or advance the quest.
    await complete(a.id);
    rows = await xpQuest();
    expect(rows[0].current).toBe(30);

    await complete(b.id);
    rows = await xpQuest();
    expect(rows[0]).toMatchObject({ current: 50, completed: true });

    await complete(c.id);
    rows = await xpQuest();
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ current: 50, completed: true });

    const totals = await prisma.userXp.findUnique({ where: { userId: REGULAR_USER_ID } });
    expect(totals?.totalXp).toBe(90);
  });
});
