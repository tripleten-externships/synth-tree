import { requireAdmin } from "@graphql/auth/requireAuth";
import { builder } from "@graphql/builder";
import { GraphQLError } from "graphql";
import { Prisma } from "@prisma/client";
import { assertCourseOwnership } from "@graphql/auth/permissions";

builder.mutationFields((t) => ({
  /**
   * Simple, safe delete:
   * - Only allows deleting the "last node in the last row" of a tree.
   * - No prerequisite recompute needed.
   * - Requires admins to delete in reverse order. This is to prevent the tree from becoming inconsistent.
   */
  deleteSkillNodeSimple: t.field({
    type: "Boolean",
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (_root, { id }, ctx) => {
      ctx.auth.requireAuth();
      requireAdmin(ctx);

      await ctx.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        // 1. Load node with tree + course
        const node = await tx.skillNode.findUnique({
          where: { id },
          include: {
            tree: { include: { course: true } },
          },
        });

        if (!node) {
          throw new GraphQLError("SkillNode not found");
        }

        // 2. Ownership check
        await assertCourseOwnership(ctx, node.tree.courseId);

        const treeId = node.treeId;

        // 3. Find max step in this tree
        const { _max } = await tx.skillNode.aggregate({
          where: { treeId },
          _max: { step: true },
        });

        const maxStep = _max.step;
        if (maxStep == null) {
          // Shouldn't happen if node exists, but just in case
          throw new GraphQLError("Tree has no steps; cannot delete node.");
        }

        if (node.step !== maxStep) {
          throw new GraphQLError(
            "Only nodes in the last row can be deleted. Delete in reverse order."
          );
        }

        // 4. Find max orderInStep in that last step
        const { _max: maxOrderAgg } = await tx.skillNode.aggregate({
          where: { treeId, step: maxStep },
          _max: { orderInStep: true },
        });

        const maxOrderInStep = maxOrderAgg.orderInStep;
        if (maxOrderInStep == null) {
          throw new GraphQLError(
            "No nodes found in last row; inconsistent tree state."
          );
        }

        if (node.orderInStep !== maxOrderInStep) {
          throw new GraphQLError(
            "Only the last node in the last row can be deleted. Delete from right to left."
          );
        }

        // Optional defensive check: no other node should depend on this one
        const dependentCount = await tx.skillNodePrerequisite.count({
          where: { dependsOnNodeId: node.id },
        });

        if (dependentCount > 0) {
          throw new GraphQLError(
            "This node is a prerequisite for other nodes. Deletion is not allowed."
          );
        }

        // 5. Delete this node's own prerequisites (where it is the child)
        await tx.skillNodePrerequisite.deleteMany({
          where: { nodeId: node.id },
        });

        // 6. Delete node itself
        await tx.skillNode.delete({
          where: { id: node.id },
        });
      });

      return true;
    },
  }),
}));
