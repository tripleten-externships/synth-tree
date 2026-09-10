import type { HexStatus } from "@synth-tree/ui";

// TODO(SYN-28 follow-up): SkillNode has no `icon` field in the Prisma schema
// yet, but Hex requires one. Every node uses this placeholder icon until a
// real per-node icon field exists. Flagged explicitly in the PR - see
// discussion needed on whether icons are author-assigned or category-derived.
const PLACEHOLDER_ICON = "flask";

export interface RawPrerequisite {
  dependsOnNodeId: string;
}

export interface RawProgress {
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  completedAt: string | null;
}

export interface RawSkillNode {
  id: string;
  title: string;
  posX: number | null;
  posY: number | null;
  prerequisites: RawPrerequisite[];
  progressForViewer: RawProgress | null;
}

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

function toHexStatus(node: RawSkillNode, allNodesById: Map<string, RawSkillNode>): HexStatus {
  const progressStatus = node.progressForViewer?.status ?? "NOT_STARTED";

  if (progressStatus === "COMPLETED") return "completed";
  if (progressStatus === "IN_PROGRESS") return "current";

  const allPrereqsComplete = node.prerequisites.every((prereq) => {
    const prereqNode = allNodesById.get(prereq.dependsOnNodeId);
    return prereqNode?.progressForViewer?.status === "COMPLETED";
  });

  return allPrereqsComplete ? "unlocked" : "locked";
}

export function deriveSkillTree(rawNodes: RawSkillNode[]): DerivedSkillTree {
  const allNodesById = new Map(rawNodes.map((n) => [n.id, n]));

  const nodes: CanvasNode[] = rawNodes.map((raw) => ({
    id: raw.id,
    title: raw.title,
    posXPercent: raw.posX ?? 0,
    posYPercent: raw.posY ?? 0,
    status: toHexStatus(raw, allNodesById),
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
        solid: fromNode.status === "completed" && toNode.status === "unlocked",
      });
    }
  }

  return { nodes, edges };
}
