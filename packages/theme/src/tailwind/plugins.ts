import plugin from "tailwindcss/plugin";

// Custom Tailwind plugins for financial advisor theme
export const skilltreeThemePlugin = plugin(function ({
  addUtilities,
  addComponents,
  theme,
}) {
  // Add custom utilities for financial data display
  addUtilities({
    // Currency formatting utilities
    ".currency": {
      fontFamily: theme("fontFamily.mono"),
      fontWeight: theme("fontWeight.medium"),
      letterSpacing: "0.025em",
    },
    ".currency-large": {
      fontSize: theme("fontSize.2xl.0"),
      lineHeight: theme("fontSize.2xl.1.lineHeight"),
      fontWeight: theme("fontWeight.bold"),
    },
    ".currency-small": {
      fontSize: theme("fontSize.sm.0"),
      lineHeight: theme("fontSize.sm.1.lineHeight"),
    },

    // Metric display utilities
    ".metric-positive": {
      color: theme("colors.success.600"),
    },
    ".metric-negative": {
      color: theme("colors.error.600"),
    },
    ".metric-neutral": {
      color: theme("colors.neutral.600"),
    },

    // Professional spacing utilities
    ".section-spacing": {
      marginBottom: theme("spacing.8"),
    },
    ".card-spacing": {
      padding: theme("spacing.6"),
    },
    ".form-spacing": {
      marginBottom: theme("spacing.4"),
    },
  });

  // Add custom components
  addComponents({
    // Professional card component
    ".card-professional": {
      backgroundColor: theme("colors.card.DEFAULT"),
      borderRadius: theme("borderRadius.lg"),
      boxShadow: theme("boxShadow.base"),
      padding: theme("spacing.6"),
      border: `1px solid ${theme("colors.border")}`,
    },

    // Data table styles
    ".table-financial": {
      width: "100%",
      borderCollapse: "collapse",
      "& th": {
        backgroundColor: theme("colors.muted.DEFAULT"),
        padding: theme("spacing.3"),
        textAlign: "left",
        fontWeight: theme("fontWeight.semibold"),
        borderBottom: `1px solid ${theme("colors.border")}`,
      },
      "& td": {
        padding: theme("spacing.3"),
        borderBottom: `1px solid ${theme("colors.border")}`,
      },
      "& tr:hover": {
        backgroundColor: theme("colors.muted.DEFAULT"),
      },
    },

    // Form styles
    ".form-professional": {
      "& .form-group": {
        marginBottom: theme("spacing.4"),
      },
      "& label": {
        display: "block",
        marginBottom: theme("spacing.2"),
        fontWeight: theme("fontWeight.medium"),
        color: theme("colors.foreground"),
      },
      "& input, & select, & textarea": {
        width: "100%",
        padding: theme("spacing.3"),
        border: `1px solid ${theme("colors.border")}`,
        borderRadius: theme("borderRadius.md"),
        backgroundColor: theme("colors.background"),
        "&:focus": {
          outline: "none",
          borderColor: theme("colors.ring"),
          boxShadow: `0 0 0 2px ${theme("colors.ring")}`,
        },
      },
    },
  });
});

// Animation plugin for smooth transitions
export const animationPlugin = plugin(function ({ addUtilities, theme }) {
  addUtilities({
    ".transition-smooth": {
      transition: "all 150ms cubic-bezier(0.4, 0, 0.2, 1)",
    },
    ".transition-fast": {
      transition: "all 100ms cubic-bezier(0.4, 0, 0.2, 1)",
    },
    ".transition-slow": {
      transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)",
    },
  });
});

// Accessibility plugin
export const accessibilityPlugin = plugin(function ({ addUtilities }) {
  addUtilities({
    ".focus-visible": {
      "&:focus-visible": {
        outline: "2px solid currentColor",
        outlineOffset: "2px",
      },
    },
    ".sr-only": {
      position: "absolute",
      width: "1px",
      height: "1px",
      padding: "0",
      margin: "-1px",
      overflow: "hidden",
      clip: "rect(0, 0, 0, 0)",
      whiteSpace: "nowrap",
      border: "0",
    },
  });
});

// Export all plugins
export const customPlugins = [
  skilltreeThemePlugin,
  animationPlugin,
  accessibilityPlugin,
];
