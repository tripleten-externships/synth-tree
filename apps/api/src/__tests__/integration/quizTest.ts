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

async function seedNode(authorId: string = ADMIN_USER_ID) {
  const course = await prisma.course.create({
    data: { title: "Quiz Course", status: "DRAFT", authorId },
  });
  const tree = await prisma.skillTree.create({
    data: { courseId: course.id, title: "Quiz Tree" },
  });
  const node = await prisma.skillNode.create({
    data: { treeId: tree.id, title: "Quiz Node", step: 1, orderInStep: 0 },
  });
  return { course, tree, node };
}

const CREATE_QUIZ = `
  mutation CreateQuiz($nodeId: String!, $title: String!, $required: Boolean!) {
    createQuiz(nodeId: $nodeId, title: $title, required: $required) {
      id
      title
      required
    }
  }
`;

const CREATE_QUESTION = `
  mutation CreateQuizQuestion($quizId: String!, $type: QuestionType!, $prompt: String!) {
    createQuizQuestion(quizId: $quizId, type: $type, prompt: $prompt) {
      id
      type
      prompt
    }
  }
`;

const CREATE_OPTION = `
  mutation CreateQuizOption($questionId: String!, $text: String!, $isCorrect: Boolean) {
    createQuizOption(questionId: $questionId, text: $text, isCorrect: $isCorrect) {
      id
      text
      isCorrect
    }
  }
`;

const SUBMIT_ATTEMPT = `
  mutation SubmitQuizAttempt($quizId: ID!, $answers: [String!]!) {
    submitQuizAttempt(quizId: $quizId, answers: $answers) {
      id
      passed
    }
  }
`;

const DELETE_QUIZ = `
  mutation DeleteQuiz($id: ID!) {
    deleteQuiz(id: $id) {
      id
    }
  }
`;

describe("Quiz flow", () => {
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

  describe("createQuiz", () => {
    it("create a quiz for a node", async () => {
      const { node } = await seedNode();

      const res = singleResult(
        await server.executeOperation(
          {
            query: CREATE_QUIZ,
            variables: {
              nodeId: node.id,
              title: "Testing Quiz",
              required: true,
            },
          },
          { contextValue: makeAdminContext(prisma, ADMIN_USER_ID) },
        ),
      );

      expect(res.errors).toBeUndefined();
      expect(res.data.createQuiz.title).toBe("Testing Quiz");
      expect(res.data.createQuiz.required).toBe(true);
    });

    it("allow any authenticated user to create a quiz on their own node", async () => {
      const { node } = await seedNode(REGULAR_USER_ID);

      const res = singleResult(
        await server.executeOperation(
          {
            query: CREATE_QUIZ,
            variables: { nodeId: node.id, title: "User Quiz", required: false },
          },
          { contextValue: makeUserContext(prisma, REGULAR_USER_ID) },
        ),
      );

      expect(res.errors).toBeUndefined();
      expect(res.data.createQuiz.title).toBe("User Quiz");
    });

    it("allow admin to create a quiz on any node", async () => {
      const { node } = await seedNode(REGULAR_USER_ID);

      const res = singleResult(
        await server.executeOperation(
          {
            query: CREATE_QUIZ,
            variables: {
              nodeId: node.id,
              title: "Admin Quiz",
              required: false,
            },
          },
          { contextValue: makeAdminContext(prisma, ADMIN_USER_ID) },
        ),
      );

      expect(res.errors).toBeUndefined();
      expect(res.data.createQuiz.title).toBe("Admin Quiz");
    });

    it("block a user from creating a quiz on another user's node", async () => {
      const { node } = await seedNode(REGULAR_USER_ID);

      const res = singleResult(
        await server.executeOperation(
          {
            query: CREATE_QUIZ,
            variables: {
              nodeId: node.id,
              title: "Stolen Quiz",
              required: false,
            },
          },
          { contextValue: makeUserContext(prisma, SECOND_REGULAR_USER_ID) },
        ),
      );

      expect(res.errors).toBeDefined();
    });

    it("block unauthenticated user from creating a quiz", async () => {
      const { node } = await seedNode();

      const res = singleResult(
        await server.executeOperation(
          {
            query: CREATE_QUIZ,
            variables: {
              nodeId: node.id,
              title: "Unauth Quiz",
              required: false,
            },
          },
          { contextValue: makeUnauthContext(prisma) },
        ),
      );

      expect(res.errors).toBeDefined();
    });
  });

  describe("invalid input", () => {
    it("reject createQuizQuestion for a non-exist quiz", async () => {
      const res = singleResult(
        await server.executeOperation(
          {
            query: CREATE_QUESTION,
            variables: {
              quizId: "00000000-0000-0000-0000-000000000000",
              type: "SINGLE_CHOICE",
              prompt: "not exist quiz",
            },
          },
          { contextValue: makeAdminContext(prisma, ADMIN_USER_ID) },
        ),
      );

      expect(res.errors).toBeDefined();
      expect(res.errors[0].message).toMatch(/quiz not found/i);
    });

    it("reject submitQuizAttempt with wrong formatted answer", async () => {
      const { node } = await seedNode();
      const quiz = await prisma.quiz.create({
        data: { nodeId: node.id, title: "Random Quiz", required: false },
      });

      const res = singleResult(
        await server.executeOperation(
          {
            query: SUBMIT_ATTEMPT,
            variables: { quizId: quiz.id, answers: ["not valid json {{{"] },
          },
          { contextValue: makeUserContext(prisma, REGULAR_USER_ID) },
        ),
      );

      expect(res.errors).toBeDefined();
    });
  });

  describe("createQuizQuestion", () => {
    it("create a SINGLE_CHOICE question", async () => {
      const { node } = await seedNode();
      const quiz = await prisma.quiz.create({
        data: { nodeId: node.id, title: "Q Test", required: false },
      });

      const res = singleResult(
        await server.executeOperation(
          {
            query: CREATE_QUESTION,
            variables: {
              quizId: quiz.id,
              type: "SINGLE_CHOICE",
              prompt: "What is ...",
            },
          },
          { contextValue: makeAdminContext(prisma, ADMIN_USER_ID) },
        ),
      );

      expect(res.errors).toBeUndefined();
      expect(res.data.createQuizQuestion.type).toBe("SINGLE_CHOICE");
      expect(res.data.createQuizQuestion.prompt).toBe("What is ...");
    });

    it("create an OPEN_QUESTION", async () => {
      const { node } = await seedNode();
      const quiz = await prisma.quiz.create({
        data: { nodeId: node.id, title: "Open Test", required: false },
      });

      const res = singleResult(
        await server.executeOperation(
          {
            query: CREATE_QUESTION,
            variables: {
              quizId: quiz.id,
              type: "OPEN_QUESTION",
              prompt: "Explain...",
            },
          },
          { contextValue: makeAdminContext(prisma, ADMIN_USER_ID) },
        ),
      );

      expect(res.errors).toBeUndefined();
      expect(res.data.createQuizQuestion.type).toBe("OPEN_QUESTION");
      expect(res.data.createQuizQuestion.prompt).toBe("Explain...");
    });
  });

  describe("createQuizOption", () => {
    it("reject adding an option to an OPEN_QUESTION", async () => {
      const { node } = await seedNode();
      const quiz = await prisma.quiz.create({
        data: { nodeId: node.id, title: "Open Quiz", required: false },
      });
      const question = await prisma.quizQuestion.create({
        data: { quizId: quiz.id, type: "OPEN_QUESTION", prompt: "Describe..." },
      });

      const res = singleResult(
        await server.executeOperation(
          {
            query: CREATE_OPTION,
            variables: {
              questionId: question.id,
              text: "Option A",
              isCorrect: false,
            },
          },
          { contextValue: makeAdminContext(prisma, ADMIN_USER_ID) },
        ),
      );

      expect(res.errors).toBeDefined();
      expect(res.errors[0].message).toMatch(/open ended/i);
    });

    it("reject a second correct answer on SINGLE_CHOICE", async () => {
      const { node } = await seedNode();
      const quiz = await prisma.quiz.create({
        data: { nodeId: node.id, title: "Single Quiz", required: false },
      });
      const question = await prisma.quizQuestion.create({
        data: { quizId: quiz.id, type: "SINGLE_CHOICE", prompt: "Pick one" },
      });
      await prisma.quizOption.create({
        data: { questionId: question.id, text: "Option A", isCorrect: true },
      });

      const res = singleResult(
        await server.executeOperation(
          {
            query: CREATE_OPTION,
            variables: {
              questionId: question.id,
              text: "Option B",
              isCorrect: true,
            },
          },
          { contextValue: makeAdminContext(prisma, ADMIN_USER_ID) },
        ),
      );

      expect(res.errors).toBeDefined();
      expect(res.errors[0].message).toMatch(/multiple correct/i);
    });
  });

  describe("deleteQuiz", () => {
    it("delete a quiz and removes it from the database", async () => {
      const { node } = await seedNode();
      const quiz = await prisma.quiz.create({
        data: { nodeId: node.id, title: "Delete Quiz", required: false },
      });

      const res = singleResult(
        await server.executeOperation(
          { query: DELETE_QUIZ, variables: { id: quiz.id } },
          { contextValue: makeAdminContext(prisma, ADMIN_USER_ID) },
        ),
      );

      expect(res.errors).toBeUndefined();
      expect(res.data.deleteQuiz.id).toBe(quiz.id);
      const deleted = await prisma.quiz.findUnique({ where: { id: quiz.id } });
      expect(deleted).toBeNull();
    });

    it("allow the quiz owner to delete their own quiz", async () => {
      const { node } = await seedNode(REGULAR_USER_ID);
      const quiz = await prisma.quiz.create({
        data: { nodeId: node.id, title: "Owner Delete Quiz", required: false },
      });

      const res = singleResult(
        await server.executeOperation(
          { query: DELETE_QUIZ, variables: { id: quiz.id } },
          { contextValue: makeUserContext(prisma, REGULAR_USER_ID) },
        ),
      );

      expect(res.errors).toBeUndefined();
      expect(res.data.deleteQuiz.id).toBe(quiz.id);
    });

    it("allow admin to delete any quiz", async () => {
      const { node } = await seedNode(REGULAR_USER_ID);
      const quiz = await prisma.quiz.create({
        data: { nodeId: node.id, title: "Admin Delete Quiz", required: false },
      });

      const res = singleResult(
        await server.executeOperation(
          { query: DELETE_QUIZ, variables: { id: quiz.id } },
          { contextValue: makeAdminContext(prisma, ADMIN_USER_ID) },
        ),
      );

      expect(res.errors).toBeUndefined();
      expect(res.data.deleteQuiz.id).toBe(quiz.id);
    });

    it("block a user from deleting a quiz on another user's course", async () => {
      const { node } = await seedNode(REGULAR_USER_ID);
      const quiz = await prisma.quiz.create({
        data: { nodeId: node.id, title: "User1 Quiz", required: false },
      });

      const res = singleResult(
        await server.executeOperation(
          { query: DELETE_QUIZ, variables: { id: quiz.id } },
          { contextValue: makeUserContext(prisma, SECOND_REGULAR_USER_ID) },
        ),
      );

      expect(res.errors).toBeDefined();
    });

    it("block unauthenticated user from deleting a quiz", async () => {
      const { node } = await seedNode();
      const quiz = await prisma.quiz.create({
        data: { nodeId: node.id, title: "Unauth Delete Quiz", required: false },
      });

      const res = singleResult(
        await server.executeOperation(
          { query: DELETE_QUIZ, variables: { id: quiz.id } },
          { contextValue: makeUnauthContext(prisma) },
        ),
      );

      expect(res.errors).toBeDefined();
    });
  });

  describe("submitQuizAttempt", () => {
    it("passed when all SINGLE_CHOICE answers are correct", async () => {
      const { node } = await seedNode();
      const quiz = await prisma.quiz.create({
        data: { nodeId: node.id, title: "Pass Quiz", required: true },
      });
      const question = await prisma.quizQuestion.create({
        data: {
          quizId: quiz.id,
          type: "SINGLE_CHOICE",
          prompt: "something?",
        },
      });
      const correctOption = await prisma.quizOption.create({
        data: { questionId: question.id, text: "A", isCorrect: true },
      });
      await prisma.quizOption.create({
        data: { questionId: question.id, text: "B", isCorrect: false },
      });

      const answer = JSON.stringify({
        questionId: question.id,
        answer: { selectedOptionIds: [correctOption.id] },
      });

      const res = singleResult(
        await server.executeOperation(
          {
            query: SUBMIT_ATTEMPT,
            variables: { quizId: quiz.id, answers: [answer] },
          },
          { contextValue: makeUserContext(prisma, REGULAR_USER_ID) },
        ),
      );

      expect(res.errors).toBeUndefined();
      expect(res.data.submitQuizAttempt.passed).toBe(true);
    });

    it("fail when a SINGLE_CHOICE answer is wrong", async () => {
      const { node } = await seedNode();
      const quiz = await prisma.quiz.create({
        data: { nodeId: node.id, title: "Fail Quiz", required: true },
      });
      const question = await prisma.quizQuestion.create({
        data: {
          quizId: quiz.id,
          type: "SINGLE_CHOICE",
          prompt: "something?",
        },
      });
      await prisma.quizOption.create({
        data: { questionId: question.id, text: "A", isCorrect: true },
      });
      const wrongOption = await prisma.quizOption.create({
        data: { questionId: question.id, text: "B", isCorrect: false },
      });

      const answer = JSON.stringify({
        questionId: question.id,
        answer: { selectedOptionIds: [wrongOption.id] },
      });

      const res = singleResult(
        await server.executeOperation(
          {
            query: SUBMIT_ATTEMPT,
            variables: { quizId: quiz.id, answers: [answer] },
          },
          { contextValue: makeUserContext(prisma, REGULAR_USER_ID) },
        ),
      );

      expect(res.errors).toBeUndefined();
      expect(res.data.submitQuizAttempt.passed).toBe(false);
    });

    it("passed when all MULTIPLE_CHOICE answers are correct", async () => {
      const { node } = await seedNode();
      const quiz = await prisma.quiz.create({
        data: { nodeId: node.id, title: "Mult Quiz", required: true },
      });
      const question = await prisma.quizQuestion.create({
        data: {
          quizId: quiz.id,
          type: "MULTIPLE_CHOICE",
          prompt: "Select all...",
        },
      });
      const opt2 = await prisma.quizOption.create({
        data: { questionId: question.id, text: "2", isCorrect: true },
      });
      const opt3 = await prisma.quizOption.create({
        data: { questionId: question.id, text: "3", isCorrect: true },
      });
      await prisma.quizOption.create({
        data: { questionId: question.id, text: "4", isCorrect: false },
      });

      const answer = JSON.stringify({
        questionId: question.id,
        answer: { selectedOptionIds: [opt2.id, opt3.id] },
      });

      const res = singleResult(
        await server.executeOperation(
          {
            query: SUBMIT_ATTEMPT,
            variables: { quizId: quiz.id, answers: [answer] },
          },
          { contextValue: makeUserContext(prisma, REGULAR_USER_ID) },
        ),
      );

      expect(res.errors).toBeUndefined();
      expect(res.data.submitQuizAttempt.passed).toBe(true);
    });

    it("return false for OPEN_QUESTION", async () => {
      const { node } = await seedNode();
      const quiz = await prisma.quiz.create({
        data: { nodeId: node.id, title: "Open Quiz", required: true },
      });
      const question = await prisma.quizQuestion.create({
        data: {
          quizId: quiz.id,
          type: "OPEN_QUESTION",
          prompt: "Explain something...",
        },
      });

      const answer = JSON.stringify({
        questionId: question.id,
        answer: {
          text: "......",
        },
      });

      const res = singleResult(
        await server.executeOperation(
          {
            query: SUBMIT_ATTEMPT,
            variables: { quizId: quiz.id, answers: [answer] },
          },
          { contextValue: makeUserContext(prisma, REGULAR_USER_ID) },
        ),
      );

      expect(res.errors).toBeUndefined();
      expect(res.data.submitQuizAttempt.passed).toBe(false);
    });

    it("store the attempt in the database", async () => {
      const { node } = await seedNode();
      const quiz = await prisma.quiz.create({
        data: { nodeId: node.id, title: "DB Check Quiz", required: false },
      });
      const question = await prisma.quizQuestion.create({
        data: { quizId: quiz.id, type: "SINGLE_CHOICE", prompt: "What is ..." },
      });
      const correct = await prisma.quizOption.create({
        data: { questionId: question.id, text: "2", isCorrect: true },
      });

      const answer = JSON.stringify({
        questionId: question.id,
        answer: { selectedOptionIds: [correct.id] },
      });

      const res = singleResult(
        await server.executeOperation(
          {
            query: SUBMIT_ATTEMPT,
            variables: { quizId: quiz.id, answers: [answer] },
          },
          { contextValue: makeUserContext(prisma, REGULAR_USER_ID) },
        ),
      );

      const attemptId = res.data.submitQuizAttempt.id;
      const stored = await prisma.quizAttempt.findUnique({
        where: { id: attemptId },
        include: { answers: true },
      });

      expect(stored).not.toBeNull();
      expect(stored!.userId).toBe(REGULAR_USER_ID);
      expect(stored!.answers).toHaveLength(1);
    });

    it("reject submission for a non-exist quiz", async () => {
      const answer = JSON.stringify({
        questionId: "some-id",
        answer: { selectedOptionIds: [] },
      });

      const res = singleResult(
        await server.executeOperation(
          {
            query: SUBMIT_ATTEMPT,
            variables: {
              quizId: "00000000-0000-0000-0000-000000000000",
              answers: [answer],
            },
          },
          { contextValue: makeUserContext(prisma, REGULAR_USER_ID) },
        ),
      );

      expect(res.errors).toBeDefined();
      expect(res.errors[0].message).toMatch(/quiz not found/i);
    });

    it("block unauthenticated user from submitting", async () => {
      const { node } = await seedNode();
      const quiz = await prisma.quiz.create({
        data: { nodeId: node.id, title: "Auth", required: false },
      });

      const res = singleResult(
        await server.executeOperation(
          {
            query: SUBMIT_ATTEMPT,
            variables: { quizId: quiz.id, answers: [] },
          },
          { contextValue: makeUnauthContext(prisma) },
        ),
      );

      expect(res.errors).toBeDefined();
    });
  });
});
