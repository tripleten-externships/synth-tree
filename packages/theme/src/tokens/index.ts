export { colors, colorVariables } from "./colors";
export { typography, typographyScale } from "./typography";
export { spacing, semanticSpacing, responsiveSpacing } from "./spacing";
export {
  shadows,
  semanticShadows,
  colorShadows,
  shadowTransitions,
} from "./shadows";
export {
  breakpoints,
  semanticBreakpoints,
  containerSizes,
  mediaQueries,
  gridBreakpoints,
} from "./breakpoints";

// Combined theme object
import { colors } from "./colors";
import { typography } from "./typography";
import { spacing } from "./spacing";
import { shadows } from "./shadows";
import { breakpoints } from "./breakpoints";
import type { Theme } from "../types";

export const theme: Theme = {
  colors,
  typography,
  spacing,
  shadows,
  breakpoints,
};

// Default theme configuration
export const defaultTheme = theme;

// Theme variants for different contexts
export const themeVariants = {
  default: theme,
  compact: {
    ...theme,
    spacing: {
      ...theme.spacing,
      // Reduced spacing for compact layouts
    },
  },
  accessible: {
    ...theme,
    typography: {
      ...theme.typography,
      fontSize: {
        // Larger font sizes for accessibility
        ...theme.typography.fontSize,
        base: ["1.125rem", { lineHeight: "1.75rem" }],
        lg: ["1.25rem", { lineHeight: "1.875rem" }],
      },
    },
  },
};
