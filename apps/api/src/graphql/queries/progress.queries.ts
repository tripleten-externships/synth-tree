import { UserNodeProgress } from "models/UserNodeProgress";
import { Context } from "graphql/context";

export async function myProgress(_: any, __: any, context: Context) {
  if (!context.user) throw new Error("Unauthorized");

  const userId = context.user.id;

  const progress = await UserNodeProgress.findAll({
    where: { userId },
  });

  return progress;
}

// --- progress for a single node ---
export async function nodeProgress(
  _: any,
  { nodeId }: { nodeId: string },
  context: Context,
) {
  if (!context.user) throw new Error("Unauthorized");

  const userId = context.user.id;

  const progress = await UserNodeProgress.findOne({
    where: { userId, nodeId },
  });

  return progress;
}

// progress for a course with aggregated stats
export async function courseProgress(
  _: any,
  { courseId }: { courseId: string },
  context: Context,
) {
  if (!context.user) throw new Error("Unauthorized");

  const userId = context.user.id;

  const allNodes = await UserNodeProgress.findAll({
    where: { courseId, userId },
  });

  const totalNodes = allNodes.length;
  const completedNodes = allNodes.filter((n) => n.completed).length;

  const completionPercentage =
    totalNodes === 0 ? 0 : (completedNodes / totalNodes) * 100;

  return {
    totalNodes,
    completedNodes,
    completionPercentage,
    nodes: allNodes,
  };
}

export { myProgress, nodeProgress, courseProgress };
