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

export const CANVAS_MIN = 0;
export const CANVAS_MAX = 100;
// New nodes stay this far inside the edges while there is room, so they
// aren't clipped by the admin canvas.
const PREFERRED_MIN = 10;
const PREFERRED_MAX = 90;

export interface CanvasPosition {
  posX: number;
  posY: number;
}

export const isOnCanvas = (v: number) => v >= CANVAS_MIN && v <= CANVAS_MAX;

export const cellKey = (x: number, y: number) => `${x},${y}`;

const toPreferredCell = (v: number) =>
  Math.min(PREFERRED_MAX, Math.max(PREFERRED_MIN, Math.round(v / GRID_STEP) * GRID_STEP));

// 0, +5, -5, +10, -10, ...: closest first, right/below before left/above.
const OFFSETS = [0];
for (let d = GRID_STEP; d <= CANVAS_MAX - CANVAS_MIN; d += GRID_STEP) OFFSETS.push(d, -d);

// Grid cells within [min, max] in the order we try them: the same row first,
// then the closest rows; within a row, the closest column.
function cellsAround(x: number, y: number, min: number, max: number): CanvasPosition[] {
  const cells: CanvasPosition[] = [];
  for (const dy of OFFSETS) {
    if (y + dy < min || y + dy > max) continue;
    for (const dx of OFFSETS) {
      if (x + dx < min || x + dx > max) continue;
      cells.push({ posX: x + dx, posY: y + dy });
    }
  }
  return cells;
}

// A node at `cell` doesn't overlap `other` if it is a full column gap away
// sideways or a full row gap away vertically.
const isClearOf = (cell: CanvasPosition, other: CanvasPosition) =>
  Math.abs(cell.posX - other.posX) >= COLUMN_GAP || Math.abs(cell.posY - other.posY) >= ROW_GAP;

/**
 * The preferred cell (snapped to the grid and kept off the edges) if no node
 * is too close to it. Otherwise the closest cell that is clear of every node,
 * staying in the same row if it can, so a full row spills onto the row below.
 * Only when nothing clear is left does it take any cell no other node uses.
 * Returns null when every cell is taken.
 */
export function nearestFreeCell(
  preferred: CanvasPosition,
  occupied: ReadonlyArray<CanvasPosition>,
): CanvasPosition | null {
  const x = toPreferredCell(preferred.posX);
  const y = toPreferredCell(preferred.posY);

  for (const cell of cellsAround(x, y, PREFERRED_MIN, PREFERRED_MAX)) {
    if (occupied.every((other) => isClearOf(cell, other))) return cell;
  }

  // Crowded canvas: nodes may overlap now, but never share a cell, which is
  // what @@unique([treeId, posX, posY]) requires.
  const taken = new Set(occupied.map((o) => cellKey(o.posX, o.posY)));
  for (const cell of cellsAround(x, y, CANVAS_MIN, CANVAS_MAX)) {
    if (!taken.has(cellKey(cell.posX, cell.posY))) return cell;
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
  const occupied: CanvasPosition[] = [];
  for (const n of nodes) {
    if (n.posX != null && n.posY != null) occupied.push({ posX: n.posX, posY: n.posY });
  }

  const cell = nearestFreeCell(preferred, occupied);
  if (!cell) {
    throw new GraphQLError(
      "This tree's canvas has no free spot left. Move or delete a node first.",
    );
  }
  return cell;
}
