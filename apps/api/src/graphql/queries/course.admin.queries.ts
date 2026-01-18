import { builder } from "@graphql/builder";
import { requireAdmin } from "@graphql/auth/requireAuth";
import { CourseStatus } from "@graphql/__generated__/inputs";
import {
  assertCourseOwnership,
  assertTreeOwnership,
  assertNodeOwnership,
} from "@graphql/auth/permissions";

// All Admin Get All of Courses, Trees and Nodes .
// Mutations enfore ownership.
// Seperate queries exist for owner to get their own (courses, trees and nodes)
builder.queryFields((t) => ({
  adminGetAllCourses: t.prismaField({
    type: ["Course"],
    args: {
      status: t.arg({ type: CourseStatus, required: false }),
      search: t.arg.string({ required: false }),
      page: t.arg.int({ required: false }),
      limit: t.arg.int({ required: false }),
    },
    resolve: async (query, _root, args, ctx) => {
      ctx.auth.requireAuth();
      requireAdmin(ctx);

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
   * Single course by id, any ADMIN can see any course.
   */
  adminCourse: t.prismaField({
    type: "Course",
    nullable: true,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, _root, { id }, ctx) => {
      ctx.auth.requireAuth();
      requireAdmin(ctx);

      const course = await ctx.prisma.course.findFirst({
        ...query,
        where: {
          id,
          deletedAt: null,
        },
      });

      return course;
    },
  }),
}));
