/**
 * Custom hook for managing global mouse events during drag operations
 * Handles mouse move and mouse up events across the entire document
 */

import { useEffect } from "react";

interface UseGlobalMouseEventsOptions {
  isActive: boolean;
  onMouseMove?: (e: MouseEvent) => void;
  onMouseUp?: (e: MouseEvent) => void;
  onWheel?: (e: WheelEvent) => void;
  enableWheel?: boolean;
}

export function useGlobalMouseEvents({
  isActive,
  onMouseMove,
  onMouseUp,
  onWheel,
  enableWheel = false,
}: UseGlobalMouseEventsOptions): void {
  useEffect(() => {
    if (!isActive) return;

    const handleMouseMove = (e: MouseEvent) => {
      onMouseMove?.(e);
    };

    const handleMouseUp = (e: MouseEvent) => {
      onMouseUp?.(e);
    };

    const handleWheel = (e: WheelEvent) => {
      if (enableWheel) {
        onWheel?.(e);
      }
    };

    // Add event listeners
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    if (enableWheel) {
      document.addEventListener("wheel", handleWheel, { passive: false });
    }

    // Cleanup function
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);

      if (enableWheel) {
        document.removeEventListener("wheel", handleWheel);
      }
    };
  }, [isActive, onMouseMove, onMouseUp, onWheel, enableWheel]);
}
