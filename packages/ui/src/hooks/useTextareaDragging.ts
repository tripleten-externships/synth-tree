import * as React from "react";

/**
 * Hook for handling textarea drag operations with sophisticated click vs drag detection
 *
 * WHAT: Manages drag state, prevents text selection conflicts, and implements sustained-click drag initiation
 * HOW: Uses timer-based drag detection, mouse position tracking, and edge detection to distinguish clicks from drags
 * WHY: Complex drag detection prevents accidental drags during text selection while allowing intentional moves.
 *      Timer prevents immediate drag start (avoids micro-movements). Edge detection prevents drag when resizing.
 *      Separate tracking states allow for smooth UX transitions between click/drag modes.
 */
export interface UseTextareaDraggingOptions {
  containerRef: React.RefObject<HTMLDivElement | null>;
  textareaPosition: { x: number; y: number };
  setTextareaPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
}

/**
 * Manages textarea dragging with intelligent click vs drag detection
 *
 * @param options - Container ref, current position, and position setter
 * @returns Drag state and mouse down handler for textarea element
 */
export function useTextareaDragging({
  containerRef,
  textareaPosition,
  setTextareaPosition,
}: UseTextareaDraggingOptions) {
  // WHAT: Track whether user is actively dragging
  // WHY: Controls drag event listeners and visual feedback
  const [isDraggingActive, setIsDraggingActive] = React.useState(false);

  // WHAT: Track whether we're monitoring mouse for potential drag start
  // WHY: Allows canceling drag preparation if user releases quickly (click vs drag distinction)
  const [isTrackingForDrag, setIsTrackingForDrag] = React.useState(false);

  // WHAT: Store offset between mouse and textarea position during drag
  // WHY: Maintains relative position so textarea follows mouse cursor accurately
  const [dragOffset, setDragOffset] = React.useState({ x: 0, y: 0 });

  // WHAT: Track when drag monitoring started
  // WHY: Used with timer to determine if click is "sustained" (drag vs click)
  const [dragStartTime, setDragStartTime] = React.useState<number | null>(null);

  // WHAT: Store initial mouse position when drag monitoring starts
  // WHY: Used to detect if mouse moved enough to trigger actual drag (vs micro-movements)
  const [dragStartPosition, setDragStartPosition] = React.useState<{ x: number; y: number } | null>(null);

  // WHAT: Track if user held mouse down long enough to indicate drag intent
  // WHY: Distinguishes between quick clicks and sustained holds that indicate drag intent
  const [isSustainedClick, setIsSustainedClick] = React.useState(false);

  /**
   * Handles mouse down on textarea with sophisticated drag detection
   *
   * WHAT: Initiates drag monitoring with timer-based detection and edge collision prevention
   * HOW: Sets up 100ms timer, checks for text selection and edge proximity, tracks mouse position
   * WHY: Timer prevents accidental drags from micro-movements. Edge detection prevents conflicts with resize handles.
   *      Text selection check prevents drag when user is selecting text. Complex logic ensures smooth UX.
   */
  const handleTextareaMouseDown = React.useCallback((e: React.MouseEvent) => {
    // WHAT: Clean up any existing drag timer from previous interactions
    // WHY: Prevents multiple timers from running simultaneously
    const existingTimer = (e.currentTarget as any).__dragTimer;
    if (existingTimer) {
      clearTimeout(existingTimer);
      (e.currentTarget as any).__dragTimer = null;
    }

    // WHAT: Prevent drag if user has selected text
    // WHY: Text selection should take precedence over dragging to preserve expected behavior
    const textarea = e.currentTarget as HTMLTextAreaElement;
    const hasSelection = textarea.selectionStart !== textarea.selectionEnd;

    if (hasSelection) {
      return;
    }

    // WHAT: Prevent drag if mouse is near textarea edges (resize zones)
    // HOW: Check if mouse is within 4px of any edge
    // WHY: Allows resize handles to work without triggering drag. EdgeThreshold prevents accidental overlap.
    const rect = e.currentTarget.getBoundingClientRect();
    const edgeThreshold = 4;
    const isNearEdge =
      e.clientX - rect.left < edgeThreshold ||
      rect.right - e.clientX < edgeThreshold ||
      e.clientY - rect.top < edgeThreshold ||
      rect.bottom - e.clientY < edgeThreshold;

    if (isNearEdge) {
      return;
    }

    // WHAT: Record drag initiation data
    // WHY: Establishes baseline for drag detection and position calculations
    const startTime = Date.now();
    const startPosition = { x: e.clientX, y: e.clientY };

    // WHAT: Calculate drag offset relative to container
    // WHY: Ensures textarea moves relative to mouse position within container bounds
    const containerRect = containerRef.current?.getBoundingClientRect();

    if (containerRect) {
      const offsetX = e.clientX - containerRect.left;
      const offsetY = e.clientY - containerRect.top;

      setDragOffset({ x: offsetX, y: offsetY });
    }

    // WHAT: Initialize drag tracking state
    // WHY: Sets up the monitoring phase before actual drag begins
    setDragStartTime(startTime);
    setDragStartPosition(startPosition);
    setIsTrackingForDrag(true);

    // WHAT: Set timer for sustained click detection
    // HOW: 150ms delay before drag is considered intentional
    // WHY: Prevents accidental drags from quick clicks or micro-movements. Longer than typical click duration.
    const dragTimer = setTimeout(() => {
      setIsSustainedClick(true);
      setIsDraggingActive(true);
      // WHAT: Disable text selection during drag
      // WHY: Prevents visual glitches and maintains drag focus
      document.body.style.userSelect = "none";
      document.body.style.webkitUserSelect = "none";
      setIsTrackingForDrag(false);
    }, 150);

    // WHAT: Store timer reference on DOM element for cleanup
    // WHY: Allows canceling timer if user releases mouse before timeout
    (e.currentTarget as any).__dragTimer = dragTimer;
  }, [containerRef]);

  // WHAT: Handle mouse events during drag or tracking phases
  // HOW: Global listeners capture mouse movement anywhere on document
  // WHY: Allows smooth dragging even when mouse moves outside textarea bounds
  React.useEffect(() => {
    if (!isDraggingActive && !isTrackingForDrag) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      // WHAT: Update textarea position during active drag
      // HOW: Calculate new position based on mouse position minus initial offset
      // WHY: Maintains relative positioning so textarea follows mouse cursor accurately
      if (isDraggingActive && isSustainedClick) {
        const parentRect = containerRef.current.parentElement?.getBoundingClientRect();
        if (!parentRect) return;

        const newX = e.clientX - parentRect.left - dragOffset.x;
        const newY = e.clientY - parentRect.top - dragOffset.y;

        setTextareaPosition({ x: newX, y: newY });
      }

      // WHAT: Cancel drag if mouse moves significantly during tracking phase
      // HOW: Calculate Euclidean distance from start position
      // WHY: Distinguishes between text selection (small movements) and drag intent (larger movements)
      if (isTrackingForDrag && dragStartPosition) {
        const deltaX = Math.abs(e.clientX - dragStartPosition.x);
        const deltaY = Math.abs(e.clientY - dragStartPosition.y);
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        // WHAT: Cancel drag preparation if mouse moved more than 0px
        // WHY: Any movement during tracking phase indicates text selection, not drag intent
        if (distance > 0) {
          setIsTrackingForDrag(false);
          // WHAT: Clear drag timers from all textareas
          // WHY: Prevents drag initiation if user was selecting text across multiple elements
          const textareaElements = document.querySelectorAll("textarea");
          textareaElements.forEach((textarea) => {
            const timer = (textarea as any).__dragTimer;
            if (timer) {
              clearTimeout(timer);
              (textarea as any).__dragTimer = null;
            }
          });
        }
      }
    };

    // WHAT: Clean up drag state on mouse release
    // WHY: Resets all drag-related state and re-enables text selection
    const handleMouseUp = () => {
      setIsDraggingActive(false);
      setIsTrackingForDrag(false);
      setIsSustainedClick(false);
      setDragStartTime(null);
      setDragStartPosition(null);
      // WHAT: Re-enable text selection
      // WHY: Restores normal browser behavior after drag operation
      document.body.style.userSelect = "";
      document.body.style.webkitUserSelect = "";

      // WHAT: Clear any remaining drag timers
      // WHY: Ensures no timers continue running after mouse release
      const textareaElements = document.querySelectorAll("textarea");
      textareaElements.forEach((textarea) => {
        const timer = (textarea as any).__dragTimer;
        if (timer) {
          clearTimeout(timer);
          (textarea as any).__dragTimer = null;
        }
      });
    };

    // WHAT: Attach global mouse event listeners
    // WHY: Capture mouse events anywhere on document for smooth drag experience
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      // WHAT: Clean up event listeners
      // WHY: Prevents memory leaks and ensures listeners are removed when component unmounts or dependencies change
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingActive, isTrackingForDrag, isSustainedClick, dragOffset, dragStartPosition, containerRef, setTextareaPosition]);

  // WHAT: Return drag state and handler for use in textarea component
  // WHY: Provides controlled interface for drag functionality
  return {
    isDraggingActive,
    isSustainedClick,
    isTrackingForDrag,
    handleTextareaMouseDown,
  };
}