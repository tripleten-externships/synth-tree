import * as React from "react";

/**
 * Hook for managing checkbox-specific CSS custom properties and styles
 *
 * WHAT: Generates CSS custom properties for dynamic checkbox styling based on dimensions and colors
 * HOW: Returns CSSProperties object with CSS custom properties for width, height, and color values
 * WHY: Enables dynamic theming without CSS-in-JS overhead. CSS custom properties allow runtime
 *      style updates. Memoized for performance. Hook vs inline: Reusable, testable, and performant.
 *      Alternative: Inline styles would cause unnecessary re-renders and be harder to maintain.
 */
export function useCheckboxStyles({
  width,
  height,
  checkedColor,
  uncheckedColor,
  borderColor,
}: {
  width: number;
  height: number;
  checkedColor: string;
  uncheckedColor: string;
  borderColor: string;
}) {
  // WHAT: Memoize style object to prevent unnecessary re-renders
  // HOW: Recalculates only when dependencies change
  // WHY: Performance optimization - prevents style recalculation on every render
  return React.useMemo(() => ({
    // WHAT: CSS custom properties for dynamic sizing
    // WHY: Allows CSS to reference dynamic values without inline styles
    '--checkbox-width': `${width}px`,
    '--checkbox-height': `${height}px`,
    // WHAT: CSS custom properties for color theming
    // WHY: Enables theme switching and color customization through CSS variables
    '--unchecked-bg': uncheckedColor,
    '--checked-bg': checkedColor,
    '--border-color': borderColor,
    // WHAT: Fallback border color for browsers that don't support CSS custom properties
    // WHY: Ensures styling works in older browsers as graceful degradation
    borderColor: 'var(--border-color)',
  } as React.CSSProperties), [width, height, checkedColor, uncheckedColor, borderColor]);
}

/**
 * Hook for managing switch-specific CSS custom properties and styles
 *
 * WHAT: Generates CSS custom properties for dynamic switch styling based on dimensions and colors
 * HOW: Returns CSSProperties object with CSS custom properties for width, height, and color values
 * WHY: Same benefits as useCheckboxStyles but for switch component. Consistent API across components.
 *      Enables smooth animations and theming through CSS custom properties.
 */
export function useSwitchStyles({
  width,
  height,
  checkedColor,
  uncheckedColor,
  borderColor,
}: {
  width: number;
  height: number;
  checkedColor: string;
  uncheckedColor: string;
  borderColor: string;
}) {
  // WHAT: Memoize style object to prevent unnecessary re-renders
  // HOW: Recalculates only when dependencies change
  // WHY: Performance optimization - prevents style recalculation on every render
  return React.useMemo(() => ({
    // WHAT: CSS custom properties for dynamic sizing
    // WHY: Allows CSS to reference dynamic values without inline styles
    '--switch-width': `${width}px`,
    '--switch-height': `${height}px`,
    // WHAT: CSS custom properties for color theming
    // WHY: Enables theme switching and color customization through CSS variables
    '--unchecked-bg': uncheckedColor,
    '--checked-bg': checkedColor,
    '--border-color': borderColor,
    borderColor: 'var(--border-color)',
  } as React.CSSProperties), [width, height, checkedColor, uncheckedColor, borderColor]);
}

/**
 * Hook for managing checkmark icon styles within checkboxes
 *
 * WHAT: Generates styles for the checkmark icon with dynamic color and sizing
 * HOW: Returns CSS custom properties for color and fontSize for icon styling
 * WHY: Allows checkmark to scale with component size and match theme colors.
 *      Separated from main styles for better organization and reusability.
 */
export function useCheckmarkStyles({
  checkmarkColor,
  fontSize,
}: {
  checkmarkColor: string;
  fontSize: number;
}) {
  return React.useMemo(() => ({
    // WHAT: CSS custom property for checkmark color theming
    // WHY: Allows theme-based color changes without component re-renders
    '--checkmark-color': checkmarkColor,
    // WHAT: Direct fontSize for icon scaling
    // WHY: Icons need explicit sizing, not CSS custom properties for better browser support
    fontSize: `${fontSize}px`,
  } as React.CSSProperties), [checkmarkColor, fontSize]);
}

/**
 * Hook for managing switch thumb (toggle button) styles
 *
 * WHAT: Generates styles for the movable thumb element in switch components
 * HOW: Returns CSS custom properties for size and color theming of the thumb
 * WHY: Thumb needs separate styling from track for smooth animations and visual feedback.
 *      Size affects both appearance and interaction area. Colors indicate state.
 */
export function useThumbStyles({
  thumbSize,
  checkedThumbColor,
  uncheckedThumbColor,
}: {
  thumbSize: number;
  checkedThumbColor: string;
  uncheckedThumbColor: string;
}) {
  return React.useMemo(() => ({
    // WHAT: CSS custom property for thumb size
    // WHY: Allows dynamic sizing based on switch dimensions
    '--thumb-size': `${thumbSize}px`,
    // WHAT: CSS custom properties for thumb color theming
    // WHY: Enables state-based color changes (checked vs unchecked) through CSS variables
    '--unchecked-thumb-bg': uncheckedThumbColor,
    '--checked-thumb-bg': checkedThumbColor,
  } as React.CSSProperties), [thumbSize, checkedThumbColor, uncheckedThumbColor]);
}