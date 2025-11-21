import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils";

const sizeMappings = {
  sm: { width: 28, height: 16, thumbSize: 12 },
  default: { width: 36, height: 20, thumbSize: 16 },
  lg: { width: 44, height: 24, thumbSize: 20 },
};

/**
 * Switch variants: track/background styling + sizing
 */
const switchVariants = cva(
  // Theme tokens, transitions, + accessibility
  "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      // Size variants for UI contexts
      size: {
        sm: "h-4 w-7",
        default: "h-5 w-9",
        lg: "h-6 w-11",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

/**
 * Switch thumb (sliding indicator) variants
 * Thumb scales translates off track size
 */
const switchThumbVariants = cva(
  // smooth transitions for thumb styles
  "pointer-events-none block rounded-full shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-full data-[state=unchecked]:translate-x-0",
  {
    variants: {
      size: {
        // Thumb size + translation distance matchs track size
        sm: "h-3 w-3 data-[state=checked]:translate-x-3",
        default: "h-4 w-4 data-[state=checked]:translate-x-4",
        lg: "h-5 w-5 data-[state=checked]:translate-x-5",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

/**
 * Switch Props: Radix + color props + dimensions + size
 */
export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
  checkedColor: string;
  uncheckedColor: string;
  borderColor: string;
  checkedThumbColor: string;
  uncheckedThumbColor: string;
  width?: number;
  height?: number;
  thumbSize?: number;
  size?: "sm" | "default" | "lg";
  widthOffset?: number;
  heightOffset?: number;
  thumbSizeOffset?: number;
}

/**
 * Switch Component - ST-34
 *
 * Radix UI primitives toggle switch
 * - Keyboard navigation
 * - forwardRef = react-hook-form
 * - Dynamic dimensions
 * - Custom colors
 * - Animations + transitions
 */
const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(({
  className,
  checkedColor,
  uncheckedColor,
  borderColor,
  checkedThumbColor,
  uncheckedThumbColor,
  width,
  height,
  thumbSize,
  size = "default",
  widthOffset = 0,
  heightOffset = 0,
  thumbSizeOffset = 0,
  ...props
}, ref) => {
  const dimensions = sizeMappings[size];
  const finalWidth = (width ?? dimensions.width) + widthOffset;
  const finalHeight = (height ?? dimensions.height) + heightOffset;
  const finalThumbSize = (thumbSize ?? dimensions.thumbSize) + thumbSizeOffset;

  return (
    <SwitchPrimitive.Root
      className={cn(
        "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
        "w-[var(--switch-width)] h-[var(--switch-height)] bg-[var(--switch-bg)] border-[var(--switch-border)]",
        className
      )}
      style={{
        '--switch-width': `${finalWidth}px`,
        '--switch-height': `${finalHeight}px`,
        '--switch-bg': props.checked ? checkedColor : uncheckedColor,
        '--switch-border': borderColor,
      } as React.CSSProperties}
      {...props}
      ref={ref}
    >
      <SwitchPrimitive.Thumb
        className="pointer-events-none block rounded-full shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-full data-[state=unchecked]:translate-x-0 w-[var(--thumb-size)] h-[var(--thumb-size)] bg-[var(--thumb-bg)]"
        style={{
          '--thumb-size': `${finalThumbSize}px`,
          '--thumb-bg': props.checked ? checkedThumbColor : uncheckedThumbColor,
          transform: props.checked ? `translateX(calc(var(--switch-width) - var(--thumb-size)))` : 'translateX(0)',
        } as React.CSSProperties}
      />
    </SwitchPrimitive.Root>
  );
});

Switch.displayName = SwitchPrimitive.Root.displayName;

export { Switch, switchVariants };
