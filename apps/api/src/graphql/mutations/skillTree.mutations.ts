// src/graphql/admin/admin.mutations.ts
import { builder } from "@graphql/builder";
import { requireAdmin } from "@graphql/auth/requireAuth";
import {
  CreateSkillTreeInput,
  UpdateSkillTreeInput,
} from "@graphql/inputs/skillTree.inputs";
import {
  assertCourseOwnership,
  assertTreeOwnership,
} from "@graphql/auth/permissions";
import { GraphQLError } from "graphql";

builder.mutationFields((t) => ({
  // ===== Courses =====

  // ===== SkillTrees =====

  createSkillTree: t.prismaField({
    type: "SkillTree",
    args: {
      input: t.arg({ type: CreateSkillTreeInput, required: true }),
    },
    resolve: async (query, _root, { input }, ctx) => {
      ctx.auth.requireAuth();
      requireAdmin(ctx);

      await assertCourseOwnership(ctx, input.courseId);

      const skillTree = await ctx.prisma.skillTree.create({
        ...query,
        data: {
          courseId: input.courseId,
          title: input.title,
          description: input.description ?? null,
        },
      });

      return skillTree;
    },
  }),

  updateSkillTree: t.prismaField({
    type: "SkillTree",
    args: {
      id: t.arg.id({ required: true }),
      input: t.arg({ type: UpdateSkillTreeInput, required: true }),
    },
    resolve: async (query, _root, { id, input }, ctx) => {
      ctx.auth.requireAuth();
      requireAdmin(ctx);

      await assertTreeOwnership(ctx, id);

      const { title, description } = input;

      const updatedSkillTree = await ctx.prisma.skillTree.update({
        ...query,
        where: { id },
        data: {
          ...(title !== undefined && title !== null && { title }),
          ...(description !== undefined && { description }),
        },
      });

      return updatedSkillTree;
    },
  }),
  deleteSkillTree: t.prismaField({
    type: "SkillTree",
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, _root, { id }, ctx) => {
      ctx.auth.requireAuth();
      requireAdmin(ctx);

      // 1. Ensure the tree exists
      const existing = await ctx.prisma.skillTree.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new GraphQLError("SkillTree not found");
      }

      // 2. Ownership check (asserts course ownership via tree)
      await assertTreeOwnership(ctx, id);

      // 3. Delete and return the deleted tree using the selection (`query`)
      const deleted = await ctx.prisma.skillTree.delete({
        ...query,
        where: { id },
      });

      return deleted;
    },
  }),
}));
