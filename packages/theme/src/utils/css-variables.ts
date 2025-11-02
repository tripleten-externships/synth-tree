import { colorVariables } from "../tokens/colors";
import type { ColorMode } from "../types";

// CSS custom property utilities for runtime theme switching
export function setCSSVariables(mode: ColorMode = "light") {
  const variables = colorVariables[mode];

  if (typeof document !== "undefined") {
    const root = document.documentElement;

    (Object.entries(variables) as [string, string][]).forEach(
      ([property, value]) => {
        root.style.setProperty(property, value);
      }
    );

    // Set data attribute for CSS selectors
    root.setAttribute("data-theme", mode);

    // Set class for Tailwind dark mode
    if (mode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }
}

// Get current CSS variable value
export function getCSSVariable(property: string): string {
  if (typeof document !== "undefined") {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(property)
      .trim();
  }
  return "";
}

// Convert color to HSL format for CSS variables
export function toHSL(color: string): string {
  // This is a simplified version - in a real implementation,
  // you might want to use a color parsing library
  return (
    color
      .replace("#", "")
      .match(/.{2}/g)
      ?.map((hex) => parseInt(hex, 16))
      .join(" ") || color
  );
}

// Generate CSS custom properties from theme tokens
export function generateCSSVariables(theme: any): Record<string, string> {
  const variables: Record<string, string> = {};

  // Generate color variables
  if (theme.colors) {
    (Object.entries(theme.colors) as [string, any][]).forEach(
      ([colorName, colorValue]) => {
        if (typeof colorValue === "object") {
          (Object.entries(colorValue) as [string, string][]).forEach(
            ([shade, value]) => {
              variables[`--color-${colorName}-${shade}`] = value as string;
            }
          );
        } else {
          variables[`--color-${colorName}`] = colorValue as string;
        }
      }
    );
  }

  // Generate spacing variables
  if (theme.spacing) {
    (Object.entries(theme.spacing) as [string, string][]).forEach(
      ([key, value]) => {
        variables[`--spacing-${key}`] = value as string;
      }
    );
  }

  // Generate typography variables
  if (theme.typography?.fontSize) {
    (
      Object.entries(theme.typography.fontSize) as [string, [string, any]][]
    ).forEach(([size, [value]]) => {
      variables[`--font-size-${size}`] = value;
    });
  }

  return variables;
}

// Apply theme variables to document
export function applyThemeVariables(variables: Record<string, string>) {
  if (typeof document !== "undefined") {
    const root = document.documentElement;

    (Object.entries(variables) as [string, string][]).forEach(
      ([property, value]) => {
        root.style.setProperty(property, value);
      }
    );
  }
}

// Remove theme variables from document
export function removeThemeVariables(variables: Record<string, string>) {
  if (typeof document !== "undefined") {
    const root = document.documentElement;

    Object.keys(variables).forEach((property) => {
      root.style.removeProperty(property);
    });
  }
}

// Get system color scheme preference
export function getSystemColorScheme(): ColorMode {
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return "light";
}

// Listen for system color scheme changes
export function watchSystemColorScheme(callback: (mode: ColorMode) => void) {
  if (typeof window !== "undefined" && window.matchMedia) {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handler = (e: MediaQueryListEvent) => {
      callback(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handler);

    // Return cleanup function
    return () => mediaQuery.removeEventListener("change", handler);
  }

  return () => {};
}
