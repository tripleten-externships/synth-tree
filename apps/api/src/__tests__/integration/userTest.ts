import { ApolloServer } from "@apollo/server";
import { PrismaClient } from "@prisma/client";
import { GraphQLContext } from "@graphql/context";
import { getTestServer, stopTestServer } from "./server";
import { makeUserContext, makeUnauthContext } from "./context";
import {
  seedUsers,
  cleanAll,
  REGULAR_USER_ID,
  SECOND_REGULAR_USER_ID,
} from "./seed";

const prisma = new PrismaClient();

function singleResult(result: any) {
  expect(result.body.kind).toBe("single");
  return result.body.singleResult;
}

const UPDATE_ONBOARDING = `
  mutation UpdateOnboarding($interests: [String!]!) {
    updateOnboarding(interests: $interests) {
      id
      interests
    }
  }
`;

describe("updateOnboarding (signup step 2 - interests)", () => {
  let server: ApolloServer<GraphQLContext>;

  beforeAll(async () => {
    server = await getTestServer();
    await seedUsers(prisma);
  });

  afterAll(async () => {
    await cleanAll(prisma);
    await stopTestServer();
    await prisma.$disconnect();
  });

  it("rejects an unauthenticated request", async () => {
    const res = singleResult(
      await server.executeOperation(
        { query: UPDATE_ONBOARDING, variables: { interests: ["Physics"] } },
        { contextValue: makeUnauthContext(prisma) },
      ),
    );
    expect(res.errors).toBeDefined();
    expect(res.errors[0].message).toMatch(/authentication required/i);
  });

  it("saves the selected interests for the signed-in user", async () => {
    const interests = ["Physics", "Biology"];
    const res = singleResult(
      await server.executeOperation(
        { query: UPDATE_ONBOARDING, variables: { interests } },
        { contextValue: makeUserContext(prisma, REGULAR_USER_ID) },
      ),
    );
    expect(res.errors).toBeUndefined();
    expect(res.data.updateOnboarding.interests).toEqual(interests);

    // Persisted to the row, not just echoed back.
    const row = await prisma.user.findUnique({ where: { id: REGULAR_USER_ID } });
    expect(row?.interests).toEqual(interests);
  });

  it("records an empty array when the user skips", async () => {
    const res = singleResult(
      await server.executeOperation(
        { query: UPDATE_ONBOARDING, variables: { interests: [] } },
        { contextValue: makeUserContext(prisma, SECOND_REGULAR_USER_ID) },
      ),
    );
    expect(res.errors).toBeUndefined();
    expect(res.data.updateOnboarding.interests).toEqual([]);

    const row = await prisma.user.findUnique({ where: { id: SECOND_REGULAR_USER_ID } });
    expect(row?.interests).toEqual([]);
  });

  it("rejects interests that are not in the known subject list", async () => {
    const res = singleResult(
      await server.executeOperation(
        { query: UPDATE_ONBOARDING, variables: { interests: ["Physics", "Underwater Basket Weaving"] } },
        { contextValue: makeUserContext(prisma, REGULAR_USER_ID) },
      ),
    );
    expect(res.errors?.[0]?.message).toMatch(/Unknown interest/i);

    // Nothing persisted from the rejected call.
    const row = await prisma.user.findUnique({ where: { id: REGULAR_USER_ID } });
    expect(row?.interests).not.toContain("Underwater Basket Weaving");
  });

  it("dedupes repeated interests before persisting", async () => {
    const res = singleResult(
      await server.executeOperation(
        { query: UPDATE_ONBOARDING, variables: { interests: ["Physics", "Physics", "Biology"] } },
        { contextValue: makeUserContext(prisma, REGULAR_USER_ID) },
      ),
    );
    expect(res.errors).toBeUndefined();
    expect(res.data.updateOnboarding.interests).toEqual(["Physics", "Biology"]);

    const row = await prisma.user.findUnique({ where: { id: REGULAR_USER_ID } });
    expect(row?.interests).toEqual(["Physics", "Biology"]);
  });
});

const COMPLETE_ONBOARDING = `
  mutation CompleteOnboarding($dailyGoalMinutes: Int!) {
    updateOnboarding(dailyGoalMinutes: $dailyGoalMinutes) {
      id
      dailyGoalMinutes
      onboardingComplete
    }
  }
`;

const UPDATE_ONBOARDING_EMPTY = `
  mutation UpdateOnboardingEmpty {
    updateOnboarding {
      id
    }
  }
`;

describe("updateOnboarding (signup step 3 - daily goal)", () => {
  let server: ApolloServer<GraphQLContext>;

  beforeAll(async () => {
    server = await getTestServer();
    await seedUsers(prisma);
  });

  // Each test starts from a user who finished step 2 but not step 3.
  beforeEach(async () => {
    await prisma.user.update({
      where: { id: REGULAR_USER_ID },
      data: { interests: ["Physics"], dailyGoalMinutes: null, onboardingComplete: false },
    });
  });

  afterAll(async () => {
    await cleanAll(prisma);
    await stopTestServer();
    await prisma.$disconnect();
  });

  it("rejects an unauthenticated request", async () => {
    const res = singleResult(
      await server.executeOperation(
        { query: COMPLETE_ONBOARDING, variables: { dailyGoalMinutes: 15 } },
        { contextValue: makeUnauthContext(prisma) },
      ),
    );
    expect(res.errors).toBeDefined();
    expect(res.errors[0].message).toMatch(/authentication required/i);
  });

  it("saves the daily goal and marks onboarding complete", async () => {
    const res = singleResult(
      await server.executeOperation(
        { query: COMPLETE_ONBOARDING, variables: { dailyGoalMinutes: 30 } },
        { contextValue: makeUserContext(prisma, REGULAR_USER_ID) },
      ),
    );
    expect(res.errors).toBeUndefined();
    expect(res.data.updateOnboarding).toMatchObject({
      dailyGoalMinutes: 30,
      onboardingComplete: true,
    });

    const row = await prisma.user.findUnique({ where: { id: REGULAR_USER_ID } });
    expect(row?.dailyGoalMinutes).toBe(30);
    expect(row?.onboardingComplete).toBe(true);
  });

  it("keeps the step 2 interests when only the daily goal is sent", async () => {
    const res = singleResult(
      await server.executeOperation(
        { query: COMPLETE_ONBOARDING, variables: { dailyGoalMinutes: 15 } },
        { contextValue: makeUserContext(prisma, REGULAR_USER_ID) },
      ),
    );
    expect(res.errors).toBeUndefined();

    const row = await prisma.user.findUnique({ where: { id: REGULAR_USER_ID } });
    expect(row?.interests).toEqual(["Physics"]);
  });

  it("rejects a daily goal that is not one of the offered options", async () => {
    const res = singleResult(
      await server.executeOperation(
        { query: COMPLETE_ONBOARDING, variables: { dailyGoalMinutes: 20 } },
        { contextValue: makeUserContext(prisma, REGULAR_USER_ID) },
      ),
    );
    expect(res.errors?.[0]?.message).toMatch(/daily goal/i);
    expect(res.errors?.[0]?.extensions?.code).toBe("BAD_USER_INPUT");

    // Nothing persisted from the rejected call.
    const row = await prisma.user.findUnique({ where: { id: REGULAR_USER_ID } });
    expect(row?.dailyGoalMinutes).toBeNull();
    expect(row?.onboardingComplete).toBe(false);
  });

  it("rejects a call with nothing to update", async () => {
    const res = singleResult(
      await server.executeOperation(
        { query: UPDATE_ONBOARDING_EMPTY },
        { contextValue: makeUserContext(prisma, REGULAR_USER_ID) },
      ),
    );
    expect(res.errors?.[0]?.message).toMatch(/nothing to update/i);
    expect(res.errors?.[0]?.extensions?.code).toBe("BAD_USER_INPUT");
  });

  it("does not mark onboarding complete when only interests are sent", async () => {
    const res = singleResult(
      await server.executeOperation(
        { query: UPDATE_ONBOARDING, variables: { interests: ["Biology"] } },
        { contextValue: makeUserContext(prisma, REGULAR_USER_ID) },
      ),
    );
    expect(res.errors).toBeUndefined();

    const row = await prisma.user.findUnique({ where: { id: REGULAR_USER_ID } });
    expect(row?.onboardingComplete).toBe(false);
  });
});
