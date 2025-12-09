import { builder } from "@graphql/builder";
import { requireAdmin } from "@graphql/auth/requireAuth";

builder.queryFields((t) => ({
  /**
   * ALL SkillTrees visible to any ADMIN, with optional filters.
   */
  adminSkillTrees: t.prismaField({
    type: ["SkillTree"],
    args: {
      courseId: t.arg.id({ required: false }),
      search: t.arg.string({ required: false }), // on title
      page: t.arg.int({ required: false }),
      limit: t.arg.int({ required: false }),
    },
    resolve: async (query, _root, args, ctx) => {
      ctx.auth.requireAuth();
      requireAdmin(ctx);

      const { courseId, search, page = 1, limit = 20 } = args;

      const skillTrees = await ctx.prisma.skillTree.findMany({
        ...query,
        where: {
          deletedAt: null,
          ...(courseId ? { courseId } : {}),
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
   * Single SkillTree by id, any ADMIN can see it.
   */
  adminSkillTree: t.prismaField({
    type: "SkillTree",
    nullable: true,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, _root, { id }, ctx) => {
      ctx.auth.requireAuth();
      requireAdmin(ctx);

      const skillTree = await ctx.prisma.skillTree.findFirst({
        ...query,
        where: {
          id,
          deletedAt: null,
        },
      });

      return skillTree;
    },
  }),
}));
