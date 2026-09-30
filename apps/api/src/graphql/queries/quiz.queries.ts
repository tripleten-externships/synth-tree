import { builder } from "@graphql/builder";
import { visibleNodeWhere } from "@graphql/auth/visibility";
import { isUuid } from "@lib/uuid";

/**
 * Quiz Queries
 *
 * Auth rules:
 * - All queries require authentication
 * - Students can only see quizzes from published courses, or courses they authored
 *   (nothing soft-deleted; see visibleNodeWhere)
 * - Admins can see all quizzes
 */

builder.queryFields((t) => ({
  /**
   * Get a single quiz by ID with questions and options
   * Students can only access quizzes from published courses
   */
  quiz: t.prismaField({
    type: "Quiz",
    nullable: true,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, _root, { id }, ctx) => {
      ctx.auth.requireAuth();
      // A malformed id can't match any quiz; don't let Postgres reject it.
      if (!isUuid(id)) return null;

      const quiz = await ctx.prisma.quiz.findFirst({
        ...query,
        where: {
          id,
          deletedAt: null,
          node: visibleNodeWhere(ctx),
        },
        include: {
          questions: {
            orderBy: { order: "asc" },
            include: {
              options: true,
            },
          },
        },
      });

      return quiz;
    },
  }),

  /**
   * Get quiz by node ID (0 or 1 due to 1:1 relationship)
   * Students can only access quizzes from published courses
   */
  quizzesByNode: t.prismaField({
    type: ["Quiz"],
    args: {
      nodeId: t.arg.id({ required: true }),
    },
    resolve: async (query, _root, { nodeId }, ctx) => {
      ctx.auth.requireAuth();
      if (!isUuid(nodeId)) return [];

      return ctx.prisma.quiz.findMany({
        ...query,
        where: {
          nodeId,
          deletedAt: null,
          node: visibleNodeWhere(ctx),
        },
        include: {
          questions: {
            orderBy: { order: "asc" },
            include: {
              options: true,
            },
          },
        },
      });
    },
  }),

  /**
   * Get all quizzes in a skill tree
   * Students can only access quizzes from published courses
   */
  quizzesByTree: t.prismaField({
    type: ["Quiz"],
    args: {
      treeId: t.arg.id({ required: true }),
    },
    resolve: async (query, _root, { treeId }, ctx) => {
      ctx.auth.requireAuth();
      if (!isUuid(treeId)) return [];

      return ctx.prisma.quiz.findMany({
        ...query,
        where: {
          deletedAt: null,
          node: {
            treeId,
            deletedAt: null,
            ...visibleNodeWhere(ctx),
          },
        },
        include: {
          questions: {
            orderBy: { order: "asc" },
            include: {
              options: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    },
  }),
}));
