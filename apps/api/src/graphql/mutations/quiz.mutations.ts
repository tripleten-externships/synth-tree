import { builder } from "@graphql/builder";
import { requireAdmin } from "@graphql/auth/requireAuth";
import { assertNodeOwnership } from "@graphql/auth/permissions";
import { GraphQLError } from "graphql";
import { QuestionType } from "../__generated__/inputs";
import { QuestionType as PrismaQuestionType } from "@prisma/client";

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
      requireAdmin(ctx);

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
      requireAdmin(ctx);

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
      requireAdmin(ctx);

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
      requireAdmin(ctx);

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
      requireAdmin(ctx);

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
      requireAdmin(ctx);

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
      requireAdmin(ctx);

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

      if (existing.type === PrismaQuestionType.SINGLE_CHOICE) {
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
      requireAdmin(ctx);

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

      if (existing.question.type === PrismaQuestionType.SINGLE_CHOICE) {
        for (let i = 0; i < existing.question.options.length; i++) {
          if (
            existing.question.options[i].isCorrect &&
            existing.question.options[i].id != id
          ) {
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
      requireAdmin(ctx);

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
}));
