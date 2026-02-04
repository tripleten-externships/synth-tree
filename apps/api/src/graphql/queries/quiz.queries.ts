import { builder } from "@graphql/builder";
import { assertNodeOwnership } from "@graphql/auth/permissions";

// Define all Quiz queries here
builder.queryFields((t) => ({
  /**
   * Fetch a single quiz by ID
   */
  quiz: t.prismaField({
    type: "Quiz",
    nullable: true,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, _root, { id }, ctx) => {
      ctx.auth.requireAuth();
      const isAdmin = ctx.auth.isAdmin();

      return ctx.prisma.quiz.findFirst({
        ...query,
        where: {
          id,
          deletedAt: null,
          ...(isAdmin ? {} : { published: true, node: { published: true } }),
        },
      });
    },
  }),

  /**
   * Fetch quiz by nodeId (1:1)
   */
  quizzesByNode: t.prismaField({
    type: "Quiz",
    nullable: true,
    args: {
      nodeId: t.arg.id({ required: true }),
    },
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
          ...(isAdmin ? {} : { published: true, node: { published: true } }),
        },
      });
    },
  }),

  /**
   * Fetch quizzes by treeId
   */
  quizzesByTree: t.prismaField({
    type: ["Quiz"],
    args: {
      treeId: t.arg.id({ required: true }),
    },
    resolve: async (query, _root, { treeId }, ctx) => {
      ctx.auth.requireAuth();
      const isAdmin = ctx.auth.isAdmin();

      if (isAdmin) {
        await ctx.auth.assertTreeOwnership(treeId);
      }

      return ctx.prisma.quiz.findMany({
        ...query,
        where: {
          deletedAt: null,
          node: {
            treeId,
            ...(isAdmin
              ? {}
              : {
                  published: true,
                  tree: { published: true },
                }),
          },
          ...(isAdmin ? {} : { published: true }),
        },
      });
    },
  }),
}));
