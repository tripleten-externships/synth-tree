import type { Typography } from "../types";

// Professional typography for financial advisor applications
// Inter font for excellent readability and modern appearance
export const typography: Typography = {
  fontFamily: {
    sans: [
      "Inter",
      "ui-sans-serif",
      "system-ui",
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Roboto",
      "Helvetica Neue",
      "Arial",
      "Noto Sans",
      "sans-serif",
      "Apple Color Emoji",
      "Segoe UI Emoji",
      "Segoe UI Symbol",
      "Noto Color Emoji",
    ],
    mono: [
      "JetBrains Mono",
      "ui-monospace",
      "SFMono-Regular",
      "Monaco",
      "Consolas",
      "Liberation Mono",
      "Courier New",
      "monospace",
    ],
  },
  fontSize: {
    xs: ["0.75rem", { lineHeight: "1rem" }],
    sm: ["0.875rem", { lineHeight: "1.25rem" }],
    base: ["1rem", { lineHeight: "1.5rem" }],
    lg: ["1.125rem", { lineHeight: "1.75rem" }],
    xl: ["1.25rem", { lineHeight: "1.75rem" }],
    "2xl": ["1.5rem", { lineHeight: "2rem" }],
    "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
    "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
    "5xl": ["3rem", { lineHeight: "1" }],
    "6xl": ["3.75rem", { lineHeight: "1" }],
  },
  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
};

// Typography scale optimized for financial data display
export const typographyScale = {
  // Display text for headers and important metrics
  display: {
    large: {
      fontSize: typography.fontSize["5xl"][0],
      lineHeight: typography.fontSize["5xl"][1].lineHeight,
      fontWeight: typography.fontWeight.bold,
      letterSpacing: "-0.025em",
    },
    medium: {
      fontSize: typography.fontSize["4xl"][0],
      lineHeight: typography.fontSize["4xl"][1].lineHeight,
      fontWeight: typography.fontWeight.bold,
      letterSpacing: "-0.025em",
    },
    small: {
      fontSize: typography.fontSize["3xl"][0],
      lineHeight: typography.fontSize["3xl"][1].lineHeight,
      fontWeight: typography.fontWeight.semibold,
      letterSpacing: "-0.025em",
    },
  },
  // Headings for sections and cards
  heading: {
    h1: {
      fontSize: typography.fontSize["2xl"][0],
      lineHeight: typography.fontSize["2xl"][1].lineHeight,
      fontWeight: typography.fontWeight.bold,
      letterSpacing: "-0.025em",
    },
    h2: {
      fontSize: typography.fontSize.xl[0],
      lineHeight: typography.fontSize.xl[1].lineHeight,
      fontWeight: typography.fontWeight.semibold,
      letterSpacing: "-0.025em",
    },
    h3: {
      fontSize: typography.fontSize.lg[0],
      lineHeight: typography.fontSize.lg[1].lineHeight,
      fontWeight: typography.fontWeight.semibold,
      letterSpacing: "-0.025em",
    },
    h4: {
      fontSize: typography.fontSize.base[0],
      lineHeight: typography.fontSize.base[1].lineHeight,
      fontWeight: typography.fontWeight.semibold,
      letterSpacing: "0",
    },
  },
  // Body text for content
  body: {
    large: {
      fontSize: typography.fontSize.lg[0],
      lineHeight: typography.fontSize.lg[1].lineHeight,
      fontWeight: typography.fontWeight.normal,
      letterSpacing: "0",
    },
    medium: {
      fontSize: typography.fontSize.base[0],
      lineHeight: typography.fontSize.base[1].lineHeight,
      fontWeight: typography.fontWeight.normal,
      letterSpacing: "0",
    },
    small: {
      fontSize: typography.fontSize.sm[0],
      lineHeight: typography.fontSize.sm[1].lineHeight,
      fontWeight: typography.fontWeight.normal,
      letterSpacing: "0",
    },
  },
  // Labels and captions
  label: {
    large: {
      fontSize: typography.fontSize.base[0],
      lineHeight: typography.fontSize.base[1].lineHeight,
      fontWeight: typography.fontWeight.medium,
      letterSpacing: "0",
    },
    medium: {
      fontSize: typography.fontSize.sm[0],
      lineHeight: typography.fontSize.sm[1].lineHeight,
      fontWeight: typography.fontWeight.medium,
      letterSpacing: "0",
    },
    small: {
      fontSize: typography.fontSize.xs[0],
      lineHeight: typography.fontSize.xs[1].lineHeight,
      fontWeight: typography.fontWeight.medium,
      letterSpacing: "0.025em",
    },
  },
  // Code and data display
  code: {
    large: {
      fontSize: typography.fontSize.base[0],
      lineHeight: typography.fontSize.base[1].lineHeight,
      fontWeight: typography.fontWeight.normal,
      fontFamily: typography.fontFamily.mono.join(", "),
      letterSpacing: "0",
    },
    medium: {
      fontSize: typography.fontSize.sm[0],
      lineHeight: typography.fontSize.sm[1].lineHeight,
      fontWeight: typography.fontWeight.normal,
      fontFamily: typography.fontFamily.mono.join(", "),
      letterSpacing: "0",
    },
    small: {
      fontSize: typography.fontSize.xs[0],
      lineHeight: typography.fontSize.xs[1].lineHeight,
      fontWeight: typography.fontWeight.normal,
      fontFamily: typography.fontFamily.mono.join(", "),
      letterSpacing: "0",
    },
  },
};
