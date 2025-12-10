import * as React from "react";

/**
 * Hook for managing textarea positioning within a container
 *
 * Provides state management for textarea x,y coordinates and automatic centering
 * Uses useState for position state, useRef for synchronous access, and useEffect for initial centering
 * Separate positioning logic from component to enable reusability and testing.
 *      useRef provides synchronous access needed for mouse event handlers that can't wait for state updates.
 *      Initial centering ensures textarea appears in viewport center rather than top-left corner.
 *      Resize handling keeps textarea centered during window size changes.
 */
export interface UseTextareaPositioningOptions {
  initialWidth: number;
  initialHeight: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export interface TextareaPosition {
  x: number;
  y: number;
}

/**
 * Manages textarea positioning with automatic viewport centering
 *
 * @param options - Configuration object with initial dimensions and container reference
 * @returns Object containing position state, setter, and ref for synchronous access
 */
export function useTextareaPositioning({
  initialWidth,
  initialHeight,
  containerRef,
}: UseTextareaPositioningOptions) {

  // WHAT: Store current position state
  // WHY: Standard React state management for position coordinates

  const [textareaPosition, setTextareaPosition] =
    React.useState<TextareaPosition>({
      x: 0,
      y: 0,
    });

  // Ref for synchronous position access during mouse events
  // Mouse event handlers need immediate position values without waiting for React state updates.
  //      This prevents stale closure issues during rapid mouse movements.
  const textareaPositionRef = React.useRef(textareaPosition);

  // Keep ref in sync with state changes
  // Ensures ref always reflects the latest position state for mouse event handlers
  React.useEffect(() => {
    textareaPositionRef.current = textareaPosition;
  }, [textareaPosition]);

  // Center textarea in viewport on initial mount
  // Calculates center position based on viewport size and initial dimensions
  // Better UX - textarea appears centered rather than at (0,0). Uses setTimeout to ensure parent is rendered.
  // Math.max(0, ...) prevents negative positions that would place textarea off-screen.
  React.useEffect(() => {
    const centerTextarea = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const parentRect =
        containerRef.current?.parentElement?.getBoundingClientRect();

      // Calculate center position, accounting for parent element offset
      const centerX = Math.max(
        0,
        (viewportWidth - initialWidth) / 2 - (parentRect?.left || 0)
      );
      const centerY = Math.max(
        0,
        (viewportHeight - initialHeight) / 2 - (parentRect?.top || 0)
      );

      setTextareaPosition({ x: centerX, y: centerY });
    };

    // Delay ensures parent element is fully rendered before calculating position
    const timeoutId = setTimeout(centerTextarea, 0);

    // Recenter textarea when window resizes
    // Maintains centered appearance during responsive layout changes
    const handleResize = () => {
      centerTextarea();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      // Cleanup timeout and event listener
      // Prevents memory leaks and ensures event listeners are removed when component unmounts
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
    };
  }, [initialWidth, initialHeight, containerRef]);

  // Return position state, setter, and synchronous ref
  // Provides both async state updates (for React rendering) and sync ref access (for mouse events)
  return {
    textareaPosition,
    setTextareaPosition,
    textareaPositionRef,
  };
}

