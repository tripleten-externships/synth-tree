// src/graphql/admin/admin.mutations.ts
import { builder } from "@graphql/builder";
import { requireAdmin } from "@graphql/auth/requireAuth";
import { Prisma } from "@prisma/client";
import {
  CreateSkillNodeToRightInput,
  CreateSkillNodeBelowInput,
  UpdateSkillNodeInput,
  CreateFirstSkillNodeInput,
} from "@graphql/inputs/skillNode.inputs";
import { assertCourseOwnership } from "@graphql/auth/permissions";
import { GraphQLError } from "graphql";
import {
  COLUMN_GAP,
  FIRST_NODE_POSITION,
  ROW_GAP,
  findFreePosition,
  isOnCanvas,
} from "src/services/skillNode/placeSkillNode";

builder.mutationFields((t) => ({
  // ===== SkillNodes (structural & gating) =====

  // 1) First node in a tree (step = 1, orderInStep = 1)
  createFirstSkillNode: t.prismaField({
    type: "SkillNode",
    args: {
      input: t.arg({ type: CreateFirstSkillNodeInput, required: true }),
    },
    resolve: async (query, _root, { input }, ctx) => {
      ctx.auth.requireAuth();
      requireAdmin(ctx);

      const { treeId, title } = input;

      return ctx.prisma.$transaction(async (tx) => {
        // Load the tree and its course for ownership check
        const tree = await tx.skillTree.findUnique({
          where: { id: treeId },
          include: { course: true },
        });

        if (!tree) {
          throw new GraphQLError("SkillTree not found");
        }

        // Ensure admin owns the course that contains this tree
        await assertCourseOwnership(ctx, tree.courseId);

        // Ensure there are no existing nodes in this tree
        const existingNode = await tx.skillNode.findFirst({
          where: { treeId },
        });

        if (existingNode) {
          throw new GraphQLError(
            "This tree already has nodes. Use createSkillNodeToRight or createSkillNodeBelow instead.",
          );
        }

        // The tree is empty, so the first spot is always free.
        const newNode = await tx.skillNode.create({
          data: {
            treeId,
            title,
            step: 1,
            orderInStep: 1,
            ...FIRST_NODE_POSITION,
          },
        });

        // No prerequisites: this is the root node
        return tx.skillNode.findUniqueOrThrow({
          ...query,
          where: { id: newNode.id },
        });
      });
    },
  }),

  createSkillNodeToRight: t.prismaField({
    type: "SkillNode",
    args: {
      input: t.arg({ type: CreateSkillNodeToRightInput, required: true }),
    },
    resolve: async (query, _root, { input }, ctx) => {
      ctx.auth.requireAuth();
      requireAdmin(ctx);

      const { referenceNodeId, title } = input;

      return ctx.prisma.$transaction(async (tx) => {
        const ref = await tx.skillNode.findUnique({
          where: { id: referenceNodeId },
          include: {
            tree: {
              include: { course: true },
            },
          },
        });

        if (!ref) {
          throw new GraphQLError("Reference node not found");
        }

        // Ensure admin can edit the course containing this tree
        await assertCourseOwnership(ctx, ref.tree.courseId);

        const treeId = ref.treeId;
        const step = ref.step;

        // Get the rightmost node in this step BEFORE insertion
        const lastNodeInStep = await tx.skillNode.findFirst({
          where: { treeId, step },
          orderBy: { orderInStep: "desc" },
        });

        const newOrderInStep = (lastNodeInStep?.orderInStep ?? 0) + 1;

        // Canvas spot: right of the row's last node (the one that gates the
        // new node), so the row reads left to right in orderInStep order.
        const anchor = lastNodeInStep ?? ref;
        const position = await findFreePosition(tx, treeId, {
          posX: (anchor.posX ?? 0) + COLUMN_GAP,
          posY: anchor.posY ?? 0,
        });

        const newNode = await tx.skillNode.create({
          data: {
            treeId,
            title,
            step,
            orderInStep: newOrderInStep,
            ...position,
          },
        });

        if (lastNodeInStep) {
          await tx.skillNodePrerequisite.create({
            data: {
              nodeId: newNode.id, // one being gated
              dependsOnNodeId: lastNodeInStep.id, // The gate itself
            },
          });
        }

        return tx.skillNode.findUniqueOrThrow({
          ...query,
          where: { id: newNode.id },
        });
      });
    },
  }),

  createSkillNodeBelow: t.prismaField({
    type: "SkillNode",
    args: {
      input: t.arg({ type: CreateSkillNodeBelowInput, required: true }),
    },
    resolve: async (query, _root, { input }, ctx) => {
      ctx.auth.requireAuth();
      requireAdmin(ctx);

      const { referenceNodeId, title } = input;

      return ctx.prisma.$transaction(async (tx) => {
        const ref = await tx.skillNode.findUnique({
          where: { id: referenceNodeId },
          include: {
            tree: {
              include: { course: true },
            },
          },
        });

        if (!ref) {
          throw new GraphQLError("Reference node not found");
        }

        await assertCourseOwnership(ctx, ref.tree.courseId);

        const treeId = ref.treeId;
        const refStep = ref.step;
        const newStep = refStep + 1;

        // Optional safety: ensure this “row” doesn’t already have a node at orderInStep = 1
        const existingInRow = await tx.skillNode.findFirst({
          where: {
            treeId,
            step: newStep,
            orderInStep: 1,
          },
        });

        if (existingInRow) {
          // You *can* relax this later, but for now we enforce "one node per row created via 'below'"
          throw new GraphQLError(
            "A node already exists in the next row. Use createSkillNodeToRight to add more nodes to that row.",
          );
        }

        // Gating: rightmost node in the row above (step = refStep)
        const lastNodeAbove = await tx.skillNode.findFirst({
          where: { treeId, step: refStep },
          orderBy: { orderInStep: "desc" },
        });

        if (!lastNodeAbove) {
          throw new GraphQLError("No nodes found in the row above to gate from");
        }

        // Canvas spot: straight under the node the author added it from.
        const position = await findFreePosition(tx, treeId, {
          posX: ref.posX ?? 0,
          posY: (ref.posY ?? 0) + ROW_GAP,
        });

        const newNode = await tx.skillNode.create({
          data: {
            treeId,
            title,
            step: newStep,
            orderInStep: 1, // first node in the new row
            ...position,
          },
        });

        await tx.skillNodePrerequisite.create({
          data: {
            nodeId: newNode.id, // child (gated)
            dependsOnNodeId: lastNodeAbove.id, // gate
          },
        });

        return tx.skillNode.findUniqueOrThrow({
          ...query,
          where: { id: newNode.id },
        });
      });
    },
  }),

  // Admin user can update the title and position of a skill node but not the step or orderInStep
  // Because that will necesitate prerequisites re-computing. As stated in other parts of the code. Should probably remove prerequisites as a database constraint and enforce gating with frontend logic.

  updateSkillNode: t.prismaField({
    type: "SkillNode",
    args: {
      id: t.arg.id({ required: true }),
      input: t.arg({ type: UpdateSkillNodeInput, required: true }),
    },
    resolve: async (query, _root, { id, input }, ctx) => {
      ctx.auth.requireAuth();
      requireAdmin(ctx);

      // posX/posY are percentages of the canvas (0-100).
      const outOfRange = (v: number | null | undefined) => v != null && !isOnCanvas(v);
      if (outOfRange(input.posX) || outOfRange(input.posY)) {
        throw new GraphQLError("posX and posY must be between 0 and 100", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      return ctx.prisma.$transaction(async (tx) => {
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

        const { title, posX, posY } = input;

        const updates: Prisma.SkillNodeUpdateInput = {};

        if (title != null) updates.title = title;
        if (posX != null) updates.posX = posX;
        if (posY != null) updates.posY = posY;

        const updated = await tx.skillNode.update({
          where: { id },
          data: updates,
        });

        return tx.skillNode.findUniqueOrThrow({
          ...query,
          where: { id: updated.id },
        });
      });
    },
  }),
}));
