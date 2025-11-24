import * as React from "react";

/**
 * Size mapping interface for component dimensions
 * Provides type-safe size configurations for different component variants
 * Maps size keys (sm, md, lg) to dimension objects with width, height, and optional icon/thumb sizes
 */
export interface SizeMappings {
  [key: string]: {
    width: number;
    height: number;
    iconSize?: number;
    thumbSize?: number;
  };
}

/**
 * Options for the useDimensions hook
 * Allows flexible dimension calculation with base mappings and runtime overrides
 */
export interface UseDimensionsOptions {
  sizeMappings: SizeMappings;
  size: string;
  width?: number;
  height?: number;
  iconSize?: number;
  thumbSize?: number;
  widthOffset?: number;
  heightOffset?: number;
  iconSizeOffset?: number;
  thumbSizeOffset?: number;
}

/**
 * Result interface for calculated dimensions
 * Provides consistent return type for all dimension calculations
 */
export interface DimensionResult {
  width: number;
  height: number;
  iconSize: number;
  thumbSize: number;
}

/**
 * Custom hook for calculating component dimensions with size mappings and offsets
 *
 * Calculates final dimensions by combining size mappings with runtime overrides and offsets
 * Looks up base dimensions from sizeMappings, applies prop overrides, then adds offsets
 * Enables consistent sizing across components while allowing customization. Size mappings
 *      ensure design system consistency. Offsets allow for padding/margin adjustments.
 *      Hook vs inline: Reusable across Checkbox/Switch components, testable in isolation.
 *      Alternative: Inline calculations would duplicate logic and be harder to maintain.
 */
export function useDimensions({
  sizeMappings,
  size,
  width,
  height,
  iconSize,
  thumbSize,
  widthOffset = 0,
  heightOffset = 0,
  iconSizeOffset = 0,
  thumbSizeOffset = 0,
}: UseDimensionsOptions): DimensionResult {
  // Get base dimensions from size mapping
  // Ensures consistent sizing based on design system size variants
  const dimensions = sizeMappings[size];

  // Calculate final dimensions with overrides and offsets
  // Prop overrides take precedence over mappings, then offsets are applied
  // Allows runtime customization while maintaining base design consistency.
  //      Order: base mapping → prop override → offset addition. Fallbacks (?? 0) prevent NaN.
  return {
    width: (width ?? dimensions.width) + widthOffset,
    height: (height ?? dimensions.height) + heightOffset,
    iconSize: (iconSize ?? dimensions.iconSize ?? 0) + iconSizeOffset,
    thumbSize: (thumbSize ?? dimensions.thumbSize ?? 0) + thumbSizeOffset,
  };
}
