import type { ColorScale, ColorPalette } from "../types";

// Purple primary scale centered around 257-258° hue with 100% saturation
// Supports both light (257.9412° 100% 60%) and dark (257.6687° 100% 68.0392%) theme values
const primary: ColorScale = {
  50: "258 100% 97%",
  100: "258 100% 94%",
  200: "258 100% 87%",
  300: "258 100% 80%",
  400: "258 100% 73%",
  500: "257.9412 100% 60%", // Light theme primary
  600: "258 100% 53%",
  700: "258 100% 46%",
  800: "258 100% 39%",
  900: "258 100% 32%",
  950: "258 100% 15%",
};

// Blue-gray secondary scale supporting both light and dark theme values
// Light theme: 214.2857° 24.1379% 94.3137%
// Dark theme: 226.6667° 9.6774% 18.2353%
const secondary: ColorScale = {
  50: "214 24% 98%",
  100: "214.2857 24.1379% 94.3137%", // Light theme secondary
  200: "214 24% 87%",
  300: "214 20% 80%",
  400: "214 16% 65%",
  500: "214 12% 50%",
  600: "220 10% 35%",
  700: "224 10% 25%",
  800: "226.6667 9.6774% 18.2353%", // Dark theme secondary
  900: "228 8% 12%",
  950: "230 8% 6%",
};

// Blue accent scale around 208-221° hue range
// Light theme: 221.3793° 100% 94.3137% with foreground 216.3158° 76% 49.0196%
// Dark theme: 217.2414° 32.5843% 17.451% with foreground 208.209° 100% 73.7255%
const accent: ColorScale = {
  50: "221 100% 98%",
  100: "221.3793 100% 94.3137%", // Light theme accent
  200: "220 100% 87%",
  300: "219 100% 80%",
  400: "218 90% 65%",
  500: "216.3158 76% 49.0196%", // Light theme accent-foreground
  600: "215 70% 40%",
  700: "214 60% 30%",
  800: "217.2414 32.5843% 17.451%", // Dark theme accent
  900: "218 25% 12%",
  950: "220 20% 6%",
};

// Professional green for positive metrics
const success: ColorScale = {
  50: "142 76% 96%",
  100: "142 76% 91%",
  200: "142 69% 83%",
  300: "142 69% 75%",
  400: "142 69% 67%",
  500: "141.8919 69.1589% 58.0392%", // From chart-1 in dark theme
  600: "142 69% 45%",
  700: "142 65% 35%",
  800: "142 60% 25%",
  900: "142 55% 15%",
  950: "142 50% 8%",
};

// Amber for warnings
const warning: ColorScale = {
  50: "25 100% 97%",
  100: "25 100% 94%",
  200: "25 100% 87%",
  300: "25 100% 80%",
  400: "25 100% 70%",
  500: "24.8571 98.1308% 58.0392%", // From chart-3 in light theme
  600: "25 95% 48%",
  700: "25 90% 38%",
  800: "25 85% 28%",
  900: "25 80% 18%",
  950: "25 75% 10%",
};

// Destructive/error scale supporting both light (358°) and dark (0°) red values
// Light theme: 358.4416° 74.7573% 59.6078%
// Dark theme: 0° 90.604% 70.7843%
const error: ColorScale = {
  50: "0 86% 97%",
  100: "0 93% 94%",
  200: "0 96% 89%",
  300: "0 94% 82%",
  400: "0 91% 71%",
  500: "358.4416 74.7573% 59.6078%", // Light theme destructive
  600: "0 84% 60%",
  700: "0 72% 51%",
  800: "0 70% 35%",
  900: "0 63% 31%",
  950: "0 75% 15%",
};

// Comprehensive neutral gray scale supporting border values
// Light theme border: 240° 17.0732% 91.9608%
// Dark theme border: 222.8571° 6.422% 21.3725%
const neutral: ColorScale = {
  50: "0 0% 98%",
  100: "240 17% 96%",
  200: "240 17.0732% 91.9608%", // Light theme border
  300: "240 15% 85%",
  400: "240 12% 70%",
  500: "240 8% 50%",
  600: "240 6% 35%",
  700: "230 6% 25%",
  800: "222.8571 6.422% 21.3725%", // Dark theme border
  900: "225 7% 15%",
  950: "225 7% 8%",
};

export const colors: ColorPalette = {
  primary,
  secondary,
  accent,
  success,
  warning,
  error,
  neutral,
};

// CSS Custom Properties for runtime theme switching using HSL format
export const colorVariables = {
  light: {
    "--color-background": "0 0% 99.2157%",
    "--color-foreground": "0 0% 0%",
    "--color-card": "0 0% 99.2157%",
    "--color-card-foreground": "0 0% 0%",
    "--color-popover": "0 0% 98.8235%",
    "--color-popover-foreground": "0 0% 0%",
    "--color-primary": "257.9412 100% 60%",
    "--color-primary-foreground": "0 0% 100%",
    "--color-secondary": "214.2857 24.1379% 94.3137%",
    "--color-secondary-foreground": "0 0% 3.1373%",
    "--color-muted": "0 0% 96.0784%",
    "--color-muted-foreground": "0 0% 32.1569%",
    "--color-accent": "221.3793 100% 94.3137%",
    "--color-accent-foreground": "216.3158 76% 49.0196%",
    "--color-destructive": "358.4416 74.7573% 59.6078%",
    "--color-destructive-foreground": "0 0% 100%",
    "--color-success": "142 69% 45%",
    "--color-success-foreground": "0 0% 100%",
    "--color-warning": "25 95% 48%",
    "--color-warning-foreground": "0 0% 100%",
    "--color-border": "240 17.0732% 91.9608%",
    "--color-input": "0 0% 92.1569%",
    "--color-ring": "0 0% 0%",
  },
  dark: {
    "--color-background": "225 7.1429% 10.9804%",
    "--color-foreground": "0 0% 94.1176%",
    "--color-card": "228 6.8493% 14.3137%",
    "--color-card-foreground": "0 0% 94.1176%",
    "--color-popover": "228 6.8493% 14.3137%",
    "--color-popover-foreground": "0 0% 94.1176%",
    "--color-primary": "257.6687 100% 68.0392%",
    "--color-primary-foreground": "0 0% 100%",
    "--color-secondary": "226.6667 9.6774% 18.2353%",
    "--color-secondary-foreground": "0 0% 94.1176%",
    "--color-muted": "226.6667 9.6774% 18.2353%",
    "--color-muted-foreground": "0 0% 62.7451%",
    "--color-accent": "217.2414 32.5843% 17.451%",
    "--color-accent-foreground": "208.209 100% 73.7255%",
    "--color-destructive": "0 90.604% 70.7843%",
    "--color-destructive-foreground": "0 0% 100%",
    "--color-success": "141.8919 69.1589% 58.0392%",
    "--color-success-foreground": "0 0% 100%",
    "--color-warning": "24.8571 98.1308% 58.0392%",
    "--color-warning-foreground": "0 0% 100%",
    "--color-border": "222.8571 6.422% 21.3725%",
    "--color-input": "222.8571 6.422% 21.3725%",
    "--color-ring": "257.6687 100% 68.0392%",
  },
};
