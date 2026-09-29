import type { CanvasNode, RawSkillNode } from "./deriveSkillTree";

export interface CourseProgressSummary {
  completed: number;
  total: number;
  percent: number;
  // Node the "Continue learning" button opens, or null if there's nothing to open.
  continueNodeId: string | null;
  allComplete: boolean;
}

const byTreeOrder = (a: RawSkillNode, b: RawSkillNode) =>
  a.step - b.step || a.orderInStep - b.orderInStep;

// Course-level progress for the course detail sidebar (SYN-30). `derived` are
// the same nodes with their derived canvas status (see deriveSkillTree).
export function summarizeCourseProgress(
  rawNodes: RawSkillNode[],
  derived: CanvasNode[],
): CourseProgressSummary {
  const statusById = new Map(derived.map((n) => [n.id, n.status]));
  const total = rawNodes.length;
  const completed = rawNodes.filter((n) => statusById.get(n.id) === "completed").length;
  const allComplete = total > 0 && completed === total;

  // Continue with the most recently touched in-progress node...
  const inProgress = rawNodes
    .filter((n) => statusById.get(n.id) === "current")
    .sort(
      (a, b) =>
        new Date(b.progressForViewer?.updatedAt ?? 0).getTime() -
        new Date(a.progressForViewer?.updatedAt ?? 0).getTime(),
    );
  // ...otherwise the first unlocked node in tree order; once everything is
  // done, reopen the first node so the learner can review.
  const firstUnlocked = [...rawNodes]
    .sort(byTreeOrder)
    .find((n) => statusById.get(n.id) === "unlocked");
  const firstNode = [...rawNodes].sort(byTreeOrder)[0];

  const continueNode = inProgress[0] ?? firstUnlocked ?? (allComplete ? firstNode : undefined);

  return {
    completed,
    total,
    percent: total === 0 ? 0 : Math.round((completed / total) * 100),
    continueNodeId: continueNode?.id ?? null,
    allComplete,
  };
}
