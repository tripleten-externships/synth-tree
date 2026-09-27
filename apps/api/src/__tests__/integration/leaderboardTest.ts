import { ApolloServer } from "@apollo/server";
import { PrismaClient } from "@prisma/client";
import { GraphQLContext } from "@graphql/context";
import { getTestServer } from "./server";
import { makeUserContext } from "./context";
import { seedUsers, cleanAll, REGULAR_USER_ID } from "./seed";

const prisma = new PrismaClient();

const NAMELESS_USER_ID = "test-nameless-user-id";

const LEADERBOARD = `
  query Leaderboard {
    leaderboard {
      entries {
        userId
        displayName
        totalXp
      }
    }
  }
`;

type LeaderboardData = {
  leaderboard: {
    entries: Array<{ userId: string; displayName: string; totalXp: number }>;
  };
};

describe("Leaderboard display names", () => {
  let server: ApolloServer<GraphQLContext>;

  beforeAll(async () => {
    server = await getTestServer();
    await seedUsers(prisma);

    // A learner who never set a display name, with enough XP to make the top 100.
    await prisma.user.upsert({
      where: { id: NAMELESS_USER_ID },
      update: { name: null },
      create: { id: NAMELESS_USER_ID, email: "nameless@test.com" },
    });
    await prisma.userXp.upsert({
      where: { userId: NAMELESS_USER_ID },
      update: { totalXp: 100 },
      create: { userId: NAMELESS_USER_ID, totalXp: 100 },
    });
  });

  afterAll(async () => {
    // UserXp rows cascade with their users.
    await prisma.user.deleteMany({ where: { id: NAMELESS_USER_ID } });
    await cleanAll(prisma);
    await prisma.$disconnect();
  });

  async function leaderboardEntries() {
    const res = await server.executeOperation<LeaderboardData>(
      { query: LEADERBOARD },
      { contextValue: makeUserContext(prisma, REGULAR_USER_ID) },
    );
    if (res.body.kind !== "single") throw new Error("Expected a single result");
    expect(res.body.singleResult.errors).toBeUndefined();
    return res.body.singleResult.data?.leaderboard.entries ?? [];
  }

  it('shows a learner without a display name as "Learner"', async () => {
    const entries = await leaderboardEntries();

    const nameless = entries.find((entry) => entry.userId === NAMELESS_USER_ID);
    expect(nameless?.displayName).toBe("Learner");
  });

  it("shows the viewer's own name before they have earned any XP", async () => {
    await prisma.userXp.deleteMany({ where: { userId: REGULAR_USER_ID } });

    const entries = await leaderboardEntries();

    const viewer = entries.find((entry) => entry.userId === REGULAR_USER_ID);
    expect(viewer).toMatchObject({ displayName: "Test User", totalXp: 0 });
  });
});
