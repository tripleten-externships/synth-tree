import { useContext } from "react";
import { ThemeContext } from "../providers/ThemeProvider";

// Hook to access density functionality
export function useDensity() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useDensity must be used within a ThemeProvider");
  }

  const { density, setDensity } = context;

  return {
    density,
    setDensity,
    isCompact: density === "compact",
    isRegular: density === "regular",
    isComfy: density === "comfy",
  };
}
