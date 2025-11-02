import type { Breakpoints } from "../types";

// Professional responsive breakpoints for financial advisor applications
// Optimized for desktop-first financial dashboards with mobile support
export const breakpoints: Breakpoints = {
  sm: "640px", // Small devices (landscape phones)
  md: "768px", // Medium devices (tablets)
  lg: "1024px", // Large devices (laptops)
  xl: "1280px", // Extra large devices (desktops)
  "2xl": "1536px", // 2X large devices (large desktops)
};

// Semantic breakpoints for specific use cases
export const semanticBreakpoints = {
  // Device categories
  mobile: breakpoints.sm,
  tablet: breakpoints.md,
  laptop: breakpoints.lg,
  desktop: breakpoints.xl,
  widescreen: breakpoints["2xl"],

  // Content-specific breakpoints
  content: {
    narrow: "640px", // Single column content
    medium: "768px", // Two column content
    wide: "1024px", // Three column content
    full: "1280px", // Full dashboard layout
  },

  // Dashboard-specific breakpoints
  dashboard: {
    compact: "768px", // Compact dashboard (mobile/tablet)
    standard: "1024px", // Standard dashboard (laptop)
    expanded: "1280px", // Expanded dashboard (desktop)
    ultra: "1536px", // Ultra-wide dashboard
  },

  // Data table breakpoints
  table: {
    stack: "640px", // Stack table columns
    scroll: "768px", // Horizontal scroll
    full: "1024px", // Full table display
  },
};

// Container max-widths for different breakpoints
export const containerSizes = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",

  // Content containers
  content: {
    narrow: "640px",
    medium: "768px",
    wide: "1024px",
    full: "100%",
  },

  // Dashboard containers
  dashboard: {
    sidebar: "280px",
    main: "calc(100% - 280px)",
    fullWidth: "100%",
  },
};

// Media query helpers
export const mediaQueries = {
  // Min-width queries (mobile-first)
  up: {
    sm: `@media (min-width: ${breakpoints.sm})`,
    md: `@media (min-width: ${breakpoints.md})`,
    lg: `@media (min-width: ${breakpoints.lg})`,
    xl: `@media (min-width: ${breakpoints.xl})`,
    "2xl": `@media (min-width: ${breakpoints["2xl"]})`,
  },

  // Max-width queries (desktop-first)
  down: {
    sm: `@media (max-width: ${parseInt(breakpoints.sm) - 1}px)`,
    md: `@media (max-width: ${parseInt(breakpoints.md) - 1}px)`,
    lg: `@media (max-width: ${parseInt(breakpoints.lg) - 1}px)`,
    xl: `@media (max-width: ${parseInt(breakpoints.xl) - 1}px)`,
    "2xl": `@media (max-width: ${parseInt(breakpoints["2xl"]) - 1}px)`,
  },

  // Range queries (between breakpoints)
  between: {
    smMd: `@media (min-width: ${breakpoints.sm}) and (max-width: ${
      parseInt(breakpoints.md) - 1
    }px)`,
    mdLg: `@media (min-width: ${breakpoints.md}) and (max-width: ${
      parseInt(breakpoints.lg) - 1
    }px)`,
    lgXl: `@media (min-width: ${breakpoints.lg}) and (max-width: ${
      parseInt(breakpoints.xl) - 1
    }px)`,
    xl2xl: `@media (min-width: ${breakpoints.xl}) and (max-width: ${
      parseInt(breakpoints["2xl"]) - 1
    }px)`,
  },

  // Special queries
  mobile: `@media (max-width: ${parseInt(breakpoints.md) - 1}px)`,
  tablet: `@media (min-width: ${breakpoints.md}) and (max-width: ${
    parseInt(breakpoints.lg) - 1
  }px)`,
  desktop: `@media (min-width: ${breakpoints.lg})`,

  // Orientation queries
  landscape: "@media (orientation: landscape)",
  portrait: "@media (orientation: portrait)",

  // High DPI queries
  retina:
    "@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)",

  // Reduced motion
  reducedMotion: "@media (prefers-reduced-motion: reduce)",

  // Dark mode preference
  darkMode: "@media (prefers-color-scheme: dark)",
  lightMode: "@media (prefers-color-scheme: light)",
};

// Grid system breakpoints
export const gridBreakpoints = {
  // Number of columns at each breakpoint
  columns: {
    sm: 4, // 4 columns on small screens
    md: 8, // 8 columns on medium screens
    lg: 12, // 12 columns on large screens
    xl: 12, // 12 columns on extra large screens
    "2xl": 12, // 12 columns on 2xl screens
  },

  // Gutter sizes at each breakpoint
  gutters: {
    sm: "16px",
    md: "24px",
    lg: "32px",
    xl: "32px",
    "2xl": "40px",
  },
};
