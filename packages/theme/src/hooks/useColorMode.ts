import { useContext } from "react";
import { ThemeContext } from "../providers/ThemeProvider";
import type { ColorMode } from "../types";

// Hook to access color mode functionality
export function useColorMode() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useColorMode must be used within a ThemeProvider");
  }

  const { colorMode, setColorMode, toggleColorMode } = context;

  return {
    colorMode,
    setColorMode,
    toggleColorMode,
    isDark: colorMode === "dark",
    isLight: colorMode === "light",
  };
}

// Hook to get system color scheme preference
export function useSystemColorScheme(): ColorMode {
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return "light";
}

// Hook to watch for system color scheme changes
export function useSystemColorSchemeWatcher(
  callback: (mode: ColorMode) => void
) {
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

// Hook for automatic color mode based on system preference
export function useAutoColorMode() {
  const { setColorMode } = useColorMode();
  const systemColorScheme = useSystemColorScheme();

  const enableAutoMode = () => {
    setColorMode(systemColorScheme);

    // Watch for system changes
    return useSystemColorSchemeWatcher((mode) => {
      setColorMode(mode);
    });
  };

  return {
    enableAutoMode,
    systemColorScheme,
  };
}
