/**
 * Custom hook for managing textarea drag functionality
 * Handles sustained click detection and drag positioning
 */

import { useState, useCallback, useRef } from 'react';
import { isMouseNearResizeEdge } from '../utils/resize-calculations';

interface DragOffset {
  x: number;
  y: number;
}

interface DragPosition {
  x: number;
  y: number;
}

interface UseTextareaDragOptions {
  sustainedClickDelay?: number;
  edgeThreshold?: number;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onPositionChange?: (position: DragPosition) => void;
}

interface UseTextareaDragReturn {
  // State values
  isDragging: boolean;
  isSustainedClick: boolean;
  isTrackingForDrag: boolean;
  dragOffset: DragOffset;
  
  // Event handlers
  handleTextareaMouseDown: (e: React.MouseEvent<HTMLTextAreaElement>) => void;
  handleDragMove: (mouseX: number, mouseY: number) => void;
  handleDragEnd: () => void;
  
  // Utilities
  cancelDragTimer: () => void;
}

export function useTextareaDrag({
  sustainedClickDelay = 150,
  edgeThreshold = 4,
  onDragStart,
  onDragEnd,
  onPositionChange
}: UseTextareaDragOptions = {}): UseTextareaDragReturn {
  // Internal state
  const [isDragging, setIsDragging] = useState(false);
  const [isSustainedClick, setIsSustainedClick] = useState(false);
  const [isTrackingForDrag, setIsTrackingForDrag] = useState(false);
  const [dragOffset, setDragOffset] = useState<DragOffset>({ x: 0, y: 0 });
  
  // Refs for timer management
  const dragTimerRef = useRef<number | null>(null);

  const cancelDragTimer = useCallback(() => {
    if (dragTimerRef.current) {
      clearTimeout(dragTimerRef.current);
      dragTimerRef.current = null;
    }
  }, []);

  const handleTextareaMouseDown = useCallback((e: React.MouseEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    
    // Check if there's already selected text - if so, don't activate drag
    const hasSelection = textarea.selectionStart !== textarea.selectionEnd;
    if (hasSelection) {
      return; // Let normal text selection behavior continue
    }
    
    // Only handle if not clicking near resize edges
    if (isMouseNearResizeEdge(e, edgeThreshold)) {
      return; // Let resize handle this
    }

    // Calculate drag offset from container
    const containerRect = textarea.getBoundingClientRect();
    const offsetX = e.clientX - containerRect.left;
    const offsetY = e.clientY - containerRect.top;
    
    setDragOffset({ x: offsetX, y: offsetY });
    setIsTrackingForDrag(true);
    
    // Start sustained click detection
    dragTimerRef.current = setTimeout(() => {
      if (isTrackingForDrag) {
        setIsSustainedClick(true);
        setIsDragging(true);
        setIsTrackingForDrag(false);
        
        // Disable text selection during drag
        document.body.style.userSelect = 'none';
        document.body.style.webkitUserSelect = 'none';
        
        onDragStart?.();
      }
    }, sustainedClickDelay);
  }, [edgeThreshold, sustainedClickDelay, isTrackingForDrag, onDragStart]);

  const handleDragMove = useCallback((mouseX: number, mouseY: number) => {
    if (!isDragging) return;

    const newPosition = {
      x: mouseX - dragOffset.x,
      y: mouseY - dragOffset.y
    };

    onPositionChange?.(newPosition);
  }, [isDragging, dragOffset, onPositionChange]);

  const handleDragEnd = useCallback(() => {
    cancelDragTimer();
    setIsDragging(false);
    setIsSustainedClick(false);
    setIsTrackingForDrag(false);
    
    // Re-enable text selection
    document.body.style.userSelect = '';
    document.body.style.webkitUserSelect = '';
    
    onDragEnd?.();
  }, [cancelDragTimer, onDragEnd]);

  return {
    // State values
    isDragging,
    isSustainedClick,
    isTrackingForDrag,
    dragOffset,
    
    // Event handlers
    handleTextareaMouseDown,
    handleDragMove,
    handleDragEnd,
    
    // Utilities
    cancelDragTimer
  };
}