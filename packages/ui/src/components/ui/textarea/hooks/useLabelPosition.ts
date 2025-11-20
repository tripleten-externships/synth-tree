/**
 * Custom hook for managing dynamic label positioning around textarea
 * Handles label dragging, rotation, and distance control
 */

import { useState, useCallback, useRef, useMemo } from 'react';
import {
  calculateTransparentBlockDimensions,
  calculateLabelEdgePosition,
  calculateLabelTransformString,
  calculateAngleFromMousePosition,
  isLabelPositionOffScreen,
  calculateMaxSafeExpansion,
  type ScreenBoundaries,
  type LabelPosition
} from '../utils/positioning-calculations';

interface LabelDimensions {
  width: number;
  height: number;
}

interface UseLabelPositionOptions {
  textareaDimensions: { width: number; height: number };
  textareaContainerRef: React.RefObject<HTMLDivElement>;
  initialAngle?: number;
  initialExpansion?: number;
  minExpansion?: number;
  scrollWheelIncrement?: number;
  sustainedClickDelay?: number;
}

interface UseLabelPositionReturn {
  // State values
  labelPosition: LabelPosition;
  blockExpansion: number;
  isDraggingLabel: boolean;
  dragLabelDimensions: LabelDimensions | null;
  
  // Computed position data
  labelRelativePosition: { x: number; y: number; edge: string };
  labelTransformString: string;
  
  // Event handlers
  handleLabelMouseDown: (e: React.MouseEvent) => void;
  handleLabelDragMove: (mouseX: number, mouseY: number) => void;
  handleLabelDragEnd: () => void;
  handleScrollWheel: (e: WheelEvent) => void;
  
  // Control functions
  setLabelAngle: (angle: number) => void;
  setExpansionDistance: (distance: number) => void;
}

export function useLabelPosition({
  textareaDimensions,
  textareaContainerRef,
  initialAngle = 225,
  initialExpansion = 50,
  minExpansion = 5,
  scrollWheelIncrement = 15,
  sustainedClickDelay = 100
}: UseLabelPositionOptions): UseLabelPositionReturn {
  // Internal state
  const [labelPosition, setLabelPosition] = useState<LabelPosition>({
    angle: initialAngle,
    distance: initialExpansion
  });
  
  const [blockExpansion, setBlockExpansion] = useState(initialExpansion);
  const [isDraggingLabel, setIsDraggingLabel] = useState(false);
  const [dragLabelDimensions, setDragLabelDimensions] = useState<LabelDimensions | null>(null);
  
  // Refs for timer and drag data management
  const labelTimerRef = useRef<number | null>(null);
  const labelDragDataRef = useRef<any>(null);

  // Computed transparent block dimensions
  const transparentBlockDimensions = useMemo(() => 
    calculateTransparentBlockDimensions(textareaDimensions, blockExpansion),
    [textareaDimensions, blockExpansion]
  );

  // Computed label position on block edge
  const labelRelativePosition = useMemo(() => {
    const edgePosition = calculateLabelEdgePosition(labelPosition.angle, transparentBlockDimensions);
    return {
      x: edgePosition.x,
      y: edgePosition.y,
      edge: edgePosition.edge
    };
  }, [labelPosition.angle, transparentBlockDimensions]);

  // Computed transform string for CSS positioning
  const labelTransformString = useMemo(() => 
    calculateLabelTransformString(labelRelativePosition.edge as any),
    [labelRelativePosition.edge]
  );

  // Cleanup timer utility
  const cancelLabelTimer = useCallback(() => {
    if (labelTimerRef.current) {
      clearTimeout(labelTimerRef.current);
      labelTimerRef.current = null;
    }
  }, []);

  const handleLabelMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const target = e.currentTarget as HTMLElement;
    target.style.cursor = 'grabbing';
    
    // Calculate screen center for rotation calculations
    const containerRect = textareaContainerRef.current?.getBoundingClientRect();
    if (!containerRect) return;
    
    const screenCenterX = containerRect.left + textareaDimensions.width / 2;
    const screenCenterY = containerRect.top + textareaDimensions.height / 2;
    const startMouseAngle = calculateAngleFromMousePosition(
      e.clientX, 
      e.clientY, 
      screenCenterX, 
      screenCenterY
    );
    
    // Start drag timer
    labelTimerRef.current = setTimeout(() => {
      // Capture current label dimensions before starting drag
      const currentDimensions = {
        width: target.offsetWidth,
        height: target.offsetHeight
      };
      setDragLabelDimensions(currentDimensions);
      setIsDraggingLabel(true);
      
      // Disable text selection
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';
      
      // Store drag data
      labelDragDataRef.current = {
        startAngle: labelPosition.angle,
        startMouseAngle,
        centerX: screenCenterX,
        centerY: screenCenterY
      };
    }, sustainedClickDelay);
  }, [labelPosition.angle, textareaDimensions, textareaContainerRef, sustainedClickDelay]);

  const handleLabelDragMove = useCallback((mouseX: number, mouseY: number) => {
    if (!isDraggingLabel || !labelDragDataRef.current) return;

    const { startAngle, startMouseAngle, centerX, centerY } = labelDragDataRef.current;
    const currentMouseAngle = calculateAngleFromMousePosition(mouseX, mouseY, centerX, centerY);
    const angleDelta = currentMouseAngle - startMouseAngle;
    const newAngle = startAngle + angleDelta;
    
    setLabelPosition(prev => ({ ...prev, angle: newAngle }));
  }, [isDraggingLabel]);

  const handleLabelDragEnd = useCallback(() => {
    cancelLabelTimer();
    
    // Check for screen boundary snap-back
    if (isDraggingLabel) {
      const containerRect = textareaContainerRef.current?.getBoundingClientRect();
      if (containerRect) {
        const screenBoundaries: ScreenBoundaries = {
          width: window.innerWidth,
          height: window.innerHeight,
          marginThreshold: 50
        };
        
        const isOffScreen = isLabelPositionOffScreen(
          labelRelativePosition,
          containerRect,
          transparentBlockDimensions,
          screenBoundaries
        );
        
        if (isOffScreen) {
          const safeExpansion = calculateMaxSafeExpansion(
            containerRect,
            textareaDimensions,
            screenBoundaries,
            minExpansion
          );
          setBlockExpansion(safeExpansion);
        }
      }
    }
    
    setIsDraggingLabel(false);
    setDragLabelDimensions(null);
    labelDragDataRef.current = null;
    
    // Re-enable text selection
    document.body.style.userSelect = '';
    document.body.style.webkitUserSelect = '';
  }, [
    isDraggingLabel, 
    textareaContainerRef, 
    labelRelativePosition, 
    transparentBlockDimensions, 
    textareaDimensions, 
    minExpansion, 
    cancelLabelTimer
  ]);

  const handleScrollWheel = useCallback((e: WheelEvent) => {
    if (!isDraggingLabel) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const deltaExpansion = e.deltaY > 0 ? scrollWheelIncrement : -scrollWheelIncrement;
    
    setBlockExpansion(prev => {
      const newExpansion = Math.max(minExpansion, prev + deltaExpansion);
      return newExpansion;
    });
  }, [isDraggingLabel, scrollWheelIncrement, minExpansion]);

  const setLabelAngle = useCallback((angle: number) => {
    setLabelPosition(prev => ({ ...prev, angle }));
  }, []);

  const setExpansionDistance = useCallback((distance: number) => {
    setBlockExpansion(Math.max(minExpansion, distance));
  }, [minExpansion]);

  return {
    // State values
    labelPosition,
    blockExpansion,
    isDraggingLabel,
    dragLabelDimensions,
    
    // Computed position data
    labelRelativePosition,
    labelTransformString,
    
    // Event handlers
    handleLabelMouseDown,
    handleLabelDragMove,
    handleLabelDragEnd,
    handleScrollWheel,
    
    // Control functions
    setLabelAngle,
    setExpansionDistance
  };
}