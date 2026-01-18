import { builder } from "@graphql/builder";
import { requireAdmin } from "@graphql/auth/requireAuth";
import { assertNodeOwnership } from "@graphql/auth/permissions";

builder.queryFields((t) => ({
  /**
   * SkillNodes authored by current admin, via tree.course.authorId.
   * Optional filters: treeId, courseId.
   */
  adminMySkillNodes: t.prismaField({
    type: ["SkillNode"],
    args: {
      treeId: t.arg.id({ required: false }),
      courseId: t.arg.id({ required: false }),
      page: t.arg.int({ required: false }),
      limit: t.arg.int({ required: false }),
    },
    resolve: async (query, _root, args, ctx) => {
      const userId = ctx.auth.requireAuth();
      requireAdmin(ctx);

      const { treeId, courseId, page = 1, limit = 50 } = args;

      return ctx.prisma.skillNode.findMany({
        ...query,
        where: {
          deletedAt: null,
          tree: {
            ...(treeId ? { id: treeId } : {}),
            course: {
              authorId: userId,
              ...(courseId ? { id: courseId } : {}),
            },
          },
        },
        skip: (page! - 1) * limit!,
        take: limit!,
        orderBy: [{ step: "asc" }, { orderInStep: "asc" }],
      });
    },
  }),

  /**
   * Single SkillNode by id, only if its course.authorId === current admin.
   * Implementation: find node -> join tree -> join course -> check author.
   */
  adminMySkillNode: t.prismaField({
    type: "SkillNode",
    nullable: true,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, _root, { id }, ctx) => {
      const userId = ctx.auth.requireAuth();
      requireAdmin(ctx);

      await assertNodeOwnership(ctx, id);

      const node = await ctx.prisma.skillNode.findFirst({
        ...query,
        where: {
          id,
          deletedAt: null,
          tree: {
            course: {
              authorId: userId,
            },
          },
        },
      });

      return node;
    },
  }),
}));
