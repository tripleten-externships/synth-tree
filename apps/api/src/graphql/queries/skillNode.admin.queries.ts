import { builder } from "@graphql/builder";
import { requireAdmin } from "@graphql/auth/requireAuth";

builder.queryFields((t) => ({
  /**
   * ALL SkillNodes visible to any ADMIN.
   * Optional filters: by treeId, by courseId.
   */
  adminSkillNodes: t.prismaField({
    type: ["SkillNode"],
    args: {
      treeId: t.arg.id({ required: false }),
      courseId: t.arg.id({ required: false }),
      page: t.arg.int({ required: false }),
      limit: t.arg.int({ required: false }),
    },
    resolve: async (query, _root, args, ctx) => {
      ctx.auth.requireAuth();
      requireAdmin(ctx);

      const { treeId, courseId, page = 1, limit = 50 } = args;

      const skillNodes = await ctx.prisma.skillNode.findMany({
        ...query,
        where: {
          deletedAt: null,
          ...(treeId ? { treeId } : {}),
          ...(courseId
            ? {
                tree: {
                  courseId,
                },
              }
            : {}),
        },
        skip: (page! - 1) * limit!,
        take: limit!,
        orderBy: [{ step: "asc" }, { orderInStep: "asc" }],
      });

      return skillNodes;
    },
  }),

  /**
   * Single SkillNode by id, any ADMIN can see it.
   */
  adminSkillNode: t.prismaField({
    type: "SkillNode",
    nullable: true,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, _root, { id }, ctx) => {
      ctx.auth.requireAuth();
      requireAdmin(ctx);

      const skillNode = await ctx.prisma.skillNode.findFirst({
        ...query,
        where: {
          id,
          deletedAt: null,
        },
      });

      return skillNode;
    },
  }),
}));
