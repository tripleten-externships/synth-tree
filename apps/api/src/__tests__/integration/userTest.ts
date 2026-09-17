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
