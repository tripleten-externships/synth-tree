export interface TokenValue {
  value: string;
  description?: string;
}

export interface ColorToken extends TokenValue {
  contrast?: string;
}

export interface TypographyToken extends TokenValue {
  lineHeight?: string;
  letterSpacing?: string;
}

export interface SpacingToken extends TokenValue {
  rem?: string;
  px?: string;
}

export interface ShadowToken extends TokenValue {
  x?: string;
  y?: string;
  blur?: string;
  spread?: string;
  color?: string;
}

export interface BreakpointToken extends TokenValue {
  min?: string;
  max?: string;
}

export interface DesignTokens {
  colors: Record<string, ColorToken | Record<string, ColorToken>>;
  typography: Record<string, TypographyToken | Record<string, TypographyToken>>;
  spacing: Record<string, SpacingToken>;
  shadows: Record<string, ShadowToken>;
  breakpoints: Record<string, BreakpointToken>;
}
