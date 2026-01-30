import { builder } from "@graphql/builder";
import { requireAdmin } from "@graphql/auth/requireAuth";
import { assertNodeOwnership } from "@graphql/auth/permissions";
import { GraphQLError } from "graphql";

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
}));
