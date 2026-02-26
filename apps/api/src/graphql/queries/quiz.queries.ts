import { builder } from "@graphql/builder";

/**
 * Quiz Queries
 *
 * Auth rules:
 * - All queries require authentication
 * - Students can only see quizzes from published courses
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

      const isAdmin = ctx.auth.isAdmin();

      // Build where clause based on user role
      const whereClause: any = {
        id,
        deletedAt: null,
      };

      // Students can only see quizzes from published courses
      if (!isAdmin) {
        whereClause.node = {
          deletedAt: null,
          tree: {
            deletedAt: null,
            course: {
              deletedAt: null,
              status: "PUBLISHED",
            },
          },
        };
      }

      const quiz = await ctx.prisma.quiz.findFirst({
        ...query,
        where: whereClause,
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

      const isAdmin = ctx.auth.isAdmin();

      // Build where clause based on user role
      const whereClause: any = {
        nodeId,
        deletedAt: null,
      };

      // Students can only see quizzes from published courses
      if (!isAdmin) {
        whereClause.node = {
          deletedAt: null,
          tree: {
            deletedAt: null,
            course: {
              deletedAt: null,
              status: "PUBLISHED",
            },
          },
        };
      }

      return ctx.prisma.quiz.findMany({
        ...query,
        where: whereClause,
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

      const isAdmin = ctx.auth.isAdmin();

      // Build where clause based on user role
      const whereClause: any = {
        deletedAt: null,
        node: {
          treeId,
          deletedAt: null,
        },
      };

      // Students can only see quizzes from published courses
      if (!isAdmin) {
        whereClause.node.tree = {
          deletedAt: null,
          course: {
            deletedAt: null,
            status: "PUBLISHED",
          },
        };
      }

      return ctx.prisma.quiz.findMany({
        ...query,
        where: whereClause,
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
