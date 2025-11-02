import { useContext } from "react";
import { ThemeContext } from "../providers/ThemeProvider";
import type { ThemeContextValue } from "../types";

// Hook to access theme context
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}

// Hook to get theme tokens directly
export function useThemeTokens() {
  const { theme } = useTheme();
  return theme;
}

// Hook to get specific color from theme
export function useThemeColor(colorPath: string): string {
  const { theme } = useTheme();

  const parts = colorPath.split(".");
  let value: any = theme.colors;

  for (const part of parts) {
    if (value && typeof value === "object" && part in value) {
      value = value[part];
    } else {
      return "";
    }
  }

  return typeof value === "string" ? value : "";
}

// Hook to get spacing value from theme
export function useThemeSpacing(spacingKey: string): string {
  const { theme } = useTheme();
  return theme.spacing[spacingKey as keyof typeof theme.spacing] || "";
}

// Hook to get typography value from theme
export function useThemeTypography(typographyPath: string): any {
  const { theme } = useTheme();

  const parts = typographyPath.split(".");
  let value: any = theme.typography;

  for (const part of parts) {
    if (value && typeof value === "object" && part in value) {
      value = value[part];
    } else {
      return null;
    }
  }

  return value;
}

// Hook to get shadow value from theme
export function useThemeShadow(shadowKey: string): string {
  const { theme } = useTheme();
  return theme.shadows[shadowKey as keyof typeof theme.shadows] || "";
}

// Hook to get breakpoint value from theme
export function useThemeBreakpoint(breakpointKey: string): string {
  const { theme } = useTheme();
  return (
    theme.breakpoints[breakpointKey as keyof typeof theme.breakpoints] || ""
  );
}
