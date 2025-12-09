import type { Prisma } from "@prisma/client";
import { GraphQLError } from "graphql";

/**
 * Advanced deletion:
 * - Deletes the given node and all its prerequisites.
 * - Rebuilds orderInStep (contiguous) per row.
 * - Rebuilds all prerequisites for the tree using the same rules
 *   as createSkillNodeToRight / createSkillNodeBelow.
 *
 * Must be called WITHIN an existing transaction (tx).
 */
export async function deleteSkillNodeAndRebuildGating(
  tx: Prisma.TransactionClient,
  treeId: string,
  nodeId: string
): Promise<void> {
  // 1. Ensure node exists in this tree
  const node = await tx.skillNode.findFirst({
    where: { id: nodeId, treeId },
  });

  if (!node) {
    throw new GraphQLError("SkillNode not found in given tree");
  }

  // 2. Delete all prerequisites involving this node
  await tx.skillNodePrerequisite.deleteMany({
    where: {
      OR: [{ nodeId }, { dependsOnNodeId: nodeId }],
    },
  });

  // 3. Delete the node itself
  await tx.skillNode.delete({
    where: { id: nodeId },
  });

  // 4. Fetch remaining nodes in this tree
  const nodes = await tx.skillNode.findMany({
    where: { treeId },
    orderBy: [{ step: "asc" }, { orderInStep: "asc" }],
  });

  if (nodes.length === 0) {
    // Nothing left to rebuild
    return;
  }

  // Group by step
  const nodesByStep = new Map<number, typeof nodes>();

  for (const n of nodes) {
    if (!nodesByStep.has(n.step)) {
      nodesByStep.set(n.step, []);
    }
    nodesByStep.get(n.step)!.push(n);
  }

  const steps = Array.from(nodesByStep.keys()).sort((a, b) => a - b);

  // 5. Normalize orderInStep (and posX/posY if you want) per row
  for (const step of steps) {
    const rowNodes = nodesByStep
      .get(step)!
      .slice()
      .sort((a, b) => a.orderInStep - b.orderInStep);

    for (let i = 0; i < rowNodes.length; i++) {
      const n = rowNodes[i];
      const newOrderInStep = i + 1;

      // Only update if changed (avoid noisy writes)
      if (
        n.orderInStep !== newOrderInStep ||
        n.posX !== newOrderInStep ||
        n.posY !== step
      ) {
        await tx.skillNode.update({
          where: { id: n.id },
          data: {
            orderInStep: newOrderInStep,
            posX: newOrderInStep, // keep simple grid: x = order, y = step
            posY: step,
          },
        });

        // Update local copy so we use correct values below if needed
        n.orderInStep = newOrderInStep;
        // @ts-ignore
        n.posX = newOrderInStep;
        // @ts-ignore
        n.posY = step;
      }
    }
  }

  // 6. Clear ALL prerequisites for this tree
  const nodeIds = nodes.map((n) => n.id);

  await tx.skillNodePrerequisite.deleteMany({
    where: {
      OR: [{ nodeId: { in: nodeIds } }, { dependsOnNodeId: { in: nodeIds } }],
    },
  });

  // 7. Rebuild prerequisites using deterministic rules
  //    - Horizontal: chain within each row.
  //    - Vertical: last node of row S -> first node of row S+1.

  // Rebuild horizontal prerequisites per row
  for (const step of steps) {
    const rowNodes = nodesByStep
      .get(step)!
      .slice()
      .sort((a, b) => a.orderInStep - b.orderInStep);

    for (let i = 1; i < rowNodes.length; i++) {
      const left = rowNodes[i - 1]; // prerequisite
      const right = rowNodes[i]; // gated node

      await tx.skillNodePrerequisite.create({
        data: {
          nodeId: right.id,
          dependsOnNodeId: left.id,
        },
      });
    }
  }

  // Rebuild vertical prerequisites between rows
  for (let i = 1; i < steps.length; i++) {
    const prevStep = steps[i - 1];
    const currStep = steps[i];

    const prevRowNodes = nodesByStep
      .get(prevStep)!
      .slice()
      .sort((a, b) => a.orderInStep - b.orderInStep);

    const currRowNodes = nodesByStep
      .get(currStep)!
      .slice()
      .sort((a, b) => a.orderInStep - b.orderInStep);

    if (prevRowNodes.length === 0 || currRowNodes.length === 0) {
      continue;
    }

    const lastAbove = prevRowNodes[prevRowNodes.length - 1]; // rightmost in row S
    const firstBelow = currRowNodes[0]; // first in row S+1

    await tx.skillNodePrerequisite.create({
      data: {
        nodeId: firstBelow.id,
        dependsOnNodeId: lastAbove.id,
      },
    });
  }
}
