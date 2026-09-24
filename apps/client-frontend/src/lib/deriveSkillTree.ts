import type { LearnerCourseTreeQuery } from "@synth-tree/api-types";
import type { HexStatus } from "@synth-tree/ui";

// TODO(SYN-28 follow-up): SkillNode has no `icon` field in the Prisma schema
// yet, but Hex requires one. Every node uses this placeholder icon until a
// real per-node icon field exists. Flagged explicitly in the PR - see
// discussion needed on whether icons are author-assigned or category-derived.
export const PLACEHOLDER_ICON = "flask";

// Derived from the generated LearnerCourseTree query type (SYN-27) so the
// query's `trees[n].nodes` can be passed straight into deriveSkillTree.
export type RawSkillNode = NonNullable<
  LearnerCourseTreeQuery["courseForLearner"]
>["trees"][number]["nodes"][number];
export type RawPrerequisite = RawSkillNode["prerequisites"][number];
export type RawProgress = NonNullable<RawSkillNode["progressForViewer"]>;

export interface CanvasNode {
  id: string;
  title: string;
  posXPercent: number;
  posYPercent: number;
  status: HexStatus;
  icon: string;
}

export interface CanvasEdge {
  id: string;
  from: CanvasNode;
  to: CanvasNode;
  solid: boolean;
}

export interface DerivedSkillTree {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
}

function toHexStatus(node: RawSkillNode): HexStatus {
  switch (node.derivedStatus) {
    case "COMPLETED":
      return "completed";
    case "IN_PROGRESS":
      return "current";
    case "UNLOCKED":
      return "unlocked";
    case "LOCKED":
      return "locked";
  }
}

export function deriveSkillTree(rawNodes: RawSkillNode[]): DerivedSkillTree {

  const nodes: CanvasNode[] = rawNodes.map((raw) => ({
    id: raw.id,
    title: raw.title,
    posXPercent: raw.posX ?? 0,
    posYPercent: raw.posY ?? 0,
    status: toHexStatus(raw),
    icon: PLACEHOLDER_ICON,
  }));

  const nodesById = new Map(nodes.map((n) => [n.id, n]));

  const edges: CanvasEdge[] = [];

  for (const raw of rawNodes) {
    const toNode = nodesById.get(raw.id);
    if (!toNode) continue;

    for (const prereq of raw.prerequisites) {
      const fromNode = nodesById.get(prereq.dependsOnNodeId);
      if (!fromNode) continue;

      edges.push({
        id: `${fromNode.id}->${toNode.id}`,
        from: fromNode,
        to: toNode,
        // Solid once the source is completed and the target is reachable
        // (unlocked/current/completed); stays solid after the target is done.
        solid: fromNode.status === "completed" && toNode.status !== "locked",
      });
    }
  }

  return { nodes, edges };
}

// Where clicking a node takes the learner, or null when the node is locked
// (the caller shows a "complete prerequisites first" hint instead, SYN-29).
export function nodeHref(courseId: string, node: CanvasNode): string | null {
  if (node.status === "locked") return null;
  return `/courses/${courseId}/nodes/${node.id}`;
}
