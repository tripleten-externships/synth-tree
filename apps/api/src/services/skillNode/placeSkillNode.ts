import type { Prisma } from "@prisma/client";
import { GraphQLError } from "graphql";

/**
 * Where a newly created skill node goes on the canvas.
 *
 * SkillNode.posX / posY are integer percentages (0-100) of the canvas. The
 * admin builder snaps drags to a 5% grid and the learner canvas scales the
 * same numbers, so new nodes use that grid too. The gaps match the demo seed:
 * they are the smallest steps where nodes don't overlap on either canvas.
 */
export const GRID_STEP = 5;
export const COLUMN_GAP = 20; // createSkillNodeToRight: right of the row's last node
export const ROW_GAP = 15; // createSkillNodeBelow: under the reference node
export const FIRST_NODE_POSITION: CanvasPosition = { posX: 10, posY: 10 };

// A preferred cell stays this far inside the edges so the node isn't clipped
// by the admin canvas. The free-cell fallback can still use the whole canvas.
const PREFERRED_MIN = 10;
const PREFERRED_MAX = 90;
const CANVAS_MIN = 0;
const CANVAS_MAX = 100;

export interface CanvasPosition {
  posX: number;
  posY: number;
}

export const cellKey = (x: number, y: number) => `${x},${y}`;

const toPreferredCell = (v: number) =>
  Math.min(PREFERRED_MAX, Math.max(PREFERRED_MIN, Math.round(v / GRID_STEP) * GRID_STEP));

/**
 * The preferred cell (snapped and kept off the edges) if it is free, otherwise
 * the closest free grid cell, searching outward one ring at a time. Within a
 * ring it tries the same row first, then below before above, then right before
 * left, so a full row spills onto the row under it. Returns null when every
 * cell is taken.
 */
export function nearestFreeCell(
  preferred: CanvasPosition,
  occupied: ReadonlySet<string>,
): CanvasPosition | null {
  const x = toPreferredCell(preferred.posX);
  const y = toPreferredCell(preferred.posY);
  if (!occupied.has(cellKey(x, y))) return { posX: x, posY: y };

  for (let r = GRID_STEP; r <= CANVAS_MAX - CANVAS_MIN; r += GRID_STEP) {
    const ring: Array<[number, number]> = [];
    for (let dx = -r; dx <= r; dx += GRID_STEP) {
      for (let dy = -r; dy <= r; dy += GRID_STEP) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) === r) ring.push([dx, dy]);
      }
    }
    ring.sort(([ax, ay], [bx, by]) => Math.abs(ay) - Math.abs(by) || by - ay || bx - ax);

    for (const [dx, dy] of ring) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < CANVAS_MIN || nx > CANVAS_MAX || ny < CANVAS_MIN || ny > CANVAS_MAX) continue;
      if (!occupied.has(cellKey(nx, ny))) return { posX: nx, posY: ny };
    }
  }
  return null;
}

/**
 * Picks a free canvas cell for a new node in `treeId`, as close as possible to
 * `preferred`, so the create doesn't hit @@unique([treeId, posX, posY]).
 * Must be called inside the create's transaction.
 */
export async function findFreePosition(
  tx: Prisma.TransactionClient,
  treeId: string,
  preferred: CanvasPosition,
): Promise<CanvasPosition> {
  // Every row in the tree, including soft-deleted ones, because the unique
  // index counts them too. Null positions never collide, so they are skipped.
  const nodes = await tx.skillNode.findMany({
    where: { treeId },
    select: { posX: true, posY: true },
  });
  const occupied = new Set<string>();
  for (const n of nodes) {
    if (n.posX != null && n.posY != null) occupied.add(cellKey(n.posX, n.posY));
  }

  const cell = nearestFreeCell(preferred, occupied);
  if (!cell) {
    throw new GraphQLError(
      "This tree's canvas has no free spot left. Move or delete a node first.",
    );
  }
  return cell;
}
