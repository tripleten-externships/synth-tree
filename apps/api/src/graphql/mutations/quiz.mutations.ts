import { builder } from "@graphql/builder";
import { assertNodeOwnership } from "@graphql/auth/permissions";
import { GraphQLError } from "graphql";
import { QuestionType } from "../__generated__/inputs";
import { QuestionType as PrismaQuestionType } from "@prisma/client";
import { gradeQuizAttempt } from "src/services/quiz/gradeQuizAttempt";
import { incrementDailyQuestProgress } from "src/services/dailyQuests";
import logger from "@lib/logger"; // Structured logger used for tracking quiz-related events
import { QuizAnswerInput } from "../inputs/quiz.inputs";

builder.mutationFields((t) => ({
  createQuiz: t.prismaField({
    type: "Quiz",
    args: {
      nodeId: t.arg.string({ required: true }), //should be the same value as SkillNode ID
      title: t.arg.string({ required: true }),
      required: t.arg.boolean({ required: true }),
    },
    resolve: async (query, _root, { nodeId, title, required }, ctx) => {
      ctx.auth.requireAuth();

      await assertNodeOwnership(ctx, nodeId); //ensures that the user owns the current node

      const quiz = await ctx.prisma.quiz.create({
        ...query,
        data: {
          nodeId: nodeId,
          title: title,
          required: required,
        },
      });

      return quiz;
    },
  }),

  updateQuiz: t.prismaField({
    type: "Quiz",
    args: {
      id: t.arg.id({ required: true }),
      title: t.arg.string(),
      required: t.arg.boolean(),
    },
    resolve: async (query, _root, { id, title, required }, ctx) => {
      ctx.auth.requireAuth();

      const existing = await ctx.prisma.quiz.findUnique({
        where: { id },
        select: {
          nodeId: true,
        },
      });

      if (!existing) {
        throw new GraphQLError("Quiz not found");
      }

      await assertNodeOwnership(ctx, existing.nodeId);

      const quiz = await ctx.prisma.quiz.update({
        ...query,
        where: { id },
        data: {
          ...(title !== undefined && title !== null && { title }),
          ...(required !== undefined && required !== null && { required }),
        },
      });

      return quiz;
    },
  }),

  deleteQuiz: t.prismaField({
    type: "Quiz",
    args: { id: t.arg.id({ required: true }) },
    resolve: async (query, _root, { id }, ctx) => {
      ctx.auth.requireAuth();

      const existing = await ctx.prisma.quiz.findUnique({
        where: { id },
        select: {
          nodeId: true,
        },
      });

      if (!existing) {
        throw new GraphQLError("Quiz not found");
      }

      await assertNodeOwnership(ctx, existing.nodeId);

      const deleted = await ctx.prisma.quiz.delete({
        ...query,
        where: { id },
      });

      /* The code below is for soft deleting quizzes, but I decided not to use it because nodeId needs to be a unique ID. This means that you cannot make another quiz for the same node, even after deleting.

      const deleted = await ctx.prisma.quiz.update({
        ...query,
        where: { id },
        data: {
          deletedAt: new Date(),
        },
      });

      */

      return deleted;
    },
  }),

  // QuizQuestions

  createQuizQuestion: t.prismaField({
    type: "QuizQuestion",
    args: {
      quizId: t.arg.string({ required: true }),
      type: t.arg({
        type: QuestionType,
        required: true,
      }),
      prompt: t.arg.string({ required: true }), //actual question
      order: t.arg.int(),
    },
    resolve: async (query, _root, { quizId, type, prompt, order }, ctx) => {
      ctx.auth.requireAuth();

      const existing = await ctx.prisma.quiz.findUnique({
        where: { id: quizId },
        select: {
          nodeId: true,
        },
      });

      if (!existing) {
        throw new GraphQLError("Quiz not found");
      }

      await assertNodeOwnership(ctx, existing.nodeId);

      const quizQuestion = await ctx.prisma.quizQuestion.create({
        ...query,
        data: {
          quizId: quizId,
          type: type,
          prompt: prompt,
          ...(order !== undefined && order !== null && { order }),
        },
      });

      return quizQuestion;
    },
  }),

  updateQuizQuestion: t.prismaField({
    type: "QuizQuestion",
    args: {
      id: t.arg.id({ required: true }),
      prompt: t.arg.string(),
      order: t.arg.int(),
    },
    resolve: async (query, _root, { id, prompt, order }, ctx) => {
      ctx.auth.requireAuth();

      const existing = await ctx.prisma.quizQuestion.findUnique({
        where: { id },
        include: {
          quiz: { select: { nodeId: true } },
        },
      });

      if (!existing) {
        throw new GraphQLError("Quiz Question not found");
      }

      await assertNodeOwnership(ctx, existing.quiz.nodeId);

      const quizQuestion = await ctx.prisma.quizQuestion.update({
        ...query,
        where: { id },
        data: {
          ...(prompt !== undefined && prompt !== null && { prompt }),
          ...(order !== undefined && order !== null && { order }),
        },
      });

      return quizQuestion;
    },
  }),

  deleteQuizQuestion: t.prismaField({
    type: "QuizQuestion",
    args: { id: t.arg.id({ required: true }) },
    resolve: async (query, _root, { id }, ctx) => {
      ctx.auth.requireAuth();

      const existing = await ctx.prisma.quizQuestion.findUnique({
        where: { id },
        include: {
          quiz: { select: { nodeId: true } },
        },
      });

      if (!existing) {
        throw new GraphQLError("Quiz Question not found");
      }

      await assertNodeOwnership(ctx, existing.quiz.nodeId);

      const deleted = await ctx.prisma.quizQuestion.delete({
        ...query,
        where: { id },
      });

      return deleted;
    },
  }),

  // Quiz Options

  createQuizOption: t.prismaField({
    type: "QuizOption",
    args: {
      questionId: t.arg.string({ required: true }),
      text: t.arg.string({ required: true }),
      isCorrect: t.arg.boolean(), //defaults to false
    },
    resolve: async (query, _root, { questionId, text, isCorrect }, ctx) => {
      ctx.auth.requireAuth();

      const existing = await ctx.prisma.quizQuestion.findUnique({
        where: { id: questionId },

        select: {
          type: true,
          quiz: { select: { nodeId: true } },
          options: true,
        },
      });

      if (!existing) {
        throw new GraphQLError("Quiz Question not found");
      }

      await assertNodeOwnership(ctx, existing.quiz.nodeId);

      if (existing.type === PrismaQuestionType.OPEN_QUESTION) {
        throw new GraphQLError("You cannot have Quiz Options for an open ended question");
      }

      if (existing.type === PrismaQuestionType.SINGLE_CHOICE && isCorrect) {
        for (let i = 0; i < existing.options.length; i++) {
          if (existing.options[i].isCorrect) {
            throw new GraphQLError(
              "You cannot have multiple correct answers in a single choice question",
            );
          }
        }
      }

      const question = await ctx.prisma.quizOption.create({
        ...query,
        data: {
          questionId: questionId,
          text: text,
          ...(isCorrect !== undefined && isCorrect !== null && { isCorrect }),
        },
      });

      return question;
    },
  }),

  updateQuizOption: t.prismaField({
    type: "QuizOption",
    args: {
      id: t.arg.id({ required: true }),
      text: t.arg.string(),
      isCorrect: t.arg.boolean(),
    },
    resolve: async (query, _root, { id, text, isCorrect }, ctx) => {
      ctx.auth.requireAuth();

      const existing = await ctx.prisma.quizOption.findUnique({
        where: { id },
        select: {
          question: {
            select: {
              type: true,
              options: true,
              quiz: { select: { nodeId: true } },
            },
          },
        },
      });

      if (!existing) {
        throw new GraphQLError("Quiz Option not found");
      }

      await assertNodeOwnership(ctx, existing.question.quiz.nodeId);

      if (existing.question.type === PrismaQuestionType.SINGLE_CHOICE && isCorrect) {
        for (let i = 0; i < existing.question.options.length; i++) {
          if (existing.question.options[i].isCorrect && existing.question.options[i].id != id) {
            throw new GraphQLError(
              "You cannot have multiple correct answers in a single choice question",
            );
          }
        }
      }

      const quizOption = await ctx.prisma.quizOption.update({
        ...query,
        where: { id },
        data: {
          ...(text !== undefined && text !== null && { text }),
          ...(isCorrect !== undefined && isCorrect !== null && { isCorrect }),
        },
      });

      return quizOption;
    },
  }),

  deleteQuizOption: t.prismaField({
    type: "QuizOption",
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, _root, { id }, ctx) => {
      ctx.auth.requireAuth();

      const existing = await ctx.prisma.quizOption.findUnique({
        where: { id },
        include: {
          question: { include: { quiz: { select: { nodeId: true } } } },
        },
      });

      if (!existing) {
        throw new GraphQLError("Quiz Option not found");
      }

      await assertNodeOwnership(ctx, existing.question.quiz.nodeId);

      const quizOption = await ctx.prisma.quizOption.delete({
        ...query,
        where: { id },
      });

      return quizOption;
    },
  }),

  submitQuizAttempt: t.prismaField({
    type: "QuizAttempt",
    args: {
      quizId: t.arg.id({ required: true }),
      answers: t.arg({
        type: [QuizAnswerInput],
        required: true,
      }),
    },
    resolve: async (query, _root, { quizId, answers }, ctx) => {
      const userId = ctx.auth.requireAuth(); // Capture userId for logging and audit purposes

      const existing = await ctx.prisma.quiz.findUnique({
        where: { id: quizId },
      });

      if (!existing) {
        throw new GraphQLError("Quiz not found");
      }

      const progress = await ctx.prisma.userNodeProgress.findUnique({
        where: {
          userId_nodeId: {
            userId: userId,
            nodeId: existing.nodeId,
          },
        },
      });

      if (!progress) {
        throw new GraphQLError("No progress found for this quiz node");
      }

      const parsedAnswers = answers.map((a) => ({
        questionId: a.questionId,
        answer:
          a.text !== undefined && a.text !== null
            ? { text: a.text }
            : { selectedOptionIds: a.selectedOptionIds ?? [] },
      }));

      const result = await ctx.prisma.$transaction(async (tx) => {
        const quizAttempt = await tx.quizAttempt.create({
          ...query,
          data: {
            quizId,
            userId,
            passed: false,
            answers: {
              create: parsedAnswers.map(({ questionId, answer }) => ({
                questionId,
                answer,
              })),
            },
          },
        });

        const summary = await gradeQuizAttempt(tx, quizAttempt.id);

        return {
          quizAttempt,
          summary,
        };
      });

      const { summary } = result;
      if (summary.passed === true && summary.correctCount === summary.totalQuestions) {
        await incrementDailyQuestProgress(ctx.prisma, userId, "PERFECT_QUIZ");
      }

      logger.info({ userId, quizId, passed: summary.passed }, "Quiz attempt submitted");

      return ctx.prisma.quizAttempt.findUniqueOrThrow({
        ...query,
        where: { id: result.quizAttempt.id },
      });
    },
  }),
}));
