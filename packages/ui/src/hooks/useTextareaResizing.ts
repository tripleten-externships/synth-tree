import * as React from "react";

/**
 * Resize direction types for multi-directional textarea resizing
 * WHY: TypeScript ensures only valid resize directions are used throughout the system
 */
type ResizeDirection =
  | "north"
  | "east"
  | "south"
  | "west"
  | "northeast"
  | "northwest"
  | "southeast"
  | "southwest";

/**
 * Hook for handling multi-directional textarea resizing with constraint validation
 *
 * WHAT: Manages resize operations, cursor feedback, and maintains size/position constraints
 * HOW: Tracks mouse position relative to initial bounds, calculates new dimensions based on resize direction
 * WHY: Complex resize logic handles 8 directions with proper constraint enforcement.
 *      Separate refs provide synchronous access for mouse event handlers.
 *      Edge detection prevents conflicts with drag operations.
 */
export interface UseTextareaResizingOptions {
  minWidth: number;
  minHeight: number;
  maxWidth: number;
  maxHeight: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  textareaDimensions: { width: number; height: number };
  setTextareaDimensions: React.Dispatch<React.SetStateAction<{ width: number; height: number }>>;
  textareaPosition: { x: number; y: number };
  setTextareaPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
}

/**
 * Manages textarea resizing with multi-directional support and constraints
 *
 * @param options - Resize configuration with dimensions, constraints, and refs
 * @returns Resize state, cursor feedback, and event handlers
 */
export function useTextareaResizing({
  minWidth,
  minHeight,
  maxWidth,
  maxHeight,
  containerRef,
  textareaDimensions,
  setTextareaDimensions,
  textareaPosition,
  setTextareaPosition,
}: UseTextareaResizingOptions) {
  // WHAT: Track whether resize operation is currently active
  // WHY: Controls resize event listeners and visual feedback
  const [isResizingActive, setIsResizingActive] = React.useState(false);

  // WHAT: Store current resize direction (north, east, etc.)
  // WHY: Determines how mouse movements affect dimensions and position
  const [currentResizeDirection, setCurrentResizeDirection] = React.useState<ResizeDirection | null>(null);

  // WHAT: Track which resize edges are being hovered
  // WHY: Provides visual feedback for available resize directions
  const [hoveredResizeEdge, setHoveredResizeEdge] = React.useState<string[]>([]);

  // WHAT: Store initial textarea bounds at resize start
  // WHY: Used as reference point for calculating relative mouse movements
  const [initialResizeBounds, setInitialResizeBounds] = React.useState<DOMRect | null>(null);

  // WHAT: Refs for synchronous access during mouse events
  // WHY: Mouse event handlers need immediate values without waiting for React state updates
  const currentResizeDirectionRef = React.useRef(currentResizeDirection);
  const initialResizeBoundsRef = React.useRef(initialResizeBounds);
  const textareaDimensionsRef = React.useRef(textareaDimensions);
  const textareaPositionRef = React.useRef(textareaPosition);

  // WHAT: Keep refs synchronized with state
  // WHY: Ensures mouse event handlers always have latest values
  React.useEffect(() => {
    currentResizeDirectionRef.current = currentResizeDirection;
  }, [currentResizeDirection]);

  React.useEffect(() => {
    initialResizeBoundsRef.current = initialResizeBounds;
  }, [initialResizeBounds]);

  React.useEffect(() => {
    textareaDimensionsRef.current = textareaDimensions;
  }, [textareaDimensions]);

  React.useEffect(() => {
    textareaPositionRef.current = textareaPosition;
  }, [textareaPosition]);

  /**
   * Initiates resize operation for specified direction
   *
   * WHAT: Sets up resize state and attaches global mouse listeners for smooth resizing
   * HOW: Captures initial bounds, sets resize direction, handles mouse movements with constraint validation
   * WHY: Global listeners allow resizing even when mouse moves outside original bounds.
   *      Initial bounds provide reference for calculating relative movements.
   */
  const handleResizeStart = React.useCallback(
    (e: React.MouseEvent, direction: ResizeDirection) => {
      e.preventDefault();
      e.stopPropagation();

      // WHAT: Capture initial textarea bounds for relative calculations
      // WHY: Mouse movements are calculated relative to initial position, not absolute coordinates
      if (containerRef.current) {
        const initialBounds = containerRef.current.getBoundingClientRect();
        setInitialResizeBounds(initialBounds);
        initialResizeBoundsRef.current = initialBounds;
      }

      // WHAT: Initialize resize state
      // WHY: Sets up the resize operation with proper direction tracking
      setIsResizingActive(true);
      setCurrentResizeDirection(direction);
      currentResizeDirectionRef.current = direction;

      /**
       * Handles mouse movement during resize with complex directional logic
       *
       * WHAT: Calculates new dimensions and position based on resize direction and mouse position
       * HOW: Uses directional string matching (includes "east", "west", etc.) to determine resize behavior
       * WHY: Supports 8-way resizing with proper constraint enforcement. Position adjustments prevent
       *      textarea from jumping when resizing from different edges. Complex math ensures smooth UX.
       */
      const handleMouseMove = (moveEvent: MouseEvent) => {
        if (!containerRef.current || !initialResizeBoundsRef.current) return;

        const currentDirection = currentResizeDirectionRef.current;
        if (!currentDirection) return;

        const containerBounds = initialResizeBoundsRef.current;
        const currentDimensions = textareaDimensionsRef.current;
        const currentPosition = textareaPositionRef.current;

        // WHAT: Initialize new values with current state
        // WHY: Start with current values and modify based on resize direction
        let newWidth = currentDimensions.width;
        let newHeight = currentDimensions.height;
        let newX = currentPosition.x;
        let newY = currentPosition.y;

        // WHAT: Handle east-directed resizing (right edge)
        // HOW: Calculate width based on mouse position relative to parent container
        // WHY: East resize changes width while keeping left edge fixed. Mouse-relative-to-parent
        //      ensures accurate positioning regardless of page scroll or container offset.
        if (currentDirection.includes("east")) {
          const container = containerRef.current;
          const parentElement = container?.parentElement;
          if (!parentElement) return;

          const parentRect = parentElement.getBoundingClientRect();
          const mouseRelativeToParent = moveEvent.clientX - parentRect.left;

          const proposedWidth = Math.max(
            minWidth,
            Math.min(maxWidth, mouseRelativeToParent - currentPosition.x)
          );
          newWidth = proposedWidth;
        }

        // WHAT: Handle west-directed resizing (left edge)
        // HOW: Adjusts both width and X position to resize from left edge
        // WHY: West resize moves the textarea left while shrinking width. Position adjustment
        //      prevents visual jumping. Complex calculation maintains right edge position.
        if (currentDirection.includes("west")) {
          const container = containerRef.current;
          const parentElement = container?.parentElement;
          if (!parentElement) return;

          const parentRect = parentElement.getBoundingClientRect();
          const mouseRelativeToParent = moveEvent.clientX - parentRect.left;

          const currentEastEdgeRelativeToParent =
            currentPosition.x + currentDimensions.width;

          const proposedWidth = Math.max(
            minWidth,
            Math.min(
              maxWidth,
              currentEastEdgeRelativeToParent - mouseRelativeToParent
            )
          );
          const actualWidthChange = proposedWidth - currentDimensions.width;
          newWidth = proposedWidth;
          newX = currentPosition.x - actualWidthChange;
        }

        // WHAT: Handle south-directed resizing (bottom edge)
        // HOW: Simple height calculation based on mouse Y position
        // WHY: South resize only affects height, keeping top edge fixed
        if (currentDirection.includes("south")) {
          newHeight = Math.max(
            minHeight,
            Math.min(maxHeight, moveEvent.clientY - containerBounds.top)
          );
        }

        // WHAT: Handle north-directed resizing (top edge)
        // HOW: Adjusts both height and Y position to resize from top edge
        // WHY: North resize moves textarea up while shrinking height. Position adjustment
        //      prevents visual jumping by maintaining bottom edge position.
        if (currentDirection.includes("north")) {
          const proposedHeight = Math.max(
            minHeight,
            Math.min(maxHeight, containerBounds.bottom - moveEvent.clientY)
          );
          const heightDiff = proposedHeight - newHeight;
          newHeight = proposedHeight;
          newY = currentPosition.y - heightDiff;
        }

        // WHAT: Apply calculated dimensions and position
        // WHY: Updates both size and position simultaneously for smooth resize experience
        setTextareaDimensions({ width: newWidth, height: newHeight });
        setTextareaPosition({ x: newX, y: newY });
      };

      // WHAT: Clean up resize operation on mouse release
      // WHY: Resets resize state and removes event listeners to prevent memory leaks
      const handleMouseUp = () => {
        setIsResizingActive(false);
        setCurrentResizeDirection(null);
        currentResizeDirectionRef.current = null;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      // WHAT: Attach global mouse listeners for resize operation
      // WHY: Allows smooth resizing even when mouse moves outside textarea bounds
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [minWidth, minHeight, maxWidth, maxHeight, containerRef, setTextareaDimensions, setTextareaPosition]
  );

  // WHAT: Return resize state and handlers for use in textarea component
  // WHY: Provides controlled interface for resize functionality
  return {
    isResizingActive,
    currentResizeDirection,
    hoveredResizeEdge,
    setHoveredResizeEdge,
    handleResizeStart,
  };
}