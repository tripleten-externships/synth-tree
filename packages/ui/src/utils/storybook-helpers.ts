import type { ArgTypes } from "@storybook/react";

/**
 * Creates standardized size argTypes for Storybook controls
 *
 * Generates consistent size selection controls for component stories
 * Returns ArgTypes configuration with select control and size options
 * Ensures consistent sizing controls across all component stories. Select control
 *      prevents invalid size values. Centralized definition prevents duplication.
 *      Alternative: Inline argTypes would be inconsistent and harder to maintain.
 */
export function createSizeArgTypes(): ArgTypes {
  return {
    size: {
      control: { type: "select" },
      options: ["sm", "default", "lg"],
      description: "Component size preset",
    },
  };
}

/**
 * Creates standardized dimension offset argTypes for Storybook controls
 *
 * Generates range controls for width/height adjustments relative to size presets
 * Returns ArgTypes with range controls for offset values
 * Allows fine-tuning of component dimensions while maintaining base size consistency.
 *      Range controls provide intuitive +/- adjustments. Prevents extreme values with min/max.
 *      Alternative: Separate width/height controls would be less intuitive and more cluttered.
 */
export function createDimensionArgTypes(): ArgTypes {
  return {
    widthOffset: {
      control: { type: "range", min: -20, max: 20, step: 1 },
      description: "Width offset from size preset",
    },
    heightOffset: {
      control: { type: "range", min: -20, max: 20, step: 1 },
      description: "Height offset from size preset",
    },
  };
}

/**
 * Creates standardized icon/thumb size offset argTypes for Storybook controls
 *
 * Generates range controls for icon or thumb size adjustments
 * Returns ArgTypes with dynamic property names based on iconType parameter
 * Allows customization of internal element sizes while maintaining proportions.
 *      Dynamic property naming enables reuse for both icons and thumbs.
 *      Smaller range than dimensions since icons/thumbs are secondary elements.
 */
export function createIconSizeArgTypes(
  iconType: "icon" | "thumb" = "icon"
): ArgTypes {
  const label = iconType === "icon" ? "Icon" : "Thumb";
  return {
    [`${iconType}SizeOffset`]: {
      control: { type: "range", min: -10, max: 10, step: 1 },
      description: `${label} size offset from size preset`,
    },
  };
}

/**
 * Creates standardized state argTypes for Storybook controls
 *
 * Generates boolean controls for component state management
 * Returns ArgTypes with boolean control for checked state
 * Provides consistent state controls across interactive components.
 *      Boolean control is most appropriate for binary states.
 */
export function createStateArgTypes(): ArgTypes {
  return {
    checked: {
      control: { type: "boolean" },
      description: "Checked state",
    },
    disabled: {
      control: { type: "boolean" },
      description: "Disabled state",
    },
  };
}

/**
 * Creates standardized color argTypes for Storybook controls
 */
export function createColorArgTypes(): ArgTypes {
  return {
    checkedColor: {
      control: { type: "color" },
      description: "Background color when checked",
    },
    uncheckedColor: {
      control: { type: "color" },
      description: "Background color when unchecked",
    },
    borderColor: {
      control: { type: "color" },
      description: "Border color",
    },
  };
}

/**
 * Creates standardized checkmark color argTypes for Storybook controls
 *
 * Generates color picker controls for checkmark theming
 * Returns ArgTypes with color control for checkmark appearance
 * Allows customization of checkmark color independently from background.
 *      Specific to checkbox components that have checkmark icons.
 */
export function createCheckmarkColorArgTypes(): ArgTypes {
  return {
    checkedCheckmarkColor: {
      control: { type: "color" },
      description: "Checkmark color when checked",
    },
  };
}

/**
 * Creates standardized thumb color argTypes for switch components
 *
 * Generates color picker controls for switch thumb theming
 * Returns ArgTypes with color controls for both checked and unchecked thumb states
 * Switch thumbs have distinct colors for different states, unlike checkboxes.
 *      Allows independent theming of the movable thumb element.
 */
export function createThumbColorArgTypes(): ArgTypes {
  return {
    checkedThumbColor: {
      control: { type: "color" },
      description: "Thumb color when checked",
    },
    uncheckedThumbColor: {
      control: { type: "color" },
      description: "Thumb color when unchecked",
    },
  };
}

// Type definitions for default args factories
// Provides type safety for default argument creation and prevents typos

export interface CheckboxDefaultArgs {
  size: "sm" | "default" | "lg";
  widthOffset: number;
  heightOffset: number;
  iconSizeOffset: number;
  checkedColor: string;
  uncheckedColor: string;
  borderColor: string;
  checkedCheckmarkColor: string;
  checked?: boolean;
  disabled?: boolean;
  className?: string;
}

export interface SwitchDefaultArgs {
  size: "sm" | "default" | "lg";
  widthOffset: number;
  heightOffset: number;
  thumbSizeOffset: number;
  checkedColor: string;
  uncheckedColor: string;
  borderColor: string;
  checkedThumbColor: string;
  uncheckedThumbColor: string;
  checked?: boolean;
  disabled?: boolean;
}

/**
 * Creates standardized default args for checkbox components
 *
 * Generates complete default argument objects for checkbox stories
 * Returns CheckboxDefaultArgs with sensible defaults, overridden by provided values
 * Ensures consistent baseline appearance across checkbox stories. Uses design system
 *      colors (hsl(var(--primary))) for theme compatibility. Centralized defaults prevent
 *      duplication and ensure consistency. Alternative: Inline defaults would be inconsistent.
 */
export function createCheckboxDefaults(
  overrides: Partial<CheckboxDefaultArgs> = {}
): CheckboxDefaultArgs {
  return {
    size: "default",
    widthOffset: 0,
    heightOffset: 0,
    iconSizeOffset: 0,
    checkedColor: "hsl(var(--primary))",
    uncheckedColor: "#ffffff",
    borderColor: "#479AFF",
    checkedCheckmarkColor: "hsl(var(--primary-foreground))",
    ...overrides,
  };
}

/**
 * Creates standardized default args for switch components
 *
 * Generates complete default argument objects for switch stories
 * Returns SwitchDefaultArgs with sensible defaults, overridden by provided values
 * Same benefits as createCheckboxDefaults but with switch-specific defaults.
 *      Uses muted colors for unchecked state to match switch design patterns.
 *      Thumb colors are foreground colors for better contrast.
 */
export function createSwitchDefaults(
  overrides: Partial<SwitchDefaultArgs> = {}
): SwitchDefaultArgs {
  return {
    size: "default",
    widthOffset: 0,
    heightOffset: 0,
    thumbSizeOffset: 0,
    checkedColor: "hsl(var(--primary))",
    uncheckedColor: "hsl(var(--muted))",
    borderColor: "hsl(var(--border))",
    checkedThumbColor: "hsl(var(--primary-foreground))",
    uncheckedThumbColor: "hsl(var(--muted-foreground))",
    ...overrides,
  };
}
