// Export types
export type * from "./types";

// Export design tokens
export {
  colors,
  colorVariables,
  typography,
  typographyScale,
  spacing,
  semanticSpacing,
  responsiveSpacing,
  shadows,
  semanticShadows,
  colorShadows,
  shadowTransitions,
  breakpoints,
  semanticBreakpoints,
  containerSizes,
  mediaQueries,
  gridBreakpoints,
  theme,
  defaultTheme,
  themeVariants,
} from "./tokens";

// Export utilities
export {
  setCSSVariables,
  getCSSVariable,
  toHSL,
  generateCSSVariables,
  applyThemeVariables,
  removeThemeVariables,
  getSystemColorScheme,
  watchSystemColorScheme,
  cn,
  getColor,
  getSpacing,
  getTypography,
  getShadow,
  getBreakpoint,
  responsive,
  variant,
  size,
  state,
  colorMode,
  formatCurrency,
  formatPercentage,
  formatLargeNumber,
  getMetricColor,
  focusRing,
  transition,
  validateTheme,
  mergeThemes,
} from "./utils";

// Export hooks
export {
  useTheme,
  useThemeTokens,
  useThemeColor,
  useThemeSpacing,
  useThemeTypography,
  useThemeShadow,
  useThemeBreakpoint,
  useColorMode,
  useSystemColorScheme,
  useSystemColorSchemeWatcher,
  useAutoColorMode,
} from "./hooks";

// Export providers
export {
  ThemeProvider,
  ThemeContext,
  withTheme,
  useIsThemeProviderPresent,
} from "./providers";

// Export Tailwind configuration (separate entry point)
// This is exported from ./tailwind/index for consumers who only need Tailwind config
