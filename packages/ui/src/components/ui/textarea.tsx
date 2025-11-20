import * as React from "react";
import { cn } from "@/utils";
type ResizeDirection = 'north' | 'east' | 'south' | 'west' | 'northeast' | 'northwest' | 'southeast' | 'southwest';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Label text displayed above the textarea */
  label?: string;
  /** Title text displayed in the header section */
  title?: string;
  /** Initial width in pixels */
  initialWidth?: number;
  /** Initial height in pixels */
  initialHeight?: number;
  /** Minimum width constraint */
  minWidth?: number;
  /** Minimum height constraint */
  minHeight?: number;
  /** Maximum width constraint */
  maxWidth?: number;
  /** Maximum height constraint */
  maxHeight?: number;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({
    className,
    label = "Label",
    title = "Title",
    initialWidth = 400,
    initialHeight = 200,
    minWidth = 200,
    minHeight = 120,
    maxWidth = 800,
    maxHeight = 600,
    id,
    onFocus,
    onBlur,
    ...props
  }, ref) => {
    const [textareaDimensions, setTextareaDimensions] = React.useState({
      width: initialWidth,
      height: initialHeight,
    });
    const [textareaPosition, setTextareaPosition] = React.useState({
      x: 100,
      y: 100,
    });
    const [isResizingActive, setIsResizingActive] = React.useState(false);
    const [isDraggingActive, setIsDraggingActive] = React.useState(false);
    const [dragStartPosition, setDragStartPosition] = React.useState({ x: 0, y: 0 });
    const [dragStartTime, setDragStartTime] = React.useState(0);
    const [isSustainedClick, setIsSustainedClick] = React.useState(false);
    const [dragOffset, setDragOffset] = React.useState({ x: 0, y: 0 });
    const [isTrackingForDrag, setIsTrackingForDrag] = React.useState(false);
    const [labelPosition, setLabelPosition] = React.useState({ angle: 225, distance: 50 });
    const [blockExpansion, setBlockExpansion] = React.useState(50);
    const [isDraggingLabel, setIsDraggingLabel] = React.useState(false);
    const [dragLabelDimensions, setDragLabelDimensions] = React.useState<{ width: number; height: number } | null>(null);
    const [currentResizeDirection, setCurrentResizeDirection] = React.useState<ResizeDirection | null>(null);
    const [hoveredResizeEdge, setHoveredResizeEdge] = React.useState<string[]>([]);
    const [isTextareaFocused, setIsTextareaFocused] = React.useState(false);
    const [initialResizeBounds, setInitialResizeBounds] = React.useState<DOMRect | null>(null);
    const textareaContainerRef = React.useRef<HTMLDivElement>(null);
    
    // Refs to access current state in event handlers
    const textareaDimensionsRef = React.useRef(textareaDimensions);
    const textareaPositionRef = React.useRef(textareaPosition);
    const currentResizeDirectionRef = React.useRef(currentResizeDirection);
    const initialResizeBoundsRef = React.useRef(initialResizeBounds);
    
    // Update refs when state changes
    React.useEffect(() => {
      textareaDimensionsRef.current = textareaDimensions;
    }, [textareaDimensions]);
    
    React.useEffect(() => {
      textareaPositionRef.current = textareaPosition;
    }, [textareaPosition]);
    
    React.useEffect(() => {
      currentResizeDirectionRef.current = currentResizeDirection;
    }, [currentResizeDirection]);
    
    React.useEffect(() => {
      initialResizeBoundsRef.current = initialResizeBounds;
    }, [initialResizeBounds]);

    // ...existing code...

    const handleResizeStart = React.useCallback((e: React.MouseEvent, direction: ResizeDirection) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Capture INITIAL container bounds when resize starts
      if (textareaContainerRef.current) {
        const initialBounds = textareaContainerRef.current.getBoundingClientRect();
        setInitialResizeBounds(initialBounds);
        initialResizeBoundsRef.current = initialBounds;
      }
      
      setIsResizingActive(true);
      setCurrentResizeDirection(direction);
      currentResizeDirectionRef.current = direction;
      
      // Add mouse event listeners immediately when resize starts
      const handleMouseMove = (moveEvent: MouseEvent) => {
        if (!textareaContainerRef.current || !initialResizeBoundsRef.current) return;
        
        const currentDirection = currentResizeDirectionRef.current;
        if (!currentDirection) return;
        
        const containerBounds = initialResizeBoundsRef.current; // Use FIXED bounds
        const currentDimensions = textareaDimensionsRef.current;
        const currentPosition = textareaPositionRef.current;
        
        let newWidth = currentDimensions.width;
        let newHeight = currentDimensions.height;
        let newX = currentPosition.x;
        let newY = currentPosition.y;
        
        // Handle horizontal resize directions - Fixed east edge approach
        if (currentDirection.includes('east')) {
          // East resize: keep position same, just change width (similar approach to west but simpler)
          // Get parent container bounds to convert coordinates properly
          const container = textareaContainerRef.current;
          const parentElement = container?.parentElement;
          if (!parentElement) return;
          
          const parentRect = parentElement.getBoundingClientRect();
          
          // Convert mouse position to parent-relative coordinates
          const mouseRelativeToParent = moveEvent.clientX - parentRect.left;
          
          // Calculate new width: distance from current left edge to mouse (in parent coordinates)
          const proposedWidth = Math.max(minWidth, Math.min(maxWidth, mouseRelativeToParent - currentPosition.x));
          newWidth = proposedWidth;
          // Don't change newX for east resize - keep position fixed
          
        }
        if (currentDirection.includes('west')) {
          // West resize: Calculate width based on mouse position to maintain east edge
          // Get parent container bounds to convert coordinates properly
          const container = textareaContainerRef.current;
          const parentElement = container?.parentElement;
          if (!parentElement) return;
          
          const parentRect = parentElement.getBoundingClientRect();
          
          // Convert mouse position to parent-relative coordinates  
          const mouseRelativeToParent = moveEvent.clientX - parentRect.left;
          
          // Calculate current east edge in parent-relative coordinates
          const currentEastEdgeRelativeToParent = currentPosition.x + currentDimensions.width;
          
          // Calculate new width: distance from mouse to current east edge (in parent coordinates)
          const proposedWidth = Math.max(minWidth, Math.min(maxWidth, currentEastEdgeRelativeToParent - mouseRelativeToParent));
          const actualWidthChange = proposedWidth - currentDimensions.width;
          newWidth = proposedWidth;
          newX = currentPosition.x - actualWidthChange;
          
        }
        
        // Handle vertical resize directions
        if (currentDirection.includes('south')) {
          newHeight = Math.max(minHeight, Math.min(maxHeight, moveEvent.clientY - containerBounds.top));
        }
        if (currentDirection.includes('north')) {
          const proposedHeight = Math.max(minHeight, Math.min(maxHeight, containerBounds.bottom - moveEvent.clientY));
          const heightDiff = proposedHeight - newHeight;
          newHeight = proposedHeight;
          newY = currentPosition.y - heightDiff;
        }
        
        setTextareaDimensions({ width: newWidth, height: newHeight });
        setTextareaPosition({ x: newX, y: newY });
        
      };
      
      const handleMouseUp = () => {
        setIsResizingActive(false);
        setCurrentResizeDirection(null);
        setInitialResizeBounds(null);
        currentResizeDirectionRef.current = null;
        initialResizeBoundsRef.current = null;
        
        // Remove event listeners
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      
      // Add event listeners to document
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }, [minWidth, maxWidth, minHeight, maxHeight]);

    const handleTextareaMouseDown = React.useCallback((e: React.MouseEvent) => {
      
      // Check if there's already selected text - if so, don't activate drag
      const textarea = e.currentTarget as HTMLTextAreaElement;
      const hasSelection = textarea.selectionStart !== textarea.selectionEnd;
      
      if (hasSelection) {
        return; // Let normal text selection behavior continue
      }
      
      // Only handle if not clicking on resize edges (4px from border)
      const rect = e.currentTarget.getBoundingClientRect();
      const edgeThreshold = 4;
      const isNearEdge = (
        e.clientX - rect.left < edgeThreshold ||
        rect.right - e.clientX < edgeThreshold ||
        e.clientY - rect.top < edgeThreshold ||
        rect.bottom - e.clientY < edgeThreshold
      );
      
      if (isNearEdge) {
        return; // Let resize handle this
      }
      
      const startTime = Date.now();
      const startPosition = { x: e.clientX, y: e.clientY };
      
      // With transform-based positioning, we need to get the actual visual position
      const containerRect = textareaContainerRef.current?.getBoundingClientRect();
      
      if (containerRect) {
        // Calculate offset from click point to the visual position of the container
        const offsetX = e.clientX - containerRect.left;
        const offsetY = e.clientY - containerRect.top;
        
        setDragOffset({ x: offsetX, y: offsetY });
        
      }
      
      setDragStartTime(startTime);
      setDragStartPosition(startPosition);
      setIsTrackingForDrag(true);
      
      // Start immediate tracking with delayed activation
      const dragTimer = setTimeout(() => {
        // Check if we're still tracking (not cancelled by movement or mouse up)
        setIsSustainedClick(true);
        setIsDraggingActive(true);
        // Disable text selection when drag starts
        document.body.style.userSelect = 'none';
        document.body.style.webkitUserSelect = 'none';
        setIsTrackingForDrag(false);
      }, 150); // 150ms delay for activation
      
      // Store timer to clear if mouse up happens quickly or movement detected
      (e.currentTarget as any).__dragTimer = dragTimer;
    }, []);

    const handleTextareaFocus = React.useCallback((e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsTextareaFocused(true);
      onFocus?.(e);
    }, [onFocus]);

    const handleTextareaBlur = React.useCallback((e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsTextareaFocused(false);
      onBlur?.(e);
    }, [onBlur]);

    const handleLabelMouseDown = React.useCallback((e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      
      // Only change cursor, no colors
      const target = e.currentTarget as HTMLElement;
      target.style.cursor = 'grabbing';
      
      const startAngle = labelPosition.angle;
      
      // Calculate center in screen coordinates for proper rotation
      const containerRect = textareaContainerRef.current?.getBoundingClientRect();
      if (!containerRect) {
        return;
      }
      
      const screenCenterX = containerRect.left + textareaDimensions.width / 2;
      const screenCenterY = containerRect.top + textareaDimensions.height / 2;
      const startMouseAngle = Math.atan2(e.clientY - screenCenterY, e.clientX - screenCenterX) * 180 / Math.PI;
      
      
      const labelTimer = setTimeout(() => {
        
        // Capture current label dimensions before starting drag
        const labelElement = target as HTMLElement;
        const currentDimensions = {
          width: labelElement.offsetWidth,
          height: labelElement.offsetHeight
        };
        setDragLabelDimensions(currentDimensions);
        
        setIsDraggingLabel(true);
        document.body.style.userSelect = 'none';
        document.body.style.webkitUserSelect = 'none';
        
        
        // Store initial values for rotation calculation using screen coordinates
        (document as any).__labelDragData = {
          startAngle,
          startMouseAngle,
          centerX: screenCenterX,
          centerY: screenCenterY
        };
      }, 100);
      
      (e.currentTarget as any).__labelTimer = labelTimer;
    }, [labelPosition.angle, textareaContainerRef, textareaDimensions]);

    const getLabelRelativePosition = React.useCallback(() => {
      // Create expanded block dimensions
      const blockWidth = textareaDimensions.width + (blockExpansion * 2);
      const blockHeight = textareaDimensions.height + (blockExpansion * 2);
      
      // Block is centered on textarea, so calculate offset
      const blockLeft = -blockExpansion;
      const blockTop = -blockExpansion;
      
      // Convert angle to position on block perimeter
      const normalizedAngle = ((labelPosition.angle % 360) + 360) % 360;
      let finalX, finalY;
      
      // Determine which edge of the block the label should be on with edge-to-edge pinning
      if (normalizedAngle >= 315 || normalizedAngle < 45) {
        // Right edge of block - label's west edge pinned to block's east edge
        finalX = blockLeft + blockWidth; // No offset needed since label edge aligns with block edge
        const progress = normalizedAngle < 45 ? normalizedAngle / 45 : (normalizedAngle - 315) / 45;
        finalY = blockTop + (progress * blockHeight);
      } else if (normalizedAngle >= 45 && normalizedAngle < 135) {
        // Bottom edge of block - label's north edge pinned to block's south edge
        finalY = blockTop + blockHeight; // No offset needed
        const progress = (normalizedAngle - 45) / 90;
        finalX = blockLeft + blockWidth - (progress * blockWidth);
      } else if (normalizedAngle >= 135 && normalizedAngle < 225) {
        // Left edge of block - label's east edge pinned to block's west edge
        finalX = blockLeft; // No offset needed
        const progress = (normalizedAngle - 135) / 90;
        finalY = blockTop + blockHeight - (progress * blockHeight);
      } else {
        // Top edge of block - label's south edge pinned to block's north edge
        finalY = blockTop; // No offset needed
        const progress = (normalizedAngle - 225) / 90;
        finalX = blockLeft + (progress * blockWidth);
      }
      
      
      return {
        x: finalX,
        y: finalY,
        blockExpansion
      };
    }, [textareaDimensions, labelPosition, blockExpansion]);

    React.useEffect(() => {
      // Only handle drag and label drag in this effect now
      if (!isDraggingActive && !isTrackingForDrag && !isDraggingLabel) return;

      const handleMouseMove = (e: MouseEvent) => {
        if (!textareaContainerRef.current) return;

        if (isDraggingActive && isSustainedClick) {
          // Handle active drag - calculate new transform position
          const parentRect = textareaContainerRef.current?.parentElement?.getBoundingClientRect();
          
          let newPosition;
          if (parentRect) {
            // Calculate position relative to parent container
            newPosition = {
              x: e.clientX - parentRect.left - dragOffset.x,
              y: e.clientY - parentRect.top - dragOffset.y,
            };
          } else {
            // Fallback to screen coordinates
            newPosition = {
              x: e.clientX - dragOffset.x,
              y: e.clientY - dragOffset.y,
            };
          }
          
          
          setTextareaPosition(newPosition);
        } else if (isTrackingForDrag) {
          // Check for movement during tracking period
          const moveDistance = Math.sqrt(
            Math.pow(e.clientX - dragStartPosition.x, 2) + 
            Math.pow(e.clientY - dragStartPosition.y, 2)
          );
          
          // If user moves mouse while tracking, cancel drag intent (they're selecting text)
          if (moveDistance > 5) {
            setIsTrackingForDrag(false);
            // Clear the drag timer since user is clearly selecting text
            const textareaElements = document.querySelectorAll('textarea');
            textareaElements.forEach(textarea => {
              const timer = (textarea as any).__dragTimer;
              if (timer) {
                clearTimeout(timer);
                (textarea as any).__dragTimer = null;
              }
            });
          }
        } else if (isDraggingLabel) {
          // Handle label rotation around textarea perimeter
          const dragData = (document as any).__labelDragData;
          if (dragData) {
            // Use the stored visual center coordinates
            const currentMouseAngle = Math.atan2(e.clientY - dragData.centerY, e.clientX - dragData.centerX) * 180 / Math.PI;
            const angleDiff = currentMouseAngle - dragData.startMouseAngle;
            let newAngle = (dragData.startAngle + angleDiff) % 360;
            if (newAngle < 0) newAngle += 360;
            
            
            setLabelPosition(prev => ({ ...prev, angle: newAngle }));
          } else {
          }
        }
      };

      const handleWheel = (e: WheelEvent) => {
        if (isDraggingLabel) {
          e.preventDefault();
          e.stopPropagation();
          
          const deltaExpansion = e.deltaY > 0 ? 15 : -15; // 15px increments
          
          setBlockExpansion(prev => {
            const minExpansion = 5; // Minimal distance since edges are pinned
            const newExpansion = Math.max(minExpansion, prev + deltaExpansion);
            
            
            return newExpansion;
          });
        }
      };

      const handleMouseUp = () => {
        setIsResizingActive(false);
        setIsDraggingActive(false);
        setIsSustainedClick(false);
        setIsTrackingForDrag(false);
        setIsDraggingLabel(false);
        setDragLabelDimensions(null);
        setCurrentResizeDirection(null);
        
        // Re-enable text selection
        document.body.style.userSelect = '';
        document.body.style.webkitUserSelect = '';
        
        // Clear any pending timers
        const textareaElements = document.querySelectorAll('textarea');
        textareaElements.forEach(textarea => {
          const timer = (textarea as any).__dragTimer;
          if (timer) {
            clearTimeout(timer);
            (textarea as any).__dragTimer = null;
          }
        });
        
        const labelElements = document.querySelectorAll('[data-label-draggable]');
        labelElements.forEach(label => {
          const timer = (label as any).__labelTimer;
          if (timer) {
            clearTimeout(timer);
            (label as any).__labelTimer = null;
          }
        });
        
        // Clean up label drag data
        delete (document as any).__labelDragData;
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('wheel', handleWheel, { passive: false });

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('wheel', handleWheel);
      };
    }, [isResizingActive, isDraggingActive, isTrackingForDrag, isDraggingLabel, currentResizeDirection, textareaDimensions, minWidth, maxWidth, minHeight, maxHeight, dragOffset, dragStartPosition, textareaPosition]);

    // ...existing code...

    const labelRelativePos = getLabelRelativePosition();

    return (
      <div className="textarea-field w-full relative">
        {/* Resizable Textarea Container */}
        <div
          ref={textareaContainerRef}
          className={cn(
            "textarea-field__resizable-container absolute inline-block",
            isResizingActive && "textarea-field__resizable-container--resizing select-none",
            isDraggingActive && "textarea-field__resizable-container--dragging select-none"
          )}
          style={{
            width: textareaDimensions.width,
            height: textareaDimensions.height,
            left: `${textareaPosition.x}px`,
            top: `${textareaPosition.y}px`
          }}
          onMouseLeave={() => setHoveredResizeEdge([])}
        >
          {/* ...existing code... */}
          
          {/* Combined detection area and visual label */}
          <div
            className={cn(
              "absolute px-2 py-1 font-sans font-medium text-3xl rounded select-none cursor-pointer z-50",
              isDraggingLabel && "cursor-grabbing transition-none"
            )}
            style={{
              left: `${labelRelativePos.x}px`,
              top: `${labelRelativePos.y}px`,
              transform: (() => {
                const normalizedAngle = ((labelPosition.angle % 360) + 360) % 360;
                if (normalizedAngle >= 315 || normalizedAngle < 45) {
                  return 'translateY(-50%)';
                } else if (normalizedAngle >= 45 && normalizedAngle < 135) {
                  return 'translateX(-50%)';
                } else if (normalizedAngle >= 135 && normalizedAngle < 225) {
                  return 'translate(-100%, -50%)';
                } else {
                  return 'translate(-50%, -100%)';
                }
              })(),
              ...(isDraggingLabel && dragLabelDimensions ? {
                width: `${dragLabelDimensions.width}px`,
                height: `${dragLabelDimensions.height}px`,
                minWidth: `${dragLabelDimensions.width}px`,
                maxWidth: `${dragLabelDimensions.width}px`,
                minHeight: `${dragLabelDimensions.height}px`,
                maxHeight: `${dragLabelDimensions.height}px`,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              } : {
                minWidth: '60px',
                whiteSpace: 'nowrap'
              }),
              boxSizing: 'border-box',
              flexShrink: '0',
              flexGrow: '0'
            }}
            onMouseDown={handleLabelMouseDown}
            data-label-draggable
            title={`Click and hold to drag label around textarea`}
          >
            {label} (drag me)
          </div>
          
          {/* Header Section */}
          <div 
            className="textarea-field__header absolute top-0 left-0 right-0 px-3 py-2 font-sans font-semibold text-xl z-10 cursor-default"
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            onMouseDown={(e) => {
              e.preventDefault();
            }}
          >
            <span className="textarea-field__title select-none pointer-events-none">{title}</span>
          </div>

          {/* Input Element */}
          <textarea
            {...props}
            ref={ref}
            id={id}
            className={cn(
              "textarea-field__input w-full h-full bg-background text-foreground rounded-md px-3 py-2 pt-12",
              "font-sans font-normal text-lg",
              "placeholder:text-muted-foreground resize-none",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            style={{
              cursor: isSustainedClick ? 'grabbing' : 'text',
              userSelect: isSustainedClick ? 'none' : 'text'
            }}
            onMouseDown={handleTextareaMouseDown}
            onFocus={() => setIsTextareaFocused(true)}
            onBlur={() => setIsTextareaFocused(false)}
          />

          {/* Resize Handles - Edge Detectors */}
          <div
            className={cn(
              "textarea-field__resize-edge textarea-field__resize-edge--north absolute inset-x-0 top-0 h-1 cursor-n-resize z-20",
              hoveredResizeEdge.indexOf('north') !== -1 && !isTextareaFocused && "textarea-field__resize-edge--hovered border-t-2 border-ring"
            )}
            style={hoveredResizeEdge.indexOf('north') !== -1 && !isTextareaFocused ? {
              top: '2px',
              left: '2px',
              right: '2px'
            } : {}}
            onMouseEnter={() => setHoveredResizeEdge(['north'])}
            onMouseDown={(e) => {
              console.log('ORIGINAL: North edge clicked');
              e.stopPropagation();
              handleResizeStart(e, 'north');
            }}
          />
          
          <div
            className={cn(
              "textarea-field__resize-edge textarea-field__resize-edge--east resize-handle-east absolute inset-y-0 right-0 w-1 cursor-e-resize z-20",
              hoveredResizeEdge.indexOf('east') !== -1 && !isTextareaFocused && "textarea-field__resize-edge--hovered border-r-2 border-ring"
            )}
            style={hoveredResizeEdge.indexOf('east') !== -1 && !isTextareaFocused ? {
              top: '2px',
              right: '2px',
              bottom: '2px'
            } : {}}
            onMouseEnter={() => setHoveredResizeEdge(['east'])}
            onMouseDown={(e) => {
              console.log('ABSOLUTE: East edge clicked - will fix LEFT edge');
              e.stopPropagation();
              handleResizeStart(e, 'east');
            }}
          />
          
          <div
            className={cn(
              "textarea-field__resize-edge textarea-field__resize-edge--south absolute inset-x-0 bottom-0 h-1 cursor-s-resize z-20",
              hoveredResizeEdge.indexOf('south') !== -1 && !isTextareaFocused && "textarea-field__resize-edge--hovered border-b-2 border-ring"
            )}
            style={hoveredResizeEdge.indexOf('south') !== -1 && !isTextareaFocused ? {
              bottom: '2px',
              left: '2px',
              right: '2px'
            } : {}}
            onMouseEnter={() => setHoveredResizeEdge(['south'])}
            onMouseDown={(e) => {
              console.log('ORIGINAL: South edge clicked');
              e.stopPropagation();
              handleResizeStart(e, 'south');
            }}
          />
          
          <div
            className={cn(
              "textarea-field__resize-edge textarea-field__resize-edge--west resize-handle-west absolute inset-y-0 left-0 w-1 cursor-w-resize z-20",
              hoveredResizeEdge.indexOf('west') !== -1 && !isTextareaFocused && "textarea-field__resize-edge--hovered border-l-2 border-ring"
            )}
            style={hoveredResizeEdge.indexOf('west') !== -1 && !isTextareaFocused ? {
              top: '2px',
              left: '2px',
              bottom: '2px'
            } : {}}
            onMouseEnter={() => setHoveredResizeEdge(['west'])}
            onMouseDown={(e) => {
              console.log('ABSOLUTE: West edge clicked - will fix RIGHT edge');
              e.stopPropagation();
              handleResizeStart(e, 'west');
            }}
          />

          {/* Corner Resize Handles */}
          <div
            className="textarea-field__resize-corner textarea-field__resize-corner--northwest absolute top-0 left-0 w-2 h-2 cursor-nw-resize z-20"
            onMouseEnter={() => setHoveredResizeEdge(['north', 'west'])}
            onMouseDown={(e) => {
              console.log('ORIGINAL: Northwest corner clicked');
              e.stopPropagation();
              handleResizeStart(e, 'northwest');
            }}
          />
          <div
            className="textarea-field__resize-corner textarea-field__resize-corner--northeast absolute top-0 right-0 w-2 h-2 cursor-ne-resize z-20"
            onMouseEnter={() => setHoveredResizeEdge(['north', 'east'])}
            onMouseDown={(e) => {
              console.log('ORIGINAL: Northeast corner clicked');
              e.stopPropagation();
              handleResizeStart(e, 'northeast');
            }}
          />
          <div
            className="textarea-field__resize-corner textarea-field__resize-corner--southwest absolute bottom-0 left-0 w-2 h-2 cursor-sw-resize z-20"
            onMouseEnter={() => setHoveredResizeEdge(['south', 'west'])}
            onMouseDown={(e) => {
              console.log('ORIGINAL: Southwest corner clicked');
              e.stopPropagation();
              handleResizeStart(e, 'southwest');
            }}
          />
          <div
            className="textarea-field__resize-corner textarea-field__resize-corner--southeast absolute bottom-0 right-0 w-2 h-2 cursor-se-resize z-20"
            onMouseEnter={() => setHoveredResizeEdge(['south', 'east'])}
            onMouseDown={(e) => {
              console.log('ORIGINAL: Southeast corner clicked');
              e.stopPropagation();
              handleResizeStart(e, 'southeast');
            }}
          />
        </div>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };