import { ApolloServer } from "@apollo/server";
import { PrismaClient } from "@prisma/client";
import { GraphQLContext } from "@graphql/context";
import { getTestServer, stopTestServer } from "./server";
import {
  makeAdminContext,
  makeUserContext,
  makeUnauthContext,
} from "./context";
import { seedUsers, cleanAll, ADMIN_USER_ID, REGULAR_USER_ID } from "./seed";

const prisma = new PrismaClient();

function singleResult(result: any) {
  expect(result.body.kind).toBe("single");
  return result.body.singleResult;
}

describe("authentication and authorization", () => {
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

  describe("unauthenticated access", () => {
    it("reject unauthenticated adminGetAllCourses", async () => {
      const res = singleResult(
        await server.executeOperation(
          { query: `query { adminGetAllCourses { id } }` },
          { contextValue: makeUnauthContext(prisma) },
        ),
      );
      expect(res.errors).toBeDefined();
      expect(res.errors[0].message).toMatch(/authentication required/i);
    });

    it("reject unauthenticated createCourse", async () => {
      const res = singleResult(
        await server.executeOperation(
          {
            query: `mutation { createCourse(input: { title: "X" }) { id } }`,
          },
          { contextValue: makeUnauthContext(prisma) },
        ),
      );
      expect(res.errors).toBeDefined();
    });
  });

  describe("non-admin user access", () => {
    it("reject normal user from adminGetAllCourses", async () => {
      const res = singleResult(
        await server.executeOperation(
          { query: `query { adminGetAllCourses { id } }` },
          { contextValue: makeUserContext(prisma, REGULAR_USER_ID) },
        ),
      );
      expect(res.errors).toBeDefined();
      expect(res.errors[0].message).toMatch(/admin/i);
    });

    it("allow normal user to createCourse", async () => {
      const res = singleResult(
        await server.executeOperation(
          {
            query: `mutation { createCourse(input: { title: "X" }) { id title } }`,
          },
          { contextValue: makeUserContext(prisma, REGULAR_USER_ID) },
        ),
      );
      expect(res.errors).toBeUndefined();
      expect(res.data.createCourse.title).toBe("X");
    });

    it("reject normal user from adminCourse query", async () => {
      const res = singleResult(
        await server.executeOperation(
          { query: `query { adminCourse(id: "any-id") { id } }` },
          { contextValue: makeUserContext(prisma, REGULAR_USER_ID) },
        ),
      );
      expect(res.errors).toBeDefined();
    });
  });

  describe("admin access", () => {
    it("allow admin to query adminGetAllCourses", async () => {
      const res = singleResult(
        await server.executeOperation(
          { query: `query { adminGetAllCourses { id title status } }` },
          { contextValue: makeAdminContext(prisma, ADMIN_USER_ID) },
        ),
      );
      expect(res.errors).toBeUndefined();
      expect(Array.isArray(res.data.adminGetAllCourses)).toBe(true);
    });

    it("allow admin to create a course", async () => {
      const res = singleResult(
        await server.executeOperation(
          {
            query: `mutation {
              createCourse(input: { title: "Auth Test Course" }) {
                id
                title
              }
            }`,
          },
          { contextValue: makeAdminContext(prisma, ADMIN_USER_ID) },
        ),
      );
      expect(res.errors).toBeUndefined();
      expect(res.data.createCourse.title).toBe("Auth Test Course");
    });
  });
});
