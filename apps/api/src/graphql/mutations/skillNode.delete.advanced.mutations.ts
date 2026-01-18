import { requireAdmin } from "@graphql/auth/requireAuth";
import { builder } from "@graphql/builder";
import { GraphQLError } from "graphql";
import { Prisma } from "@prisma/client";
import { assertCourseOwnership } from "@graphql/auth/permissions";
import { deleteSkillNodeAndRebuildGating } from "src/services/skillNode/deleteSkillNodeAndRebuildGating";

builder.mutationFields((t) => ({
  /**
   * I honestly overcomplicated prerequisites which could be derived from the step and orderInStep
   * order at the Application level.
   * Nonetheless if it is decided that skill nodes (chapters) can be arbitrarily deleted,
   * this function will rebuild the entire prerequisite graph for the tree maintaining left to right gating
   * as well as top to bottom gatting
   * Node A -> Gates Node B -> Gates Node C and thus (Node A + Node B) Gates Node C
   * Node D (below Node C ) is Gated By Node C and thus all before it.
   */

  deleteSkillNodeAdvanced: t.field({
    type: "Boolean",
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (_root, { id }, ctx) => {
      ctx.auth.requireAuth();
      requireAdmin(ctx);

      await ctx.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        // 1. Load node with tree + course for ownership
        const node = await tx.skillNode.findUnique({
          where: { id },
          include: {
            tree: { include: { course: true } },
          },
        });

        if (!node) {
          throw new GraphQLError("SkillNode not found");
        }

        await assertCourseOwnership(ctx, node.tree.courseId);

        // 2. Delegate to the advanced helper
        await deleteSkillNodeAndRebuildGating(tx, node.treeId, node.id);
      });

      return true;
    },
  }),
}));
