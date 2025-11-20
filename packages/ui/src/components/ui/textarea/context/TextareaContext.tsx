/**
 * Context for sharing textarea state between components
 * Enables efficient communication between textarea, label, and resize handles
 */

import React, { createContext, useContext } from "react";
import type { ResizeDirection } from "../utils/resize-calculations";

interface TextareaContextValue {
  // Dimensions and positioning
  dimensions: { width: number; height: number };
  position: { x: number; y: number };

  // Interaction states
  isResizing: boolean;
  isDragging: boolean;
  isDraggingLabel: boolean;
  isTextareaFocused: boolean;

  // Resize state
  currentResizeDirection: ResizeDirection | null;
  hoveredResizeEdges: string[];

  // Label state
  labelPosition: { angle: number; distance: number };
  blockExpansion: number;

  // Event handlers
  onResizeStart: (direction: ResizeDirection) => void;
  onResizeEdgeHover: (edges: string[]) => void;
  onTextareaFocus: (focused: boolean) => void;

  // Refs
  textareaContainerRef: React.RefObject<HTMLDivElement>;
}

const TextareaContext = createContext<TextareaContextValue | null>(null);

export interface TextareaProviderProps {
  value: TextareaContextValue;
  children: React.ReactNode;
}

export const TextareaProvider: React.FC<TextareaProviderProps> = ({
  value,
  children,
}) => {
  return (
    <TextareaContext.Provider value={value}>
      {children}
    </TextareaContext.Provider>
  );
};

export function useTextareaContext(): TextareaContextValue {
  const context = useContext(TextareaContext);

  if (!context) {
    throw new Error(
      "useTextareaContext must be used within a TextareaProvider"
    );
  }

  return context;
}
