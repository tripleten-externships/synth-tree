/**
 * Utility functions for textarea resize operations using boundary-based approach
 * Uses top, bottom, left, right boundaries for cleaner resize logic
 */

export type ResizeDirection =
  | "north"
  | "east"
  | "south"
  | "west"
  | "northeast"
  | "northwest"
  | "southeast"
  | "southwest";

export interface TextareaBoundaries {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface BoundaryConstraints {
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
}

export interface ResizeMouseData {
  clientX: number;
  clientY: number;
}

/**
 * Checks if mouse position is near resize edges
 */
export function isMouseNearResizeEdge(
  mouseEvent: React.MouseEvent,
  edgeThreshold: number = 4
): boolean {
  const rect = mouseEvent.currentTarget.getBoundingClientRect();
  const { clientX, clientY } = mouseEvent;

  return (
    clientX - rect.left < edgeThreshold ||
    rect.right - clientX < edgeThreshold ||
    clientY - rect.top < edgeThreshold ||
    rect.bottom - clientY < edgeThreshold
  );
}

/**
 * Calculates new boundaries based on resize direction and mouse position
 */
export function calculateResizedBoundaries(
  direction: ResizeDirection,
  mouseData: ResizeMouseData,
  containerBounds: DOMRect,
  currentBoundaries: TextareaBoundaries,
  constraints: BoundaryConstraints
): TextareaBoundaries {
  let newBoundaries = { ...currentBoundaries };

  // Get mouse position relative to the viewport
  const mouseX = mouseData.clientX;
  const mouseY = mouseData.clientY;

  // Handle horizontal resize directions
  if (direction.includes("east")) {
    // Moving right edge - extend or shrink from current left boundary
    const newWidth = Math.max(
      constraints.minWidth,
      Math.min(constraints.maxWidth, mouseX - currentBoundaries.left)
    );
    newBoundaries.right = currentBoundaries.left + newWidth;
  }

  if (direction.includes("west")) {
    // Moving left edge - maintain right boundary, adjust left
    const newWidth = Math.max(
      constraints.minWidth,
      Math.min(constraints.maxWidth, currentBoundaries.right - mouseX)
    );
    newBoundaries.left = currentBoundaries.right - newWidth;
  }

  // Handle vertical resize directions
  if (direction.includes("north")) {
    // Moving top edge - maintain bottom boundary, adjust top
    const minTotalHeight = constraints.minHeight + 40; // Include header space
    const maxTotalHeight = constraints.maxHeight + 40;
    const newHeight = Math.max(
      minTotalHeight,
      Math.min(maxTotalHeight, currentBoundaries.bottom - mouseY)
    );
    newBoundaries.top = currentBoundaries.bottom - newHeight;
  }

  if (direction.includes("south")) {
    // Moving bottom edge - extend or shrink from current top boundary
    const minTotalHeight = constraints.minHeight + 40; // Include header space
    const maxTotalHeight = constraints.maxHeight + 40;
    const newHeight = Math.max(
      minTotalHeight,
      Math.min(maxTotalHeight, mouseY - currentBoundaries.top)
    );
    newBoundaries.bottom = currentBoundaries.top + newHeight;
  }

  return newBoundaries;
}

/**
 * Calculate dimensions from boundaries
 */
export function getDimensionsFromBoundaries(boundaries: TextareaBoundaries): {
  width: number;
  height: number;
} {
  return {
    width: boundaries.right - boundaries.left,
    height: boundaries.bottom - boundaries.top,
  };
}

/**
 * Gets the appropriate cursor style for resize direction
 */
export function getResizeCursorStyle(direction: ResizeDirection): string {
  const cursorMap: Record<ResizeDirection, string> = {
    north: "n-resize",
    east: "e-resize",
    south: "s-resize",
    west: "w-resize",
    northeast: "ne-resize",
    northwest: "nw-resize",
    southeast: "se-resize",
    southwest: "sw-resize",
  };

  return cursorMap[direction] || "default";
}

/**
 * Determines which resize edges should be highlighted
 */
export function getHoveredResizeEdges(direction: ResizeDirection): string[] {
  const edgeMap: Record<ResizeDirection, string[]> = {
    north: ["north"],
    east: ["east"],
    south: ["south"],
    west: ["west"],
    northeast: ["north", "east"],
    northwest: ["north", "west"],
    southeast: ["south", "east"],
    southwest: ["south", "west"],
  };

  return edgeMap[direction] || [];
}
