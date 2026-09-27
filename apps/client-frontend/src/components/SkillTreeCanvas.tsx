import { Hex } from "@synth-tree/ui";
import type { CanvasEdge, CanvasNode } from "../lib/deriveSkillTree";

export interface SkillTreeCanvasProps {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  onNodeClick?: (node: CanvasNode) => void;
  width?: number;
  height?: number;
}

const DEFAULT_WIDTH = 520;
const DEFAULT_HEIGHT = 800;
const HEX_SIZE = 64;

const STATUS_LABEL: Record<CanvasNode["status"], string> = {
  completed: "completed",
  current: "in progress",
  unlocked: "unlocked",
  locked: "locked",
};

// Padding around the nodes' bounding box, in canvas units: room for half a
// hex on every side plus the title label under the bottom row.
const PAD_X = 70;
const PAD_TOP = 50;
const PAD_BOTTOM = 80;

interface Viewport {
  width: number;
  height: number;
  x: (node: CanvasNode) => number;
  y: (node: CanvasNode) => number;
}

// Crop the canvas to the nodes' bounding box so a tree authored in one corner
// of the 0–100% grid still renders centered and fills the available width.
// Relative spacing is preserved: `width`/`height` set how many canvas units
// 100% of posX/posY spans.
function fitViewport(nodes: CanvasNode[], width: number, height: number): Viewport {
  const xs = nodes.map((n) => n.posXPercent);
  const ys = nodes.map((n) => n.posYPercent);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);

  return {
    width: ((Math.max(...xs) - minX) / 100) * width + PAD_X * 2,
    height: ((Math.max(...ys) - minY) / 100) * height + PAD_TOP + PAD_BOTTOM,
    x: (n) => ((n.posXPercent - minX) / 100) * width + PAD_X,
    y: (n) => ((n.posYPercent - minY) / 100) * height + PAD_TOP,
  };
}

function edgePath(from: CanvasNode, to: CanvasNode, view: Viewport): string {
  const ax = view.x(from);
  const ay = view.y(from);
  const bx = view.x(to);
  const by = view.y(to);
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
  if (nodes.length === 0) return null;

  const view = fitViewport(nodes, width, height);

  return (
    <div
      className="relative"
      style={{ width: "100%", aspectRatio: `${view.width} / ${view.height}` }}
    >
      <svg
        viewBox={`0 0 ${view.width} ${view.height}`}
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        {edges.map((edge) => (
          <path
            key={edge.id}
            d={edgePath(edge.from, edge.to, view)}
            fill="none"
            stroke={edge.solid ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
            strokeWidth={3}
            strokeDasharray={edge.solid ? undefined : "6 6"}
            opacity={edge.solid ? 1 : 0.5}
            // Keep stroke width and dash length constant as the fitted canvas scales.
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>

      {nodes.map((node) => {
        const locked = node.status === "locked";

        return (
          <div
            key={node.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${(view.x(node) / view.width) * 100}%`,
              top: `${(view.y(node) / view.height) * 100}%`,
              width: HEX_SIZE,
              height: HEX_SIZE,
            }}
          >
            <Hex
              // `as never` cast tied to the SYN-28 icon-field TODO in deriveSkillTree.ts —
              // remove once SkillNode has a real icon field and this becomes type-safe.
              icon={node.icon as never}
              status={node.status}
              size={HEX_SIZE}
              onClick={onNodeClick ? () => onNodeClick(node) : undefined}
              // Locked nodes stay clickable so the caller can explain why they're
              // locked, but they don't look actionable.
              className={locked ? "cursor-not-allowed hover:translate-y-0" : undefined}
              aria-label={`${node.title} (${STATUS_LABEL[node.status]})`}
            />
            <span
              className={`pointer-events-none absolute left-1/2 top-full mt-1 w-max max-w-28 -translate-x-1/2 rounded bg-background/90 px-1 text-center text-xs font-medium leading-tight ${
                locked ? "text-muted-foreground" : "text-foreground"
              }`}
            >
              {node.title}
            </span>
          </div>
        );
      })}
    </div>
  );
}
