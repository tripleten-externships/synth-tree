import type { Spacing } from "../types";

// Consistent spacing scale based on 4px base unit
// Optimized for financial data layouts and professional interfaces
export const spacing: Spacing = {
  0: "0px",
  px: "1px",
  0.5: "0.125rem", // 2px
  1: "0.25rem", // 4px
  1.5: "0.375rem", // 6px
  2: "0.5rem", // 8px
  2.5: "0.625rem", // 10px
  3: "0.75rem", // 12px
  3.5: "0.875rem", // 14px
  4: "1rem", // 16px
  5: "1.25rem", // 20px
  6: "1.5rem", // 24px
  7: "1.75rem", // 28px
  8: "2rem", // 32px
  9: "2.25rem", // 36px
  10: "2.5rem", // 40px
  11: "2.75rem", // 44px
  12: "3rem", // 48px
  14: "3.5rem", // 56px
  16: "4rem", // 64px
  20: "5rem", // 80px
  24: "6rem", // 96px
  28: "7rem", // 112px
  32: "8rem", // 128px
  36: "9rem", // 144px
  40: "10rem", // 160px
  44: "11rem", // 176px
  48: "12rem", // 192px
  52: "13rem", // 208px
  56: "14rem", // 224px
  60: "15rem", // 240px
  64: "16rem", // 256px
  72: "18rem", // 288px
  80: "20rem", // 320px
  96: "24rem", // 384px
};

// Semantic spacing for common use cases
export const semanticSpacing = {
  // Component internal spacing
  component: {
    xs: spacing[1], // 4px - tight spacing within components
    sm: spacing[2], // 8px - small internal padding
    md: spacing[4], // 16px - standard internal padding
    lg: spacing[6], // 24px - large internal padding
    xl: spacing[8], // 32px - extra large internal padding
  },
  // Layout spacing between components
  layout: {
    xs: spacing[2], // 8px - tight layout spacing
    sm: spacing[4], // 16px - small layout spacing
    md: spacing[6], // 24px - standard layout spacing
    lg: spacing[8], // 32px - large layout spacing
    xl: spacing[12], // 48px - extra large layout spacing
    "2xl": spacing[16], // 64px - section spacing
    "3xl": spacing[20], // 80px - major section spacing
  },
  // Content spacing for text and data
  content: {
    xs: spacing[1], // 4px - tight text spacing
    sm: spacing[2], // 8px - small text spacing
    md: spacing[3], // 12px - standard text spacing
    lg: spacing[4], // 16px - large text spacing
    xl: spacing[6], // 24px - extra large text spacing
  },
  // Form element spacing
  form: {
    field: spacing[4], // 16px - between form fields
    group: spacing[6], // 24px - between form groups
    section: spacing[8], // 32px - between form sections
    label: spacing[2], // 8px - label to input spacing
    help: spacing[1], // 4px - help text spacing
    error: spacing[1], // 4px - error message spacing
  },
  // Card and container spacing
  container: {
    xs: spacing[3], // 12px - tight container padding
    sm: spacing[4], // 16px - small container padding
    md: spacing[6], // 24px - standard container padding
    lg: spacing[8], // 32px - large container padding
    xl: spacing[12], // 48px - extra large container padding
  },
  // Data table spacing
  table: {
    cell: spacing[3], // 12px - table cell padding
    header: spacing[4], // 16px - table header padding
    row: spacing[2], // 8px - row spacing
    section: spacing[6], // 24px - table section spacing
  },
};

// Responsive spacing utilities
export const responsiveSpacing = {
  // Mobile-first responsive spacing
  mobile: {
    container: spacing[4], // 16px
    section: spacing[6], // 24px
    component: spacing[3], // 12px
  },
  tablet: {
    container: spacing[6], // 24px
    section: spacing[8], // 32px
    component: spacing[4], // 16px
  },
  desktop: {
    container: spacing[8], // 32px
    section: spacing[12], // 48px
    component: spacing[6], // 24px
  },
};
