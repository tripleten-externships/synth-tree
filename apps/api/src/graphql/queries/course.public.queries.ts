import { builder } from "@graphql/builder";
import { CourseStatus } from "@graphql/__generated__/inputs";

// Public access to multiple courses.

builder.queryFields((t) => ({
  publicGetAllCourses: t.prismaField({
    type: ["Course"],
    args: {
      status: t.arg({ type: CourseStatus, required: false }),
      search: t.arg.string({ required: false }),
      page: t.arg.int({ required: false }),
      limit: t.arg.int({ required: false }),
    },
    resolve: async (query, _root, args, ctx) => {

      const { status, search, page = 1, limit = 20 } = args;

      return ctx.prisma.course.findMany({
        ...query,
        where: {
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
      });
    },
  }),

  /**
   * Single course by id, any PUBLIC user can see any published course.
   */
  publicCourse: t.prismaField({
    type: "Course",
    nullable: true,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, _root, { id }, ctx) => {
      const course = await ctx.prisma.course.findFirst({
        ...query,
        where: {
          id,
          status: "PUBLISHED",
          deletedAt: null,
        },
      });

      return course;
    },
  }),
}));