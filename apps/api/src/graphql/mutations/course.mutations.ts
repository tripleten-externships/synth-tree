import { builder } from "@graphql/builder";
import { requireAdmin } from "@graphql/auth/requireAuth";
import { Prisma } from "@prisma/client";
import {
  CreateCourseInput,
  UpdateCourseInput,
} from "@graphql/inputs/course.inputs";
import { assertCourseOwnership } from "@graphql/auth/permissions";
import { GraphQLError } from "graphql";

builder.mutationFields((t) => ({
  // ===== Courses =====

  createCourse: t.prismaField({
    type: "Course",
    args: {
      input: t.arg({ type: CreateCourseInput, required: true }),
    },
    resolve: async (query, _root, { input }, ctx) => {
      const userId = ctx.auth.requireAuth();
      requireAdmin(ctx);

      return ctx.prisma.$transaction(async (tx) => {
        const course = await tx.course.create({
          data: {
            title: input.title,
            description: input.description ?? null,
            status: "DRAFT",
            authorId: userId,
            // deletedAt default null
          },
        });

        await tx.skillTree.create({
          data: {
            courseId: course.id,
            title: input.defaultTreeTitle ?? course.title,
            description: course.description ?? null,
          },
        });

        return tx.course.findUniqueOrThrow({
          ...query,
          where: { id: course.id },
        });
      });
    },
  }),

  updateCourse: t.prismaField({
    type: "Course",
    args: {
      id: t.arg.id({ required: true }),
      input: t.arg({ type: UpdateCourseInput, required: true }),
    },
    resolve: async (query, _root, { id, input }, ctx) => {
      ctx.auth.requireAuth();
      requireAdmin(ctx);

      await assertCourseOwnership(ctx, id);

      const { title, description, status } = input;

      const data: Prisma.CourseUpdateInput = {};

      // title is NOT nullable in Prisma, so exclude null
      if (title !== undefined && title !== null) {
        data.title = title;
      }

      if (description !== undefined) {
        data.description = description;
      }

      if (status !== undefined && status !== null) {
        data.status = status;
      }

      const updatedCourse = await ctx.prisma.course.update({
        ...query,
        where: { id },
        data,
      });

      return updatedCourse;
    },
  }),

  deleteCourse: t.prismaField({
    type: "Course",
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, _root, { id }, ctx) => {
      ctx.auth.requireAuth();
      requireAdmin(ctx);

      // 1. Ensure the course actually exists (minimal fetch, no query)
      const existing = await ctx.prisma.course.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new GraphQLError("Course not found");
      }

      // 2. Ownership / auth check
      await assertCourseOwnership(ctx, id);

      // 3. Delete and return the deleted entity using the GraphQL selection (`query`)
      const deleted = await ctx.prisma.course.delete({
        ...query,
        where: { id },
      });

      return deleted;
    },
  }),
}));
