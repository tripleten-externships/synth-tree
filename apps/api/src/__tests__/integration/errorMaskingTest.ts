import { randomUUID } from "crypto";
import { ApolloServer } from "@apollo/server";
import { PrismaClient } from "@prisma/client";
import { GraphQLContext } from "@graphql/context";
import { INTERNAL_ERROR_MESSAGE } from "@lib/formatError";
import { getTestServer } from "./server";
import { makeAdminContext, makeUserContext, makeUnauthContext } from "./context";
import { seedUsers, cleanAll, ADMIN_USER_ID, REGULAR_USER_ID } from "./seed";

// Internal error text (Prisma messages, file paths, stack traces) must not
// reach clients; intentional GraphQLError messages still do.

const prisma = new PrismaClient();

function singleResult(result: any) {
  expect(result.body.kind).toBe("single");
  return result.body.singleResult;
}

// publishLessonBlock(id) calls prisma.lessonBlocks.update directly, so an
// unknown id makes Prisma throw a PrismaClientKnownRequestError (P2025,
// "record to update not found") from the resolver.
const PUBLISH_LESSON_BLOCK = `
  mutation PublishLessonBlock($id: ID!) {
    publishLessonBlock(id: $id) {
      id
    }
  }
`;

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
        { query: PUBLISH_LESSON_BLOCK, variables: { id: randomUUID() } },
        { contextValue: makeAdminContext(prisma, ADMIN_USER_ID) },
      ),
    );

    expect(res.errors).toHaveLength(1);
    expect(res.errors[0].message).toBe(INTERNAL_ERROR_MESSAGE);
    expect(res.errors[0].extensions).toEqual({ code: "INTERNAL_SERVER_ERROR" });
    expect(JSON.stringify(res.errors)).not.toMatch(/prisma|lessonBlocks\.update|\.ts:/i);
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
