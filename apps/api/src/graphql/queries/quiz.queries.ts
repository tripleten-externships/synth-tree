import { builder } from "@graphql/builder";
import {
  assertNodeOwnership,
  assertTreeOwnership,
} from "@graphql/auth/permissions";

builder.queryFields((t) => ({
  quiz: t.prismaField({
    type: "Quiz",
    nullable: true,
    args: { id: t.arg.id({ required: true }) },
    resolve: async (query, _root, { id }, ctx) => {
      ctx.auth.requireAuth();
      const isAdmin = ctx.auth.isAdmin();

      return ctx.prisma.quiz.findFirst({
        ...query,
        where: {
          id,
          deletedAt: null,
          ...(isAdmin
            ? {}
            : {
                published: true,
                node: { published: true, tree: { published: true } },
              }),
        },
      });
    },
  }),

  quizzesByNode: t.prismaField({
    type: "Quiz",
    nullable: true,
    args: { nodeId: t.arg.id({ required: true }) },
    resolve: async (query, _root, { nodeId }, ctx) => {
      ctx.auth.requireAuth();
      const isAdmin = ctx.auth.isAdmin();

      if (isAdmin) {
        await assertNodeOwnership(ctx, nodeId);
      }

      return ctx.prisma.quiz.findFirst({
        ...query,
        where: {
          nodeId,
          deletedAt: null,
          ...(isAdmin
            ? {}
            : {
                published: true,
                node: { published: true, tree: { published: true } },
              }),
        },
      });
    },
  }),

  quizzesByTree: t.prismaField({
    type: ["Quiz"],
    args: { treeId: t.arg.id({ required: true }) },
    resolve: async (query, _root, { treeId }, ctx) => {
      ctx.auth.requireAuth();
      const isAdmin = ctx.auth.isAdmin();

      if (isAdmin) {
        await assertTreeOwnership(ctx, treeId);
      }

      return ctx.prisma.quiz.findMany({
        ...query,
        where: {
          deletedAt: null,
          node: {
            treeId,
            ...(isAdmin ? {} : { published: true, tree: { published: true } }),
          },
          ...(isAdmin ? {} : { published: true }),
        },
        orderBy: { createdAt: "desc" },
      });
    },
  }),
}));
