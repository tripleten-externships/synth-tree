import type { Shadows } from "../types";

// Professional shadow system for financial advisor applications
// Subtle, sophisticated shadows that convey trust and professionalism
export const shadows: Shadows = {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  base: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
  inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
  none: "0 0 #0000",
};

// Semantic shadows for specific use cases
export const semanticShadows = {
  // Card elevations for different hierarchy levels
  card: {
    flat: shadows.none,
    subtle: shadows.sm,
    elevated: shadows.base,
    floating: shadows.md,
  },
  // Interactive element shadows
  interactive: {
    button: {
      default: shadows.sm,
      hover: shadows.md,
      active: shadows.inner,
      focus: "0 0 0 2px rgb(59 130 246 / 0.5)", // Primary color focus ring
    },
    input: {
      default: shadows.inner,
      focus: "0 0 0 2px rgb(59 130 246 / 0.5)", // Primary color focus ring
      error: "0 0 0 2px rgb(239 68 68 / 0.5)", // Error color focus ring
    },
  },
  // Modal and overlay shadows
  overlay: {
    dropdown: shadows.lg,
    modal: shadows["2xl"],
    popover: shadows.md,
    tooltip: shadows.base,
  },
  // Navigation and header shadows
  navigation: {
    header: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
    sidebar: "1px 0 3px 0 rgb(0 0 0 / 0.1)",
    tab: shadows.sm,
  },
  // Data visualization shadows
  chart: {
    container: shadows.base,
    tooltip: shadows.lg,
    legend: shadows.sm,
  },
};

// Color-aware shadows for different themes
export const colorShadows = {
  light: {
    // Standard shadows for light theme
    ...shadows,
    // Colored shadows for specific elements
    primary:
      "0 4px 6px -1px rgb(59 130 246 / 0.1), 0 2px 4px -2px rgb(59 130 246 / 0.1)",
    success:
      "0 4px 6px -1px rgb(16 185 129 / 0.1), 0 2px 4px -2px rgb(16 185 129 / 0.1)",
    warning:
      "0 4px 6px -1px rgb(245 158 11 / 0.1), 0 2px 4px -2px rgb(245 158 11 / 0.1)",
    error:
      "0 4px 6px -1px rgb(239 68 68 / 0.1), 0 2px 4px -2px rgb(239 68 68 / 0.1)",
  },
  dark: {
    // Adjusted shadows for dark theme with higher opacity
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.3)",
    base: "0 1px 3px 0 rgb(0 0 0 / 0.4), 0 1px 2px -1px rgb(0 0 0 / 0.4)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.4)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.4)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.4), 0 8px 10px -6px rgb(0 0 0 / 0.4)",
    "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.5)",
    inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.3)",
    none: "0 0 #0000",
    // Colored shadows for dark theme
    primary:
      "0 4px 6px -1px rgb(59 130 246 / 0.3), 0 2px 4px -2px rgb(59 130 246 / 0.3)",
    success:
      "0 4px 6px -1px rgb(16 185 129 / 0.3), 0 2px 4px -2px rgb(16 185 129 / 0.3)",
    warning:
      "0 4px 6px -1px rgb(245 158 11 / 0.3), 0 2px 4px -2px rgb(245 158 11 / 0.3)",
    error:
      "0 4px 6px -1px rgb(239 68 68 / 0.3), 0 2px 4px -2px rgb(239 68 68 / 0.3)",
  },
};

// Animation-ready shadow transitions
export const shadowTransitions = {
  // Smooth transitions for interactive elements
  default: "box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1)",
  fast: "box-shadow 100ms cubic-bezier(0.4, 0, 0.2, 1)",
  slow: "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1)",
};
