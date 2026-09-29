import { ApolloServer } from "@apollo/server";
import { CourseStatus, PrismaClient } from "@prisma/client";
import { GraphQLContext } from "@graphql/context";
import { getTestServer } from "./server";
import { makeAdminContext, makeUserContext } from "./context";
import {
  seedUsers,
  cleanCourses,
  cleanAll,
  ADMIN_USER_ID,
  REGULAR_USER_ID,
  SECOND_REGULAR_USER_ID,
} from "./seed";

// lessonBlock / lessonBlocks / lessonBlocksByNode and quiz / quizzesByNode /
// quizzesByTree must not expose draft or deleted course content to learners.
// Admins and the course's author still see it (the admin lesson editor reads
// lessonBlocksByNode).

const prisma = new PrismaClient();

function singleResult(result: any) {
  expect(result.body.kind).toBe("single");
  return result.body.singleResult;
}

async function seedContent(
  opts: {
    status?: CourseStatus;
    authorId?: string;
    courseDeleted?: boolean;
    treeDeleted?: boolean;
    nodeDeleted?: boolean;
    blockDeleted?: boolean;
  } = {},
) {
  const deletedAt = new Date();
  const course = await prisma.course.create({
    data: {
      title: "Course",
      status: opts.status ?? "PUBLISHED",
      authorId: opts.authorId ?? ADMIN_USER_ID,
      deletedAt: opts.courseDeleted ? deletedAt : null,
    },
  });
  const tree = await prisma.skillTree.create({
    data: {
      courseId: course.id,
      title: "Tree",
      deletedAt: opts.treeDeleted ? deletedAt : null,
    },
  });
  const node = await prisma.skillNode.create({
    data: {
      treeId: tree.id,
      title: "Node",
      step: 1,
      orderInStep: 0,
      deletedAt: opts.nodeDeleted ? deletedAt : null,
    },
  });
  // Blocks saved by the admin editor keep the default DRAFT status; learners
  // must still see them once the course is published.
  const block = await prisma.lessonBlocks.create({
    data: {
      nodeId: node.id,
      type: "HTML",
      html: "<p>Hello</p>",
      deletedAt: opts.blockDeleted ? deletedAt : null,
    },
  });
  const quiz = await prisma.quiz.create({
    data: { nodeId: node.id, title: "Quiz" },
  });
  return { course, tree, node, block, quiz };
}

const LESSON_BLOCK = `
  query LessonBlock($id: ID!) {
    lessonBlock(id: $id) {
      id
    }
  }
`;

const LESSON_BLOCKS = `
  query LessonBlocks {
    lessonBlocks(limit: 100) {
      id
    }
  }
`;

const LESSON_BLOCKS_BY_NODE = `
  query LessonBlocksByNode($nodeId: ID!) {
    lessonBlocksByNode(nodeId: $nodeId) {
      id
    }
  }
`;

const QUIZ = `
  query Quiz($id: ID!) {
    quiz(id: $id) {
      id
    }
  }
`;

const QUIZZES_BY_NODE = `
  query QuizzesByNode($nodeId: ID!) {
    quizzesByNode(nodeId: $nodeId) {
      id
    }
  }
`;

const QUIZZES_BY_TREE = `
  query QuizzesByTree($treeId: ID!) {
    quizzesByTree(treeId: $treeId) {
      id
    }
  }
`;

describe("lesson block and quiz queries", () => {
  let server: ApolloServer<GraphQLContext>;

  const asLearner = () => makeUserContext(prisma, SECOND_REGULAR_USER_ID);
  const asAuthor = () => makeUserContext(prisma, REGULAR_USER_ID);
  const asAdmin = () => makeAdminContext(prisma, ADMIN_USER_ID);

  async function run(
    query: string,
    variables: Record<string, unknown>,
    contextValue: GraphQLContext,
  ) {
    return singleResult(await server.executeOperation({ query, variables }, { contextValue }));
  }

  // Each hidden case: course draft, or course / tree / node soft-deleted.
  const hiddenCases = () =>
    Promise.all([
      seedContent({ status: "DRAFT" }),
      seedContent({ courseDeleted: true }),
      seedContent({ treeDeleted: true }),
      seedContent({ nodeDeleted: true }),
    ]);

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

  describe("lessonBlock(id)", () => {
    it("returns a block of a published course to a learner", async () => {
      const { block } = await seedContent();

      const res = await run(LESSON_BLOCK, { id: block.id }, asLearner());

      expect(res.errors).toBeUndefined();
      expect(res.data.lessonBlock).toEqual({ id: block.id });
    });

    it("returns null to a learner for a draft or deleted course, tree or node", async () => {
      for (const { block } of await hiddenCases()) {
        const res = await run(LESSON_BLOCK, { id: block.id }, asLearner());
        expect(res.errors).toBeUndefined();
        expect(res.data.lessonBlock).toBeNull();
      }
    });

    it("returns null to a learner for a deleted block", async () => {
      const { block } = await seedContent({ blockDeleted: true });

      const res = await run(LESSON_BLOCK, { id: block.id }, asLearner());

      expect(res.errors).toBeUndefined();
      expect(res.data.lessonBlock).toBeNull();
    });

    it("lets the course's author read a block of their own draft course", async () => {
      const { block } = await seedContent({ status: "DRAFT", authorId: REGULAR_USER_ID });

      const res = await run(LESSON_BLOCK, { id: block.id }, asAuthor());

      expect(res.errors).toBeUndefined();
      expect(res.data.lessonBlock).toEqual({ id: block.id });
    });

    it("lets an admin read a draft course's block", async () => {
      const { block } = await seedContent({ status: "DRAFT" });

      const res = await run(LESSON_BLOCK, { id: block.id }, asAdmin());

      expect(res.errors).toBeUndefined();
      expect(res.data.lessonBlock).toEqual({ id: block.id });
    });

    it("returns null for an unknown or malformed id instead of an error", async () => {
      for (const id of ["1", "00000000-0000-4000-8000-000000000000"]) {
        const res = await run(LESSON_BLOCK, { id }, asLearner());
        expect(res.errors).toBeUndefined();
        expect(res.data.lessonBlock).toBeNull();
      }
    });
  });

  describe("lessonBlocks", () => {
    it("lists only visible blocks for a learner, and everything for an admin", async () => {
      const published = await seedContent();
      const hidden = await hiddenCases();
      const deletedBlock = await seedContent({ blockDeleted: true });
      const hiddenIds = [...hidden, deletedBlock].map(({ block }) => block.id);

      const learner = await run(LESSON_BLOCKS, {}, asLearner());
      expect(learner.errors).toBeUndefined();
      const learnerIds = learner.data.lessonBlocks.map((b: { id: string }) => b.id);
      expect(learnerIds).toContain(published.block.id);
      for (const id of hiddenIds) expect(learnerIds).not.toContain(id);

      const admin = await run(LESSON_BLOCKS, {}, asAdmin());
      expect(admin.errors).toBeUndefined();
      const adminIds = admin.data.lessonBlocks.map((b: { id: string }) => b.id);
      expect(adminIds).toEqual(expect.arrayContaining([published.block.id, ...hiddenIds]));
    });
  });

  describe("lessonBlocksByNode", () => {
    it("returns a published course's blocks to a learner", async () => {
      const { node, block } = await seedContent();

      const res = await run(LESSON_BLOCKS_BY_NODE, { nodeId: node.id }, asLearner());

      expect(res.errors).toBeUndefined();
      expect(res.data.lessonBlocksByNode).toEqual([{ id: block.id }]);
    });

    it("returns nothing to a learner for a draft or deleted course, tree or node", async () => {
      for (const { node } of await hiddenCases()) {
        const res = await run(LESSON_BLOCKS_BY_NODE, { nodeId: node.id }, asLearner());
        expect(res.errors).toBeUndefined();
        expect(res.data.lessonBlocksByNode).toEqual([]);
      }
    });

    it("leaves out deleted blocks for a learner", async () => {
      const { node } = await seedContent({ blockDeleted: true });

      const res = await run(LESSON_BLOCKS_BY_NODE, { nodeId: node.id }, asLearner());

      expect(res.errors).toBeUndefined();
      expect(res.data.lessonBlocksByNode).toEqual([]);
    });

    it("returns a draft course's blocks to its author and to an admin", async () => {
      const { node, block } = await seedContent({ status: "DRAFT", authorId: REGULAR_USER_ID });

      for (const contextValue of [asAuthor(), asAdmin()]) {
        const res = await run(LESSON_BLOCKS_BY_NODE, { nodeId: node.id }, contextValue);
        expect(res.errors).toBeUndefined();
        expect(res.data.lessonBlocksByNode).toEqual([{ id: block.id }]);
      }
    });
  });

  describe("quiz(id)", () => {
    it("returns a quiz of a published course to a learner", async () => {
      const { quiz } = await seedContent();

      const res = await run(QUIZ, { id: quiz.id }, asLearner());

      expect(res.errors).toBeUndefined();
      expect(res.data.quiz).toEqual({ id: quiz.id });
    });

    it("returns null to a learner for a draft or deleted course, tree or node", async () => {
      for (const { quiz } of await hiddenCases()) {
        const res = await run(QUIZ, { id: quiz.id }, asLearner());
        expect(res.errors).toBeUndefined();
        expect(res.data.quiz).toBeNull();
      }
    });

    it("lets the course's author read a quiz of their own draft course", async () => {
      const { quiz } = await seedContent({ status: "DRAFT", authorId: REGULAR_USER_ID });

      const res = await run(QUIZ, { id: quiz.id }, asAuthor());

      expect(res.errors).toBeUndefined();
      expect(res.data.quiz).toEqual({ id: quiz.id });
    });

    it("lets an admin read a draft course's quiz", async () => {
      const { quiz } = await seedContent({ status: "DRAFT" });

      const res = await run(QUIZ, { id: quiz.id }, asAdmin());

      expect(res.errors).toBeUndefined();
      expect(res.data.quiz).toEqual({ id: quiz.id });
    });

    it("returns null for a malformed id instead of a database error", async () => {
      const res = await run(QUIZ, { id: "1" }, asLearner());

      expect(res.errors).toBeUndefined();
      expect(res.data.quiz).toBeNull();
    });
  });

  describe("quizzesByNode", () => {
    it("returns a published course's quiz to a learner", async () => {
      const { node, quiz } = await seedContent();

      const res = await run(QUIZZES_BY_NODE, { nodeId: node.id }, asLearner());

      expect(res.errors).toBeUndefined();
      expect(res.data.quizzesByNode).toEqual([{ id: quiz.id }]);
    });

    it("returns nothing to a learner for a draft or deleted course, tree or node", async () => {
      for (const { node } of await hiddenCases()) {
        const res = await run(QUIZZES_BY_NODE, { nodeId: node.id }, asLearner());
        expect(res.errors).toBeUndefined();
        expect(res.data.quizzesByNode).toEqual([]);
      }
    });

    it("returns a draft course's quiz to its author and to an admin", async () => {
      const { node, quiz } = await seedContent({ status: "DRAFT", authorId: REGULAR_USER_ID });

      for (const contextValue of [asAuthor(), asAdmin()]) {
        const res = await run(QUIZZES_BY_NODE, { nodeId: node.id }, contextValue);
        expect(res.errors).toBeUndefined();
        expect(res.data.quizzesByNode).toEqual([{ id: quiz.id }]);
      }
    });

    it("returns an empty list for a malformed node id", async () => {
      const res = await run(QUIZZES_BY_NODE, { nodeId: "not-a-uuid" }, asLearner());

      expect(res.errors).toBeUndefined();
      expect(res.data.quizzesByNode).toEqual([]);
    });
  });

  describe("quizzesByTree", () => {
    it("returns a published course's quizzes to a learner", async () => {
      const { tree, quiz } = await seedContent();

      const res = await run(QUIZZES_BY_TREE, { treeId: tree.id }, asLearner());

      expect(res.errors).toBeUndefined();
      expect(res.data.quizzesByTree).toEqual([{ id: quiz.id }]);
    });

    it("returns nothing to a learner for a draft or deleted course, tree or node", async () => {
      for (const { tree } of await hiddenCases()) {
        const res = await run(QUIZZES_BY_TREE, { treeId: tree.id }, asLearner());
        expect(res.errors).toBeUndefined();
        expect(res.data.quizzesByTree).toEqual([]);
      }
    });

    it("returns a draft course's quizzes to its author and to an admin", async () => {
      const { tree, quiz } = await seedContent({ status: "DRAFT", authorId: REGULAR_USER_ID });

      for (const contextValue of [asAuthor(), asAdmin()]) {
        const res = await run(QUIZZES_BY_TREE, { treeId: tree.id }, contextValue);
        expect(res.errors).toBeUndefined();
        expect(res.data.quizzesByTree).toEqual([{ id: quiz.id }]);
      }
    });

    it("returns an empty list for a malformed tree id", async () => {
      const res = await run(QUIZZES_BY_TREE, { treeId: "not-a-uuid" }, asLearner());

      expect(res.errors).toBeUndefined();
      expect(res.data.quizzesByTree).toEqual([]);
    });
  });
});
