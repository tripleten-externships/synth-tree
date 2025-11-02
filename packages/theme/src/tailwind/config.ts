import type { Config } from "tailwindcss";
import { colors } from "../tokens/colors";
import { typography } from "../tokens/typography";
import { spacing } from "../tokens/spacing";
import { shadows } from "../tokens/shadows";
import { breakpoints } from "../tokens/breakpoints";
import type { ColorScale, Spacing, Shadows, Breakpoints } from "../types";

// Type-safe conversion utilities for Tailwind CSS compatibility
// These functions ensure our strongly-typed tokens work with Tailwind's more flexible Record<string, string> types

// Convert our Spacing type to Tailwind's expected format
function spacingToTailwind(spacingTokens: Spacing): Record<string, string> {
  // Our Spacing interface is compatible with Record<string, string>
  // since all properties are string values
  return spacingTokens as Record<string, string>;
}

// Convert our Shadows type to Tailwind's expected format
function shadowsToTailwind(shadowTokens: Shadows): Record<string, string> {
  // Our Shadows interface is compatible with Record<string, string>
  // since all properties are string values
  return shadowTokens as Record<string, string>;
}

// Convert our Breakpoints type to Tailwind's expected format
function breakpointsToTailwind(
  breakpointTokens: Breakpoints
): Record<string, string> {
  // Our Breakpoints interface is compatible with Record<string, string>
  // since all properties are string values
  return breakpointTokens as Record<string, string>;
}

// Tailwind CSS configuration with custom theme tokens
export const tailwindConfig: Partial<Config> = {
  content: [
    // Include all source files that might use Tailwind classes
    "./src/**/*.{js,ts,jsx,tsx}",
    "./stories/**/*.{js,ts,jsx,tsx}",
    // Include other packages that might use this theme
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
    "../../apps/*/src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ["class"],
  theme: {
    // Override default breakpoints
    screens: breakpointsToTailwind(breakpoints),

    // Extend default theme with custom tokens
    extend: {
      // Custom color palette
      colors: {
        // Semantic color mappings for shadcn/ui compatibility
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          ...colors.primary,
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          ...colors.secondary,
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          ...colors.accent,
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        // Custom color scales
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
          ...colors.success,
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
          ...colors.warning,
        },
        error: {
          DEFAULT: "hsl(var(--error))",
          foreground: "hsl(var(--error-foreground))",
          ...colors.error,
        },
        neutral: {
          DEFAULT: "hsl(var(--neutral))",
          foreground: "hsl(var(--neutral-foreground))",
          ...colors.neutral,
        },
      },

      // Custom typography
      fontFamily: typography.fontFamily,
      fontSize: typography.fontSize,
      fontWeight: typography.fontWeight,

      // Custom spacing scale
      spacing: spacingToTailwind(spacing),

      // Custom shadows
      boxShadow: shadowsToTailwind(shadows),

      // Custom border radius
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      // Animation and transitions
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-out": {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        "slide-in-from-top": {
          from: { transform: "translateY(-100%)" },
          to: { transform: "translateY(0)" },
        },
        "slide-in-from-bottom": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        "slide-in-from-left": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-in-from-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
        "fade-out": "fade-out 0.2s ease-out",
        "slide-in-from-top": "slide-in-from-top 0.2s ease-out",
        "slide-in-from-bottom": "slide-in-from-bottom 0.2s ease-out",
        "slide-in-from-left": "slide-in-from-left 0.2s ease-out",
        "slide-in-from-right": "slide-in-from-right 0.2s ease-out",
      },
    },
  },
  plugins: [
    // Add custom plugins for enhanced functionality
    // Note: These plugins will be added when dependencies are installed
    // require("@tailwindcss/forms"),
    // require("@tailwindcss/typography"),
  ],
};

// Export as default Tailwind config
export default tailwindConfig;

// Utility function to merge with user config
export function createTailwindConfig(userConfig: Partial<Config> = {}): Config {
  return {
    ...tailwindConfig,
    ...userConfig,
    theme: {
      ...tailwindConfig.theme,
      ...userConfig.theme,
      extend: {
        ...tailwindConfig.theme?.extend,
        ...userConfig.theme?.extend,
      },
    },
    content: [
      ...(tailwindConfig.content as string[]),
      ...((userConfig.content as string[]) || []),
    ],
    plugins: [...(tailwindConfig.plugins || []), ...(userConfig.plugins || [])],
  } as Config;
}
