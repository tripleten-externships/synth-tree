import { Hex } from "@synth-tree/ui";
import type { CanvasEdge, CanvasNode } from "../lib/deriveSkillTree";

export interface SkillTreeCanvasProps {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  onNodeClick?: (nodeId: string) => void;
  width?: number;
  height?: number;
}

const DEFAULT_WIDTH = 520;
const DEFAULT_HEIGHT = 800;
const HEX_SIZE = 64;

function edgePath(from: CanvasNode, to: CanvasNode, width: number, height: number): string {
  const ax = (from.posXPercent / 100) * width;
  const ay = (from.posYPercent / 100) * height;
  const bx = (to.posXPercent / 100) * width;
  const by = (to.posYPercent / 100) * height;
  const midY = (ay + by) / 2;

  return `M ${ax} ${ay} C ${ax} ${midY}, ${bx} ${midY}, ${bx} ${by}`;
}

export default function SkillTreeCanvas({
  nodes,
  edges,
  onNodeClick,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
}: SkillTreeCanvasProps) {
  return (
    <div className="relative" style={{ width: "100%", aspectRatio: `${width} / ${height}` }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        {edges.map((edge) => (
          <path
            key={edge.id}
            d={edgePath(edge.from, edge.to, width, height)}
            fill="none"
            stroke={edge.solid ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
            strokeWidth={3}
            strokeDasharray={edge.solid ? undefined : "6 6"}
            opacity={edge.solid ? 1 : 0.5}
          />
        ))}
      </svg>

      {nodes.map((node) => (
        <div
          key={node.id}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${node.posXPercent}%`,
            top: `${node.posYPercent}%`,
          }}
        >
          <Hex
  // `as never` cast tied to the SYN-28 icon-field TODO in deriveSkillTree.ts —
  // remove once SkillNode has a real icon field and this becomes type-safe.
  icon={node.icon as never}
            status={node.status}
            size={HEX_SIZE}
            onClick={onNodeClick ? () => onNodeClick(node.id) : undefined}
            aria-label={node.title}
          />
        </div>
      ))}
    </div>
  );
}
