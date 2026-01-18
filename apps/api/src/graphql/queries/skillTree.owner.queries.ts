import { builder } from "@graphql/builder";
import { requireAdmin } from "@graphql/auth/requireAuth";
import { assertTreeOwnership } from "@graphql/auth/permissions";

builder.queryFields((t) => ({
  /**
   * SkillTrees authored by current admin (via course.authorId).
   */
  adminMySkillTrees: t.prismaField({
    type: ["SkillTree"],
    args: {
      courseId: t.arg.id({ required: false }),
      search: t.arg.string({ required: false }),
      page: t.arg.int({ required: false }),
      limit: t.arg.int({ required: false }),
    },
    resolve: async (query, _root, args, ctx) => {
      const userId = ctx.auth.requireAuth();
      requireAdmin(ctx);

      const { courseId, search, page = 1, limit = 20 } = args;

      const skillTrees = await ctx.prisma.skillTree.findMany({
        ...query,
        where: {
          deletedAt: null,
          course: {
            authorId: userId,
            ...(courseId ? { id: courseId } : {}),
          },
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
        orderBy: { createdAt: "asc" },
      });

      return skillTrees;
    },
  }),

  /**
   * Single SkillTree by id, only if its course.authorId === current admin.
   * Implementation: find tree -> join course -> check author.
   */
  adminMySkillTree: t.prismaField({
    type: "SkillTree",
    nullable: true,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, _root, { id }, ctx) => {
      const userId = ctx.auth.requireAuth();
      requireAdmin(ctx);

      await assertTreeOwnership(ctx, id);

      const tree = await ctx.prisma.skillTree.findFirst({
        ...query,
        where: {
          id,
          deletedAt: null,
          course: {
            authorId: userId,
          },
        },
      });

      return tree;
    },
  }),
}));
