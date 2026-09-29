import { randomUUID } from "crypto";
import { ApolloServer } from "@apollo/server";
import { PrismaClient } from "@prisma/client";
import { GraphQLContext } from "@graphql/context";
import { INTERNAL_ERROR_MESSAGE } from "@lib/formatError";
import { getTestServer } from "./server";
import { makeUserContext, makeUnauthContext } from "./context";
import { seedUsers, cleanAll, REGULAR_USER_ID } from "./seed";

// Internal error text (Prisma messages, file paths, stack traces) must not
// reach clients; intentional GraphQLError messages still do.

const prisma = new PrismaClient();

function singleResult(result: any) {
  expect(result.body.kind).toBe("single");
  return result.body.singleResult;
}

// lessonBlock(id) uses findUniqueOrThrow, so an unknown id makes Prisma throw
// a PrismaClientKnownRequestError (P2025) from the resolver.
const LESSON_BLOCK = `
  query LessonBlock($id: ID!) {
    lessonBlock(id: $id) {
      id
    }
  }
`;

describe("error masking", () => {
  let server: ApolloServer<GraphQLContext>;

  beforeAll(async () => {
    server = await getTestServer();
    await seedUsers(prisma);
  });

  afterAll(async () => {
    await cleanAll(prisma);
    await prisma.$disconnect();
  });

  it("replaces a Prisma error with a generic message", async () => {
    const res = singleResult(
      await server.executeOperation(
        { query: LESSON_BLOCK, variables: { id: randomUUID() } },
        { contextValue: makeUserContext(prisma, REGULAR_USER_ID) },
      ),
    );

    expect(res.errors).toHaveLength(1);
    expect(res.errors[0].message).toBe(INTERNAL_ERROR_MESSAGE);
    expect(res.errors[0].extensions).toEqual({ code: "INTERNAL_SERVER_ERROR" });
    expect(JSON.stringify(res.errors)).not.toMatch(/prisma|findUniqueOrThrow|\.ts:/i);
  });

  it("keeps an intentional GraphQLError message, without a stack trace", async () => {
    const res = singleResult(
      await server.executeOperation(
        { query: LESSON_BLOCK, variables: { id: randomUUID() } },
        { contextValue: makeUnauthContext(prisma) },
      ),
    );

    expect(res.errors[0].message).toBe("Authentication required");
    expect(res.errors[0].extensions).not.toHaveProperty("stacktrace");
  });

  it("keeps GraphQL validation errors", async () => {
    const res = singleResult(
      await server.executeOperation(
        { query: "query { lessonBlock(id: 1) { doesNotExist } }" },
        { contextValue: makeUserContext(prisma, REGULAR_USER_ID) },
      ),
    );

    expect(res.errors[0].extensions.code).toBe("GRAPHQL_VALIDATION_FAILED");
    expect(res.errors[0].message).toMatch(/doesNotExist/);
  });
});
