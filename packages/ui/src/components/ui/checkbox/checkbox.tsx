import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils";
import { useDimensions } from "@/hooks/useDimensions";
import {
  useCheckboxStyles,
  useCheckmarkStyles,
} from "@/hooks/useComponentStyles";

const sizeMappings = {
  sm: { width: 12, height: 12, iconSize: 10 },
  default: { width: 16, height: 16, iconSize: 14 },
  lg: { width: 20, height: 20, iconSize: 18 },
};

/**
 * Checkbox Props: Radix + dimensions + colors + size
 */
export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  checkedColor: string;
  uncheckedColor: string;
  borderColor: string;
  checkedCheckmarkColor: string;
  width?: number;
  height?: number;
  iconSize?: number;
  size?: "sm" | "default" | "lg";
  widthOffset?: number;
  heightOffset?: number;
  iconSizeOffset?: number;
}

/**
 * Checkbox Component - ST-34
 *
 * A customizable checkbox built on Radix UI primitives
 * - Keyboard navigation + screen reader
 * - forwardRef = react-hook-form
 * - Size variants for different UI contexts
 * - Theme tokens
 * - Scaling visual check indicator
 */
/**
 * Checkbox Component - ST-34
 *
 * Radix UI primitives checkbox
 * - Keyboard navigation
 * - forwardRef = react-hook-form
 * - Dynamic dimensions and colors
 * - Theme tokens
 * - Animations + transitions
 */
const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(
  (
    {
      className,
      checkedColor,
      uncheckedColor,
      borderColor,
      checkedCheckmarkColor,
      width,
      height,
      iconSize,
      size = "default",
      widthOffset = 0,
      heightOffset = 0,
      iconSizeOffset = 0,
      checked,
      ...props
    },
    ref
  ) => {
    const {
      width: finalWidth,
      height: finalHeight,
      iconSize: finalIconSize,
    } = useDimensions({
      sizeMappings,
      size,
      width,
      height,
      iconSize,
      widthOffset,
      heightOffset,
      iconSizeOffset,
    });

    const checkboxStyles = useCheckboxStyles({
      width: finalWidth,
      height: finalHeight,
      checkedColor,
      uncheckedColor,
      borderColor,
    });

    const checkmarkStyles = useCheckmarkStyles({
      checkmarkColor: checkedCheckmarkColor,
      fontSize: finalIconSize!,
    });

    const rootProps = {
      className: cn(
        "peer shrink-0 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        "w-[var(--checkbox-width)] h-[var(--checkbox-height)] bg-[var(--unchecked-bg)] data-[state=checked]:bg-[var(--checked-bg)] border",
        className
      ),
      style: checkboxStyles,
      ...props,
      ref,
    } as React.ComponentProps<typeof CheckboxPrimitive.Root>;

    if (checked !== undefined) {
      rootProps.checked = checked;
    }

    return (
      <CheckboxPrimitive.Root {...rootProps}>
        <CheckboxPrimitive.Indicator
          className="flex items-center justify-center text-[var(--checkmark-color)]"
          style={checkmarkStyles}
        >
          <Check className="h-full w-full" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    );
  }
);

Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
