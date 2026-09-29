import { ApolloServer } from "@apollo/server";
import { PrismaClient } from "@prisma/client";
import { GraphQLContext } from "@graphql/context";
import { getTestServer } from "./server";
import { makeAdminContext, makeUserContext, makeUnauthContext } from "./context";
import {
  seedUsers,
  cleanCourses,
  cleanAll,
  ADMIN_USER_ID,
  REGULAR_USER_ID,
  SECOND_REGULAR_USER_ID,
} from "./seed";

// Private User data (email, onboarding answers, progress, XP, ...) is only
// visible to the user themselves or an admin, however the User is reached.

const prisma = new PrismaClient();

function singleResult(result: any) {
  expect(result.body.kind).toBe("single");
  return result.body.singleResult;
}

// A published course by the admin, with one node that both learners have
// progress on.
async function seedPublishedCourse() {
  const course = await prisma.course.create({
    data: { title: "Published Course", status: "PUBLISHED", authorId: ADMIN_USER_ID },
  });
  const tree = await prisma.skillTree.create({
    data: { courseId: course.id, title: "Tree" },
  });
  const node = await prisma.skillNode.create({
    data: { treeId: tree.id, title: "Node", step: 1, orderInStep: 0 },
  });
  await prisma.userNodeProgress.createMany({
    data: [
      { userId: REGULAR_USER_ID, nodeId: node.id, status: "IN_PROGRESS" },
      { userId: SECOND_REGULAR_USER_ID, nodeId: node.id, status: "COMPLETED" },
    ],
  });
  return { course, tree, node };
}

const PUBLIC_COURSE_AUTHOR = `
  query PublicCourseAuthor($id: ID!) {
    publicCourse(id: $id) {
      id
      author {
        id
        name
        email
        timezone
        interests
        dailyGoalMinutes
        onboardingComplete
        nodeProgress { id }
        xpEvents { id }
        dailyQuests { questKey }
        hearts { currentHearts }
        xp { totalXp }
        streak { currentDays }
        coursesAuthored { id status }
        recommendedNext { id }
      }
    }
  }
`;

const SKILL_NODE_PROGRESS_USERS = `
  query SkillNodeProgressUsers($id: ID!) {
    skillNode(id: $id) {
      id
      progresses {
        userId
        user {
          id
          name
          email
          nodeProgress { id }
        }
      }
    }
  }
`;

const CURRENT_USER = `
  query CurrentUser {
    currentUser {
      id
      email
      timezone
      interests
      onboardingComplete
      nodeProgress { id }
    }
  }
`;

describe("User privacy", () => {
  let server: ApolloServer<GraphQLContext>;

  beforeAll(async () => {
    server = await getTestServer();
    await seedUsers(prisma);
  });

  afterEach(async () => {
    await cleanCourses(prisma);
    await prisma.userXp.deleteMany({ where: { userId: ADMIN_USER_ID } });
  });

  afterAll(async () => {
    await cleanAll(prisma);
    await prisma.$disconnect();
  });

  describe("publicCourse.author", () => {
    it("hides the author's private fields from a learner", async () => {
      const { course } = await seedPublishedCourse();
      const draft = await prisma.course.create({
        data: { title: "Draft Course", status: "DRAFT", authorId: ADMIN_USER_ID },
      });
      await prisma.userXp.create({ data: { userId: ADMIN_USER_ID, totalXp: 10 } });

      const res = singleResult(
        await server.executeOperation(
          { query: PUBLIC_COURSE_AUTHOR, variables: { id: course.id } },
          { contextValue: makeUserContext(prisma, REGULAR_USER_ID) },
        ),
      );

      expect(res.errors).toBeUndefined();
      const author = res.data.publicCourse.author;
      // Public profile stays readable for the byline.
      expect(author.id).toBe(ADMIN_USER_ID);
      expect(author.name).toBe("Test Admin");
      // Private data is withheld.
      expect(author.email).toBeNull();
      expect(author.timezone).toBeNull();
      expect(author.interests).toEqual([]);
      expect(author.dailyGoalMinutes).toBeNull();
      expect(author.onboardingComplete).toBeNull();
      expect(author.nodeProgress).toEqual([]);
      expect(author.xpEvents).toEqual([]);
      expect(author.dailyQuests).toEqual([]);
      expect(author.hearts).toBeNull();
      expect(author.xp).toBeNull();
      expect(author.streak).toBeNull();
      expect(author.recommendedNext).toEqual([]);
      // Only the author's published courses are listed.
      const authoredIds = author.coursesAuthored.map((c: { id: string }) => c.id);
      expect(authoredIds).toContain(course.id);
      expect(authoredIds).not.toContain(draft.id);
    });

    it("hides the author's email from a signed-out viewer", async () => {
      const { course } = await seedPublishedCourse();

      const res = singleResult(
        await server.executeOperation(
          { query: PUBLIC_COURSE_AUTHOR, variables: { id: course.id } },
          { contextValue: makeUnauthContext(prisma) },
        ),
      );

      expect(res.errors).toBeUndefined();
      expect(res.data.publicCourse.author.name).toBe("Test Admin");
      expect(res.data.publicCourse.author.email).toBeNull();
    });

    it("shows the author their own private fields", async () => {
      const { course } = await seedPublishedCourse();
      const draft = await prisma.course.create({
        data: { title: "Draft Course", status: "DRAFT", authorId: ADMIN_USER_ID },
      });
      await prisma.userXp.create({ data: { userId: ADMIN_USER_ID, totalXp: 10 } });

      const res = singleResult(
        await server.executeOperation(
          { query: PUBLIC_COURSE_AUTHOR, variables: { id: course.id } },
          { contextValue: makeAdminContext(prisma, ADMIN_USER_ID) },
        ),
      );

      expect(res.errors).toBeUndefined();
      const author = res.data.publicCourse.author;
      expect(author.email).toBe("admin@test.com");
      expect(author.timezone).toBe("UTC");
      expect(author.onboardingComplete).toBe(false);
      expect(author.xp).toEqual({ totalXp: 10 });
      const authoredIds = author.coursesAuthored.map((c: { id: string }) => c.id);
      expect(authoredIds).toEqual(expect.arrayContaining([course.id, draft.id]));
    });
  });

  describe("skillNode.progresses.user", () => {
    it("hides other learners' email and progress from a learner", async () => {
      const { node } = await seedPublishedCourse();

      const res = singleResult(
        await server.executeOperation(
          { query: SKILL_NODE_PROGRESS_USERS, variables: { id: node.id } },
          { contextValue: makeUserContext(prisma, REGULAR_USER_ID) },
        ),
      );

      expect(res.errors).toBeUndefined();
      const other = res.data.skillNode.progresses.find(
        (p: { userId: string }) => p.userId === SECOND_REGULAR_USER_ID,
      );
      expect(other.user.name).toBe("Test User 2");
      expect(other.user.email).toBeNull();
      expect(other.user.nodeProgress).toEqual([]);

      // The learner still sees their own.
      const own = res.data.skillNode.progresses.find(
        (p: { userId: string }) => p.userId === REGULAR_USER_ID,
      );
      expect(own.user.email).toBe("user@test.com");
      expect(own.user.nodeProgress).toHaveLength(1);
    });

    it("shows an admin every learner's email and progress", async () => {
      const { node } = await seedPublishedCourse();

      const res = singleResult(
        await server.executeOperation(
          { query: SKILL_NODE_PROGRESS_USERS, variables: { id: node.id } },
          { contextValue: makeAdminContext(prisma, ADMIN_USER_ID) },
        ),
      );

      expect(res.errors).toBeUndefined();
      const other = res.data.skillNode.progresses.find(
        (p: { userId: string }) => p.userId === SECOND_REGULAR_USER_ID,
      );
      expect(other.user.email).toBe("user2@test.com");
      expect(other.user.nodeProgress).toHaveLength(1);
    });
  });

  describe("currentUser", () => {
    it("returns the signed-in user's own private fields", async () => {
      await seedPublishedCourse();

      const res = singleResult(
        await server.executeOperation(
          { query: CURRENT_USER },
          { contextValue: makeUserContext(prisma, REGULAR_USER_ID) },
        ),
      );

      expect(res.errors).toBeUndefined();
      expect(res.data.currentUser.email).toBe("user@test.com");
      expect(res.data.currentUser.timezone).toBe("UTC");
      expect(res.data.currentUser.interests).toEqual([]);
      expect(res.data.currentUser.onboardingComplete).toBe(false);
      expect(res.data.currentUser.nodeProgress).toHaveLength(1);
    });
  });
});
