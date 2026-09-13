import type { SkillTreeData } from "./SkillTree";

/**
 * Layout is kept separate from skill content (title/url/status/edges) on
 * purpose: content is going to come from the backend later, but where a
 * node sits on the canvas is a local presentation concern until then.
 * Swap the two functions below for real API calls when that backend
 * exists — everything that calls them stays the same.
 */
export type PositionMap = Record<string, { x: number; y: number }>;

const STORAGE_KEY = "skilltree.positions.v1";

export function loadPositions(): PositionMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PositionMap) : {};
  } catch {
    return {};
  }
}

export function savePositions(positions: PositionMap): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
}

/** Overlays saved positions onto a tree's default node coordinates. */
export function applyPositions(tree: SkillTreeData, positions: PositionMap): SkillTreeData {
  return {
    ...tree,
    nodes: tree.nodes.map((n) => (positions[n.id] ? { ...n, ...positions[n.id] } : n)),
  };
}
