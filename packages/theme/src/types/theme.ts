export interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
  [key: string]: string;
}

export interface ColorPalette {
  primary: ColorScale;
  secondary: ColorScale;
  accent: ColorScale;
  success: ColorScale;
  warning: ColorScale;
  error: ColorScale;
  neutral: ColorScale;
}

export interface Typography {
  fontFamily: {
    sans: string[];
    mono: string[];
  };
  fontSize: {
    xs: [string, { lineHeight: string }];
    sm: [string, { lineHeight: string }];
    base: [string, { lineHeight: string }];
    lg: [string, { lineHeight: string }];
    xl: [string, { lineHeight: string }];
    "2xl": [string, { lineHeight: string }];
    "3xl": [string, { lineHeight: string }];
    "4xl": [string, { lineHeight: string }];
    "5xl": [string, { lineHeight: string }];
    "6xl": [string, { lineHeight: string }];
  };
  fontWeight: {
    normal: string;
    medium: string;
    semibold: string;
    bold: string;
  };
}

export interface Spacing {
  0: string;
  px: string;
  0.5: string;
  1: string;
  1.5: string;
  2: string;
  2.5: string;
  3: string;
  3.5: string;
  4: string;
  5: string;
  6: string;
  7: string;
  8: string;
  9: string;
  10: string;
  11: string;
  12: string;
  14: string;
  16: string;
  20: string;
  24: string;
  28: string;
  32: string;
  36: string;
  40: string;
  44: string;
  48: string;
  52: string;
  56: string;
  60: string;
  64: string;
  72: string;
  80: string;
  96: string;
  [key: string]: string;
}

export interface Shadows {
  sm: string;
  base: string;
  md: string;
  lg: string;
  xl: string;
  "2xl": string;
  inner: string;
  none: string;
  [key: string]: string;
}

export interface Breakpoints {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  "2xl": string;
  [key: string]: string;
}

export interface Theme {
  colors: ColorPalette;
  typography: Typography;
  spacing: Spacing;
  shadows: Shadows;
  breakpoints: Breakpoints;
}

export type ColorMode = "light" | "dark";

export interface ThemeContextValue {
  theme: Theme;
  colorMode: ColorMode;
  setColorMode: (mode: ColorMode) => void;
  toggleColorMode: () => void;
}
