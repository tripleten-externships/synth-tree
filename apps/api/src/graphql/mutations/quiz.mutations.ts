import { builder } from "@graphql/builder";
import { requireAdmin } from "@graphql/auth/requireAuth";
import { Prisma } from "@prisma/client";
import { assertNodeOwnership } from "@graphql/auth/permissions";
import { GraphQLError } from "graphql";
import { updateOneSkillNodeMutationArgs } from "@graphql/__generated__/SkillNode/mutations/updateOne.base";

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
        include: {
          questions: { include: { options: true } },
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
          updatedAt: new Date(),
        },
        include: { questions: { include: { options: true } } },
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

      return deleted;
    },
  }),
}));
