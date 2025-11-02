import React, { createContext, useEffect, useState, ReactNode } from "react";
import { theme as defaultTheme } from "../tokens";
import { setCSSVariables, getSystemColorScheme } from "../utils/css-variables";
import type { Theme, ColorMode, ThemeContextValue } from "../types";

// Create theme context
export const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
  theme?: Theme;
  defaultColorMode?: ColorMode;
  enableSystem?: boolean;
  storageKey?: string;
}

// ThemeProvider component
export function ThemeProvider({
  children,
  theme = defaultTheme,
  defaultColorMode = "light",
  enableSystem = true,
  storageKey = "skilltree-theme-mode",
}: ThemeProviderProps) {
  const [colorMode, setColorModeState] = useState<ColorMode>(() => {
    // Initialize color mode from localStorage or system preference
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored && (stored === "light" || stored === "dark")) {
          return stored as ColorMode;
        }
      } catch (error) {
        console.warn("Failed to read theme from localStorage:", error);
      }

      if (enableSystem) {
        return getSystemColorScheme();
      }
    }

    return defaultColorMode;
  });

  // Set color mode and persist to localStorage
  const setColorMode = (mode: ColorMode) => {
    setColorModeState(mode);

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(storageKey, mode);
      } catch (error) {
        console.warn("Failed to save theme to localStorage:", error);
      }
    }
  };

  // Toggle between light and dark mode
  const toggleColorMode = () => {
    setColorMode(colorMode === "light" ? "dark" : "light");
  };

  // Apply CSS variables when color mode changes
  useEffect(() => {
    setCSSVariables(colorMode);
  }, [colorMode]);

  // Listen for system color scheme changes
  useEffect(() => {
    if (!enableSystem) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if no manual preference is stored
      if (typeof window !== "undefined") {
        try {
          const stored = localStorage.getItem(storageKey);
          if (!stored) {
            setColorModeState(e.matches ? "dark" : "light");
          }
        } catch (error) {
          // If localStorage fails, still update based on system preference
          setColorModeState(e.matches ? "dark" : "light");
        }
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [enableSystem, storageKey]);

  // Context value
  const contextValue: ThemeContextValue = {
    theme,
    colorMode,
    setColorMode,
    toggleColorMode,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

// Higher-order component for theme injection
export function withTheme<P extends object>(Component: React.ComponentType<P>) {
  return function ThemedComponent(props: P) {
    return (
      <ThemeProvider>
        <Component {...props} />
      </ThemeProvider>
    );
  };
}

// Hook to check if component is inside ThemeProvider
export function useIsThemeProviderPresent(): boolean {
  const context = React.useContext(ThemeContext);
  return context !== null;
}
