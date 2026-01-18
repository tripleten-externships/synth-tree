import { builder } from "@graphql/builder";
import { requireAdmin } from "@graphql/auth/requireAuth";
import { CourseStatus } from "@graphql/__generated__/inputs";
import { assertCourseOwnership } from "@graphql/auth/permissions";

builder.queryFields((t) => ({
  /**
   * Admin's own courses, with full nested content.
   * NOTE: This returns all trees/nodes/lessons/quiz for each course.
   */
  adminMyCoursesWithContent: t.prismaField({
    type: ["Course"],
    args: {
      status: t.arg({ type: CourseStatus, required: false }),
      search: t.arg.string({ required: false }),
      page: t.arg.int({ required: false }),
      limit: t.arg.int({ required: false }),
    },
    resolve: async (_query, _root, args, ctx) => {
      const userId = ctx.auth.requireAuth();
      requireAdmin(ctx);

      const { status, search, page = 1, limit = 20 } = args;

      return ctx.prisma.course.findMany({
        where: {
          authorId: userId,
          deletedAt: null,
          ...(status ? { status } : {}),
          ...(search
            ? {
                title: {
                  contains: search,
                  mode: "insensitive",
                },
              }
            : {}),
        },
        skip: (page! - 1) * limit!,
        take: limit!,
        orderBy: { createdAt: "desc" },
        include: {
          trees: {
            where: { deletedAt: null },
            include: {
              nodes: {
                where: { deletedAt: null },
                include: {
                  lessons: true,
                  quiz: true,
                  prerequisites: true,
                  requiredFor: true,
                  progresses: true,
                },
              },
            },
          },
        },
      });
    },
  }),

  adminMyCourse: t.prismaField({
    type: "Course",
    nullable: true,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, _root, { id }, ctx) => {
      const userId = ctx.auth.requireAuth();
      requireAdmin(ctx);

      await assertCourseOwnership(ctx, id);

      const course = await ctx.prisma.course.findFirst({
        ...query,
        where: {
          id,
          deletedAt: null,
          authorId: userId,
        },
      });

      return course;
    },
  }),
}));
