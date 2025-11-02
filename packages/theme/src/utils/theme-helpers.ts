import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Theme, ColorMode } from "../types";

// Utility function to merge Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Get color value from theme
export function getColor(theme: Theme, colorPath: string): string {
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

// Get spacing value from theme
export function getSpacing(theme: Theme, spacingKey: string): string {
  return theme.spacing[spacingKey as keyof typeof theme.spacing] || "";
}

// Get typography value from theme
export function getTypography(theme: Theme, typographyPath: string): any {
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

// Get shadow value from theme
export function getShadow(theme: Theme, shadowKey: string): string {
  return theme.shadows[shadowKey as keyof typeof theme.shadows] || "";
}

// Get breakpoint value from theme
export function getBreakpoint(theme: Theme, breakpointKey: string): string {
  return (
    theme.breakpoints[breakpointKey as keyof typeof theme.breakpoints] || ""
  );
}

// Create responsive class names
export function responsive(classes: Record<string, string>): string {
  return (Object.entries(classes) as [string, string][])
    .map(([breakpoint, className]) => {
      if (breakpoint === "base") {
        return className;
      }
      return `${breakpoint}:${className}`;
    })
    .join(" ");
}

// Create variant class names
export function variant(
  base: string,
  variants: Record<string, string>,
  selectedVariant: string
): string {
  const variantClass = variants[selectedVariant] || "";
  return cn(base, variantClass);
}

// Create size class names
export function size(
  base: string,
  sizes: Record<string, string>,
  selectedSize: string
): string {
  const sizeClass = sizes[selectedSize] || "";
  return cn(base, sizeClass);
}

// Create state class names (hover, focus, active, disabled)
export function state(
  base: string,
  states: {
    hover?: string;
    focus?: string;
    active?: string;
    disabled?: string;
  }
): string {
  const stateClasses = [
    base,
    states.hover && `hover:${states.hover}`,
    states.focus && `focus:${states.focus}`,
    states.active && `active:${states.active}`,
    states.disabled && `disabled:${states.disabled}`,
  ].filter(Boolean);

  return cn(...stateClasses);
}

// Create color mode specific classes
export function colorMode(
  lightClass: string,
  darkClass: string,
  mode?: ColorMode
): string {
  if (mode) {
    return mode === "light" ? lightClass : darkClass;
  }
  return cn(lightClass, `dark:${darkClass}`);
}

// Format currency values
export function formatCurrency(
  value: number,
  currency: string = "USD",
  locale: string = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(value);
}

// Format percentage values
export function formatPercentage(
  value: number,
  decimals: number = 2,
  locale: string = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
}

// Format large numbers (K, M, B)
export function formatLargeNumber(
  value: number,
  locale: string = "en-US"
): string {
  // Manual implementation for compact number formatting
  const absValue = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (absValue >= 1e9) {
    return sign + (absValue / 1e9).toFixed(1) + "B";
  } else if (absValue >= 1e6) {
    return sign + (absValue / 1e6).toFixed(1) + "M";
  } else if (absValue >= 1e3) {
    return sign + (absValue / 1e3).toFixed(1) + "K";
  } else {
    return new Intl.NumberFormat(locale).format(value);
  }
}

// Get metric color based on value
export function getMetricColor(
  value: number,
  isInverse: boolean = false
): string {
  if (value === 0) return "text-neutral-600";

  const isPositive = value > 0;
  const shouldBeGreen = isInverse ? !isPositive : isPositive;

  return shouldBeGreen ? "text-success-600" : "text-error-600";
}

// Create focus ring classes
export function focusRing(color: string = "primary"): string {
  return `focus:outline-none focus:ring-2 focus:ring-${color}-500 focus:ring-offset-2`;
}

// Create transition classes
export function transition(
  properties: string[] = ["all"],
  duration: string = "150ms",
  easing: string = "cubic-bezier(0.4, 0, 0.2, 1)"
): string {
  const transitionProperty = properties.join(", ");
  return `transition-[${transitionProperty}] duration-[${duration}] ease-[${easing}]`;
}

// Validate theme structure
export function validateTheme(theme: any): theme is Theme {
  return (
    theme &&
    typeof theme === "object" &&
    theme.colors &&
    theme.typography &&
    theme.spacing &&
    theme.shadows &&
    theme.breakpoints
  );
}

// Deep merge theme objects
export function mergeThemes(
  baseTheme: Theme,
  overrideTheme: Partial<Theme>
): Theme {
  return {
    colors: { ...baseTheme.colors, ...overrideTheme.colors },
    typography: { ...baseTheme.typography, ...overrideTheme.typography },
    spacing: { ...baseTheme.spacing, ...overrideTheme.spacing },
    shadows: { ...baseTheme.shadows, ...overrideTheme.shadows },
    breakpoints: { ...baseTheme.breakpoints, ...overrideTheme.breakpoints },
  };
}
