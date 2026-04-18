import { ApolloServer } from "@apollo/server";
import { PrismaClient } from "@prisma/client";
import { GraphQLContext } from "@graphql/context";
import { getTestServer } from "./server";
import {
  makeAdminContext,
  makeUserContext,
  makeUnauthContext,
} from "./context";
import {
  seedUsers,
  cleanCourses,
  cleanAll,
  ADMIN_USER_ID,
  REGULAR_USER_ID,
  SECOND_REGULAR_USER_ID,
} from "./seed";

const prisma = new PrismaClient();

function singleResult(result: any) {
  expect(result.body.kind).toBe("single");
  return result.body.singleResult;
}

const CREATE_COURSE = `
  mutation CreateCourse($input: CreateCourseInput!) {
    createCourse(input: $input) {
      id
      title
      description
      status
    }
  }
`;

const UPDATE_COURSE = `
  mutation UpdateCourse($id: ID!, $input: UpdateCourseInput!) {
    updateCourse(id: $id, input: $input) {
      id
      title
      description
      status
    }
  }
`;

const DELETE_COURSE = `
  mutation DeleteCourse($id: ID!) {
    deleteCourse(id: $id) {
      id
      title
    }
  }
`;

const GET_ALL_COURSES = `
  query GetAllCourses($status: CourseStatus, $search: String) {
    adminGetAllCourses(status: $status, search: $search) {
      id
      title
      status
    }
  }
`;

const GET_COURSE = `
  query GetCourse($id: ID!) {
    adminCourse(id: $id) {
      id
      title
      status
    }
  }
`;

describe("Course CRUD", () => {
  let server: ApolloServer<GraphQLContext>;

  beforeAll(async () => {
    server = await getTestServer();
    await seedUsers(prisma);
  });

  afterEach(async () => {
    await cleanCourses(prisma);
  });

  afterAll(async () => {
    await cleanAll(prisma);
    await prisma.$disconnect();
  });

  describe("adminGetAllCourses", () => {
    it("return all course", async () => {
      await prisma.course.createMany({
        data: [
          { title: "Course A", status: "DRAFT", authorId: ADMIN_USER_ID },
          { title: "Course B", status: "PUBLISHED", authorId: ADMIN_USER_ID },
        ],
      });

      const res = singleResult(
        await server.executeOperation(
          { query: GET_ALL_COURSES },
          { contextValue: makeAdminContext(prisma, ADMIN_USER_ID) },
        ),
      );

      expect(res.errors).toBeUndefined();
      expect(res.data.adminGetAllCourses.length).toBeGreaterThanOrEqual(2);
    });

    it("filter by searching term", async () => {
      await prisma.course.createMany({
        data: [
          {
            title: "Something and other thing",
            status: "DRAFT",
            authorId: ADMIN_USER_ID,
          },
          { title: "React Advanced", status: "DRAFT", authorId: ADMIN_USER_ID },
        ],
      });

      const res = singleResult(
        await server.executeOperation(
          { query: GET_ALL_COURSES, variables: { search: "Something" } },
          { contextValue: makeAdminContext(prisma, ADMIN_USER_ID) },
        ),
      );

      expect(res.errors).toBeUndefined();
      expect(res.data.adminGetAllCourses.length).toBeGreaterThanOrEqual(1);
      expect(
        res.data.adminGetAllCourses.every((c: any) =>
          c.title.toLowerCase().includes("something"),
        ),
      ).toBe(true);
    });
  });

  describe("authorization", () => {
    describe("createCourse", () => {
      it("allow any authenticated user to create a course", async () => {
        const res = singleResult(
          await server.executeOperation(
            {
              query: CREATE_COURSE,
              variables: { input: { title: "User Created Course" } },
            },
            { contextValue: makeUserContext(prisma, REGULAR_USER_ID) },
          ),
        );

        expect(res.errors).toBeUndefined();
        expect(res.data.createCourse.title).toBe("User Created Course");
      });

      it("block unauthenticated user from creating a course", async () => {
        const res = singleResult(
          await server.executeOperation(
            {
              query: CREATE_COURSE,
              variables: { input: { title: "Unauth User" } },
            },
            { contextValue: makeUnauthContext(prisma) },
          ),
        );

        expect(res.errors).toBeDefined();
      });
    });

    describe("updateCourse", () => {
      it("allow the course owner to update their own course", async () => {
        const course = await prisma.course.create({
          data: {
            title: "Owner Course",
            status: "DRAFT",
            authorId: REGULAR_USER_ID,
          },
        });

        const res = singleResult(
          await server.executeOperation(
            {
              query: UPDATE_COURSE,
              variables: { id: course.id, input: { title: "Owner Updated" } },
            },
            { contextValue: makeUserContext(prisma, REGULAR_USER_ID) },
          ),
        );

        expect(res.errors).toBeUndefined();
        expect(res.data.updateCourse.title).toBe("Owner Updated");
      });

      it("allow admin to update any course", async () => {
        const course = await prisma.course.create({
          data: {
            title: "User Course for Admin",
            status: "DRAFT",
            authorId: REGULAR_USER_ID,
          },
        });

        const res = singleResult(
          await server.executeOperation(
            {
              query: UPDATE_COURSE,
              variables: { id: course.id, input: { title: "Admin Updated" } },
            },
            { contextValue: makeAdminContext(prisma, ADMIN_USER_ID) },
          ),
        );

        expect(res.errors).toBeUndefined();
        expect(res.data.updateCourse.title).toBe("Admin Updated");
      });

      it("block a user from updating a course they do not own", async () => {
        const course = await prisma.course.create({
          data: {
            title: "User1 Course",
            status: "DRAFT",
            authorId: REGULAR_USER_ID,
          },
        });

        const res = singleResult(
          await server.executeOperation(
            {
              query: UPDATE_COURSE,
              variables: { id: course.id, input: { title: "Hijacked" } },
            },
            { contextValue: makeUserContext(prisma, SECOND_REGULAR_USER_ID) },
          ),
        );

        expect(res.errors).toBeDefined();
      });

      it("block unauthenticated user from updating a course", async () => {
        const course = await prisma.course.create({
          data: {
            title: "Unauth Update Target",
            status: "DRAFT",
            authorId: ADMIN_USER_ID,
          },
        });

        const res = singleResult(
          await server.executeOperation(
            {
              query: UPDATE_COURSE,
              variables: { id: course.id, input: { title: "Hijacked" } },
            },
            { contextValue: makeUnauthContext(prisma) },
          ),
        );

        expect(res.errors).toBeDefined();
      });

      it("chaning to the database", async () => {
        const course = await prisma.course.create({
          data: { title: "Before", status: "DRAFT", authorId: ADMIN_USER_ID },
        });

        await server.executeOperation(
          {
            query: UPDATE_COURSE,
            variables: { id: course.id, input: { title: "After" } },
          },
          { contextValue: makeAdminContext(prisma, ADMIN_USER_ID) },
        );

        const updated = await prisma.course.findUnique({
          where: { id: course.id },
        });
        expect(updated!.title).toBe("After");
      });
    });

    describe("deleteCourse", () => {
      it("allow the course owner to delete their own course", async () => {
        const course = await prisma.course.create({
          data: {
            title: "Owner Delete",
            status: "DRAFT",
            authorId: REGULAR_USER_ID,
          },
        });

        const res = singleResult(
          await server.executeOperation(
            { query: DELETE_COURSE, variables: { id: course.id } },
            { contextValue: makeUserContext(prisma, REGULAR_USER_ID) },
          ),
        );

        expect(res.errors).toBeUndefined();
        expect(res.data.deleteCourse.id).toBe(course.id);
      });

      it("allow admin to delete any course", async () => {
        const course = await prisma.course.create({
          data: {
            title: "User Course for Admin Delete",
            status: "DRAFT",
            authorId: REGULAR_USER_ID,
          },
        });

        const res = singleResult(
          await server.executeOperation(
            { query: DELETE_COURSE, variables: { id: course.id } },
            { contextValue: makeAdminContext(prisma, ADMIN_USER_ID) },
          ),
        );

        expect(res.errors).toBeUndefined();
        expect(res.data.deleteCourse.id).toBe(course.id);
      });

      it("block a user from deleting a course they do not own", async () => {
        const course = await prisma.course.create({
          data: {
            title: "User1 Delete Target",
            status: "DRAFT",
            authorId: REGULAR_USER_ID,
          },
        });

        const res = singleResult(
          await server.executeOperation(
            { query: DELETE_COURSE, variables: { id: course.id } },
            { contextValue: makeUserContext(prisma, SECOND_REGULAR_USER_ID) },
          ),
        );

        expect(res.errors).toBeDefined();
      });

      it("block unauthenticated user from deleting a course", async () => {
        const course = await prisma.course.create({
          data: {
            title: "Unauth Delete Target",
            status: "DRAFT",
            authorId: ADMIN_USER_ID,
          },
        });

        const res = singleResult(
          await server.executeOperation(
            { query: DELETE_COURSE, variables: { id: course.id } },
            { contextValue: makeUnauthContext(prisma) },
          ),
        );

        expect(res.errors).toBeDefined();
      });
    });

    it("return an error for non-exist course", async () => {
      const res = singleResult(
        await server.executeOperation(
          {
            query: DELETE_COURSE,
            variables: { id: "00000000-0000-0000-0000-000000000000" },
          },
          { contextValue: makeAdminContext(prisma, ADMIN_USER_ID) },
        ),
      );

      expect(res.errors).toBeDefined();
      expect(res.errors[0].message).toMatch(/course not found/i);
    });
  });

  describe("adminCourse", () => {
    it("return a single course by id", async () => {
      const course = await prisma.course.create({
        data: {
          title: "Single Lookup",
          status: "DRAFT",
          authorId: ADMIN_USER_ID,
        },
      });

      const res = singleResult(
        await server.executeOperation(
          { query: GET_COURSE, variables: { id: course.id } },
          { contextValue: makeAdminContext(prisma, ADMIN_USER_ID) },
        ),
      );

      expect(res.errors).toBeUndefined();
      expect(res.data.adminCourse.id).toBe(course.id);
      expect(res.data.adminCourse.title).toBe("Single Lookup");
    });

    it("return null for a non-exist id", async () => {
      const res = singleResult(
        await server.executeOperation(
          {
            query: GET_COURSE,
            variables: { id: "00000000-0000-0000-0000-000000000000" },
          },
          { contextValue: makeAdminContext(prisma, ADMIN_USER_ID) },
        ),
      );

      expect(res.errors).toBeUndefined();
      expect(res.data.adminCourse).toBeNull();
    });
  });
});
