import { readFileSync } from "fs";
import { join } from "path";
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
    expect(res.data.completeNodeProgress.status).toBe("COMPLETED");

    const earned = await prisma.userAchievement.findUnique({
      where: {
        userId_achievementId: { userId: REGULAR_USER_ID, achievementId: FIRST_STEP_ID },
      },
    });
    expect(earned).not.toBeNull();
  });
});
