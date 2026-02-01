import { builder } from "@graphql/builder";
import { requireAdmin } from "@graphql/auth/requireAuth";
import {
  assertCourseOwnership,
  assertTreeOwnership,
  assertNodeOwnership,
} from "@graphql/auth/permissions";

// Define all Quiz queries here
builder.queryFields((t) => ({
  // Fetch a single quiz by ID
  quiz: t.prismaField({
    type: "Quiz",
    nullable: true,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, _root, { id }, ctx) => {
      ctx.auth.requireAuth();

      // Fetch quiz from DB
      const quiz = await ctx.prisma.quiz.findFirst({
        ...query,
        where: { id, deletedAt: null },
      });

      return quiz; // Return whatever is found
    },
  }),

  // Fetch quizzes by nodeId
  quizzesByNode: t.prismaField({
    type: ["Quiz"],
    args: {
      nodeId: t.arg.id({ required: true }),
    },
    resolve: async (query, _root, { nodeId }, ctx) => {
      ctx.auth.requireAuth();
      assertNodeOwnership(ctx, nodeId);

      return ctx.prisma.quiz.findMany({
        ...query,
        where: { nodeId, deletedAt: null },
      });
    },
  }),

  // Fetch all quizzes (for now by node only, since treeId may not exist)
  quizzesByTree: t.prismaField({
    type: ["Quiz"],
    args: {
      nodeIds: t.arg.idList({ required: true }), // Replace treeId with nodeIds
    },
    resolve: async (query, _root, { nodeIds }, ctx) => {
      ctx.auth.requireAuth();

      return ctx.prisma.quiz.findMany({
        ...query,
        where: { nodeId: { in: nodeIds }, deletedAt: null },
        orderBy: { createdAt: "desc" },
      });
    },
  }),
}));
