/**
 * Custom hook for managing textarea boundaries and dimensions
 * Uses boundary-based approach for cleaner resize logic
 */

import { useState, useCallback, useEffect } from "react";
import {
  calculateResizedBoundaries,
  getDimensionsFromBoundaries,
  type ResizeDirection,
  type TextareaBoundaries,
  type BoundaryConstraints,
} from "../utils/resize-calculations";

interface UseTextareaDimensionsOptions {
  initialWidth: number;
  initialHeight: number;
  initialX: number;
  initialY: number;
  constraints: BoundaryConstraints;
}

interface ResizeState {
  isResizing: boolean;
  direction: ResizeDirection | null;
  startMouse: { x: number; y: number } | null;
  startPosition: { x: number; y: number } | null;
  startDimensions: { width: number; height: number } | null;
}

interface UseTextareaDimensionsReturn {
  // Boundary state
  boundaries: TextareaBoundaries;

  // Computed values
  textareaWidth: number;
  textareaHeight: number;
  containerStyle: React.CSSProperties;

  // Resize state
  isResizing: boolean;
  currentResizeDirection: ResizeDirection | null;

  // Actions
  updateBoundary: (side: keyof TextareaBoundaries, value: number) => void;
  handleResizeStart: (
    direction: ResizeDirection,
    mouseX: number,
    mouseY: number
  ) => void;
  handleResizeMove: (
    mouseX: number,
    mouseY: number,
    containerBounds: DOMRect
  ) => void;
  handleResizeEnd: () => void;
}

export function useTextareaDimensions({
  initialWidth,
  initialHeight,
  initialX,
  initialY,
  constraints,
}: UseTextareaDimensionsOptions): UseTextareaDimensionsReturn {
  // Core state - position and dimensions
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [dimensions, setDimensions] = useState({
    width: initialWidth,
    height: initialHeight,
  });

  // Resize state with start tracking
  const [resizeState, setResizeState] = useState<ResizeState>({
    isResizing: false,
    direction: null,
    startMouse: null,
    startPosition: null,
    startDimensions: null,
  });

  // Calculate boundaries from position and dimensions (for compatibility)
  const boundaries: TextareaBoundaries = {
    top: position.y,
    bottom: position.y + dimensions.height + 40, // Include header
    left: position.x,
    right: position.x + dimensions.width,
  };

  const textareaWidth = dimensions.width;
  const textareaHeight = dimensions.height;

  // Action handlers
  const updateBoundary = useCallback(
    (side: keyof TextareaBoundaries, value: number) => {
      // Convert boundary updates to position/dimension updates
      if (side === "left") {
        const newWidth = boundaries.right - value;
        setPosition((prev) => ({ ...prev, x: value }));
        setDimensions((prev) => ({
          ...prev,
          width: Math.max(newWidth, constraints.minWidth),
        }));
      } else if (side === "right") {
        const newWidth = value - boundaries.left;
        setDimensions((prev) => ({
          ...prev,
          width: Math.max(newWidth, constraints.minWidth),
        }));
      } else if (side === "top") {
        const newHeight = boundaries.bottom - value - 40; // Subtract header
        setPosition((prev) => ({ ...prev, y: value }));
        setDimensions((prev) => ({
          ...prev,
          height: Math.max(newHeight, constraints.minHeight),
        }));
      } else if (side === "bottom") {
        const newHeight = value - boundaries.top - 40; // Subtract header
        setDimensions((prev) => ({
          ...prev,
          height: Math.max(newHeight, constraints.minHeight),
        }));
      }
    },
    [boundaries, constraints]
  );

  const handleResizeStart = useCallback(
    (direction: ResizeDirection, mouseX: number, mouseY: number) => {
      console.log("Resize start:", direction, {
        mouseX,
        mouseY,
        position,
        dimensions,
      });
      setResizeState({
        isResizing: true,
        direction,
        startMouse: { x: mouseX, y: mouseY },
        startPosition: { ...position },
        startDimensions: { ...dimensions },
      });
    },
    [position, dimensions]
  );

  const handleResizeMove = useCallback(
    (mouseX: number, mouseY: number, containerBounds: DOMRect) => {
      if (
        !resizeState.isResizing ||
        !resizeState.direction ||
        !resizeState.startMouse ||
        !resizeState.startPosition ||
        !resizeState.startDimensions
      )
        return;

      // Calculate mouse movement from start
      const mouseDeltaX = mouseX - resizeState.startMouse.x;
      const mouseDeltaY = mouseY - resizeState.startMouse.y;

      console.log("Resize move relative:", {
        mouseX,
        mouseY,
        mouseDeltaX,
        mouseDeltaY,
        direction: resizeState.direction,
        startPosition: resizeState.startPosition,
        startDimensions: resizeState.startDimensions,
      });

      let newPosition = { ...resizeState.startPosition };
      let newDimensions = { ...resizeState.startDimensions };

      // Handle resize by calculating changes from start state - mirror south behavior
      if (resizeState.direction.includes("east")) {
        // Right edge: expand rightward from fixed left edge (like south expands downward from fixed top)
        const newWidth = Math.max(
          constraints.minWidth,
          Math.min(
            constraints.maxWidth,
            resizeState.startDimensions.width + mouseDeltaX
          )
        );
        newDimensions.width = newWidth;
        // Left edge stays fixed at startPosition.x
        console.log("East resize (mirror south):", {
          startWidth: resizeState.startDimensions.width,
          mouseDeltaX,
          newWidth,
        });
      }

      if (resizeState.direction.includes("west")) {
        // Left edge: expand leftward from fixed right edge (opposite of south)
        const newWidth = Math.max(
          constraints.minWidth,
          Math.min(
            constraints.maxWidth,
            resizeState.startDimensions.width - mouseDeltaX
          )
        );
        newDimensions.width = newWidth;
        // Right edge stays fixed, so adjust position leftward
        newPosition.x =
          resizeState.startPosition.x +
          (resizeState.startDimensions.width - newWidth);
        console.log("West resize (mirror south opposite):", {
          startWidth: resizeState.startDimensions.width,
          mouseDeltaX,
          newWidth,
          widthChange: resizeState.startDimensions.width - newWidth,
          newPositionX: newPosition.x,
        });
      }

      if (resizeState.direction.includes("south")) {
        // Bottom edge: increase height by mouse movement, keep top edge fixed
        const newHeight = Math.max(
          constraints.minHeight,
          Math.min(
            constraints.maxHeight,
            resizeState.startDimensions.height + mouseDeltaY
          )
        );
        newDimensions.height = newHeight;
        // Position stays the same (top edge fixed)
        console.log("South resize:", {
          startHeight: resizeState.startDimensions.height,
          mouseDeltaY,
          newHeight,
        });
      }

      if (resizeState.direction.includes("north")) {
        // Top edge: expand upward from fixed bottom edge (opposite of south)
        const newHeight = Math.max(
          constraints.minHeight,
          Math.min(
            constraints.maxHeight,
            resizeState.startDimensions.height - mouseDeltaY
          )
        );
        newDimensions.height = newHeight;
        // Bottom edge stays fixed, so adjust position upward
        newPosition.y =
          resizeState.startPosition.y +
          (resizeState.startDimensions.height - newHeight);
        console.log("North resize (mirror south opposite):", {
          startHeight: resizeState.startDimensions.height,
          mouseDeltaY,
          newHeight,
          heightChange: resizeState.startDimensions.height - newHeight,
          newPositionY: newPosition.y,
        });
      }

      console.log("Final resize update:", { newPosition, newDimensions });

      // Update state in single operations
      setPosition(newPosition);
      setDimensions(newDimensions);
    },
    [resizeState, constraints]
  );

  const handleResizeEnd = useCallback(() => {
    console.log("Resize end");
    setResizeState({
      isResizing: false,
      direction: null,
      startMouse: null,
      startPosition: null,
      startDimensions: null,
    });
  }, []);

  // Calculate container style (includes header space)
  const headerHeight = 40; // Height for h3 + margin
  const totalHeight = textareaHeight + headerHeight;
  const containerStyle: React.CSSProperties = {
    width: `${textareaWidth}px`,
    height: `${totalHeight}px`,
    paddingTop: `${headerHeight}px`,
    boxSizing: "border-box",
    transform: `translate(${position.x}px, ${position.y}px)`,
    border: resizeState.isResizing ? "2px solid red" : "none", // Debug visual
  };

  // Debug log dimension changes
  useEffect(() => {
    console.log("State updated:", {
      textareaWidth,
      textareaHeight,
      position,
      dimensions,
      calculatedBoundaries: boundaries,
    });
  }, [textareaWidth, textareaHeight, position, dimensions, boundaries]);

  return {
    // Boundary state (for compatibility)
    boundaries,

    // Computed values
    textareaWidth,
    textareaHeight,
    containerStyle,

    // Resize state
    isResizing: resizeState.isResizing,
    currentResizeDirection: resizeState.direction,

    // Actions
    updateBoundary,
    handleResizeStart,
    handleResizeMove,
    handleResizeEnd,
  };
}
