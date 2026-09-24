import DataLoader from "dataloader";
import type { PrismaClient } from "@prisma/client";

export type UnlockedStatus = "COMPLETED" | "IN_PROGRESS" | "UNLOCKED" | "LOCKED";

export function createDerivedStatusLoader(prisma: PrismaClient, userId: string) {
  return new DataLoader<string, UnlockedStatus>(async (nodeIds) => {
    const prerequisites = await prisma.skillNodePrerequisite.findMany({
      where: {
        nodeId: { in: [...nodeIds] },
      },
      select: {
        nodeId: true,
        dependsOnNodeId: true,
      },
    });

    const relevantNodeIds = [
      ...new Set([...nodeIds, ...prerequisites.map((edge) => edge.dependsOnNodeId)]),
    ];

    const progress = await prisma.userNodeProgress.findMany({
      where: {
        userId,
        nodeId: { in: relevantNodeIds },
      },
      select: {
        nodeId: true,
        status: true,
      },
    });

    const statusByNode = new Map(progress.map((row) => [row.nodeId, row.status]));

    const prerequisitesByNode = new Map<string, string[]>();

    for (const edge of prerequisites) {
      const dependencies = prerequisitesByNode.get(edge.nodeId) ?? [];
      dependencies.push(edge.dependsOnNodeId);
      prerequisitesByNode.set(edge.nodeId, dependencies);
    }

    return nodeIds.map((nodeId): UnlockedStatus => {
      const status = statusByNode.get(nodeId);

      if (status === "COMPLETED") return "COMPLETED";
      if (status === "IN_PROGRESS") return "IN_PROGRESS";

      const dependencies = prerequisitesByNode.get(nodeId) ?? [];
      const allCompleted = dependencies.every(
        (dependencyId) => statusByNode.get(dependencyId) === "COMPLETED",
      );

      return allCompleted ? "UNLOCKED" : "LOCKED";
    });
  });
}
