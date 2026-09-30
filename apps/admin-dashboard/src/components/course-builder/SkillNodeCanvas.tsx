import { useUpdateSkillNodeMutation } from "@synth-tree/api-types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  toast,
} from "@synth-tree/ui";
import { MoreHorizontal } from "lucide-react";
import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useNodeDrag } from "../../hooks/useNodeDrag";
import { SkillNodeChip } from "./SkillNodeChip";

// SYN-66: the middle "Tree Canvas" pane. Renders skill nodes positioned by
// posX/posY (integer percentages, 0-100) and lets the author drag them to
// reposition. On drop we persist via updateSkillNode with an optimistic
// response, so the move sticks immediately and Apollo rolls it back if the
// server rejects it. Node coordinates are read straight from the Apollo cache
// (the AdminCourse query), so a page refresh restores the saved layout.

const GRID_STEP = 5; // percent — matches useNodeDrag's snap increment

export interface CanvasNode {
  id: string;
  title: string;
  posX?: number | null;
  posY?: number | null;
}

interface SkillNodeCanvasProps {
  nodes: CanvasNode[];
}

const posOf = (n: CanvasNode) => ({
  posX: n.posX ?? 0,
  posY: n.posY ?? 0,
});

const cellKey = (x: number, y: number) => `${x},${y}`;

// Find the nearest free grid cell to (x, y) via an outward ring search, so a
// node dropped onto an occupied cell nudges to a neighbour instead of hitting
// the DB's @@unique([treeId, posX, posY]) constraint.
function findFreeCell(
  x: number,
  y: number,
  occupied: Set<string>,
): { x: number; y: number } {
  if (!occupied.has(cellKey(x, y))) return { x, y };

  for (let r = GRID_STEP; r <= 100; r += GRID_STEP) {
    for (let dx = -r; dx <= r; dx += GRID_STEP) {
      for (let dy = -r; dy <= r; dy += GRID_STEP) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue; // ring edge only

        const nx = x + dx;
        const ny = y + dy;

        if (nx < 0 || nx > 100 || ny < 0 || ny > 100) continue;

        if (!occupied.has(cellKey(nx, ny))) {
          return { x: nx, y: ny };
        }
      }
    }
  }

  return { x, y }; // canvas full — let the persist fail and revert
}

export function SkillNodeCanvas({ nodes }: SkillNodeCanvasProps) {
  const navigate = useNavigate();
  const [updateSkillNode] = useUpdateSkillNodeMutation();

  const nodesById = useMemo(
    () => new Map(nodes.map((n) => [n.id, n])),
    [nodes],
  );

  const handleDrop = useCallback(
    (id: string, rawX: number, rawY: number) => {
      const node = nodesById.get(id);
      if (!node) return;

      const { posX: curX, posY: curY } = posOf(node);

      const occupied = new Set(
        nodes
          .filter((n) => n.id !== id)
          .map((n) => {
            const p = posOf(n);
            return cellKey(p.posX, p.posY);
          }),
      );

      const { x: posX, y: posY } = findFreeCell(
        rawX,
        rawY,
        occupied,
      );

      if (posX === curX && posY === curY) return; // no-op

      updateSkillNode({
        variables: {
          id,
          input: {
            posX,
            posY,
          },
        },
        optimisticResponse: {
          updateSkillNode: {
            __typename: "SkillNode",
            id,
            posX,
            posY,
          },
        },
      }).catch((err) => {
        // Apollo auto-reverts the optimistic position; just notify.
        toast.error("Couldn't move node", {
          description: "That spot may be taken. Try another position.",
        });

        console.error("updateSkillNode failed:", err);
      });
    },
    [nodes, nodesById, updateSkillNode],
  );

  const {
    canvasRef,
    drag,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
  } = useNodeDrag({
    gridStep: GRID_STEP,
    onDrop: handleDrop,
  });

  if (nodes.length === 0) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center rounded-md border border-dashed">
        <p className="max-w-xs text-center text-sm text-muted-foreground">
          No nodes yet. Adding nodes to the canvas comes with SYN-65.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={canvasRef}
      className="relative h-full min-h-[400px] w-full overflow-hidden rounded-md border bg-[linear-gradient(to_right,hsl(var(--border)/0.5)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.5)_1px,transparent_1px)] bg-[length:5%_5%]"
    >
      {nodes.map((node) => {
        const stored = posOf(node);
        const isDragging = drag?.id === node.id;

        const pos = isDragging
          ? {
              posX: drag.posX,
              posY: drag.posY,
            }
          : stored;

        return (
          <div
            key={node.id}
            className={`absolute -translate-x-1/2 -translate-y-1/2 touch-none ${
              isDragging
                ? "z-10 cursor-grabbing"
                : "cursor-grab"
            }`}
            style={{
              left: `${pos.posX}%`,
              top: `${pos.posY}%`,
            }}
            onPointerDown={(e) =>
              onPointerDown(e, {
                id: node.id,
                ...stored,
              })
            }
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerCancel}
          >
            <div className="relative">
              <SkillNodeChip
                title={node.title}
                dragging={isDragging}
              />

              <div
                className="absolute -right-2 -top-2"
                onPointerDown={(e) => e.stopPropagation()}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="flex h-6 w-6 items-center justify-center rounded-full border bg-card shadow-sm hover:bg-accent"
                      aria-label={`Actions for ${node.title}`}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="start">
                    <DropdownMenuItem
                      onClick={() =>
                        navigate(`/lessons/${node.id}/edit`)
                      }
                    >
                      Edit lesson
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default SkillNodeCanvas;
