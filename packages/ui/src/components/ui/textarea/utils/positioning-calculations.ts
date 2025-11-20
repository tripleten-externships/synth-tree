/**
 * Utility functions for textarea positioning calculations
 * Following BEM methodology and self-explanatory naming
 */

export interface TextareaGeometry {
  width: number;
  height: number;
  x: number;
  y: number;
}

export interface LabelPosition {
  angle: number;
  distance: number;
}

export interface ScreenBoundaries {
  width: number;
  height: number;
  marginThreshold: number;
}

export interface TransparentBlockDimensions {
  width: number;
  height: number;
  left: number;
  top: number;
}

/**
 * Calculates the expanded transparent block dimensions around the textarea
 */
export function calculateTransparentBlockDimensions(
  textareaDimensions: { width: number; height: number },
  blockExpansion: number
): TransparentBlockDimensions {
  const blockWidth = textareaDimensions.width + blockExpansion * 2;
  const blockHeight = textareaDimensions.height + blockExpansion * 2;

  return {
    width: blockWidth,
    height: blockHeight,
    left: -blockExpansion,
    top: -blockExpansion,
  };
}

/**
 * Determines which edge of the transparent block the label should be positioned on
 */
export function calculateLabelEdgePosition(
  labelAngle: number,
  blockDimensions: TransparentBlockDimensions
): { x: number; y: number; edge: "north" | "east" | "south" | "west" } {
  const normalizedAngle = ((labelAngle % 360) + 360) % 360;
  let finalX: number;
  let finalY: number;
  let edge: "north" | "east" | "south" | "west";

  if (normalizedAngle >= 315 || normalizedAngle < 45) {
    // Right edge of block - label's west edge pinned to block's east edge
    edge = "east";
    finalX = blockDimensions.left + blockDimensions.width;
    const progress =
      normalizedAngle < 45
        ? normalizedAngle / 45
        : (normalizedAngle - 315) / 45;
    finalY = blockDimensions.top + progress * blockDimensions.height;
  } else if (normalizedAngle >= 45 && normalizedAngle < 135) {
    // Bottom edge of block - label's north edge pinned to block's south edge
    edge = "south";
    finalY = blockDimensions.top + blockDimensions.height;
    const progress = (normalizedAngle - 45) / 90;
    finalX =
      blockDimensions.left +
      blockDimensions.width -
      progress * blockDimensions.width;
  } else if (normalizedAngle >= 135 && normalizedAngle < 225) {
    // Left edge of block - label's east edge pinned to block's west edge
    edge = "west";
    finalX = blockDimensions.left;
    const progress = (normalizedAngle - 135) / 90;
    finalY =
      blockDimensions.top +
      blockDimensions.height -
      progress * blockDimensions.height;
  } else {
    // Top edge of block - label's south edge pinned to block's north edge
    edge = "north";
    finalY = blockDimensions.top;
    const progress = (normalizedAngle - 225) / 90;
    finalX = blockDimensions.left + progress * blockDimensions.width;
  }

  return { x: finalX, y: finalY, edge };
}

/**
 * Calculates the CSS transform string for label positioning based on edge
 */
export function calculateLabelTransformString(
  edge: "north" | "east" | "south" | "west"
): string {
  switch (edge) {
    case "east":
      // Right edge: anchor by left side of label
      return "translateY(-50%)";
    case "south":
      // Bottom edge: anchor by top of label
      return "translateX(-50%)";
    case "west":
      // Left edge: anchor by right side of label
      return "translate(-100%, -50%)";
    case "north":
      // Top edge: anchor by bottom of label
      return "translate(-50%, -100%)";
    default:
      return "translate(-50%, -50%)";
  }
}

/**
 * Checks if label position would be outside screen boundaries
 */
export function isLabelPositionOffScreen(
  labelPosition: { x: number; y: number },
  containerRect: DOMRect,
  blockDimensions: TransparentBlockDimensions,
  screenBoundaries: ScreenBoundaries
): boolean {
  const { marginThreshold } = screenBoundaries;

  return [
    // Right edge
    containerRect.left + blockDimensions.width >
      screenBoundaries.width - marginThreshold,
    // Bottom edge
    containerRect.top + blockDimensions.height >
      screenBoundaries.height - marginThreshold,
    // Left edge
    containerRect.left + blockDimensions.left < marginThreshold,
    // Top edge
    containerRect.top + blockDimensions.top < marginThreshold,
  ].some(Boolean);
}

/**
 * Calculates maximum safe expansion for screen boundaries
 */
export function calculateMaxSafeExpansion(
  containerRect: DOMRect,
  textareaDimensions: { width: number; height: number },
  screenBoundaries: ScreenBoundaries,
  minimumExpansion: number
): number {
  const { marginThreshold } = screenBoundaries;

  const maxSafeExpansion = Math.min(
    (screenBoundaries.width -
      containerRect.left -
      textareaDimensions.width -
      marginThreshold) /
      2,
    (screenBoundaries.height -
      containerRect.top -
      textareaDimensions.height -
      marginThreshold) /
      2,
    containerRect.left - marginThreshold,
    containerRect.top - marginThreshold
  );

  return Math.max(minimumExpansion, maxSafeExpansion);
}

/**
 * Calculates the angle from center point to mouse position
 */
export function calculateAngleFromMousePosition(
  mouseX: number,
  mouseY: number,
  centerX: number,
  centerY: number
): number {
  return (Math.atan2(mouseY - centerY, mouseX - centerX) * 180) / Math.PI;
}
