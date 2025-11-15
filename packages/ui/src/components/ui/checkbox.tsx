import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils";

/**
 * Checkbox variants: sizing + base styling
 */
const checkboxVariants = cva(
  // Base styles, theme tokens, + accessibility features
  "peer shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
  {
    variants: {
      // Size variants for different contexts
      size: {
        sm: "h-3 w-3",
        default: "h-4 w-4",
        lg: "h-5 w-5",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

/**
 * Checkbox indicator icon variants
 * Check icon scales to checkbox size
 */
const checkboxIconVariants = cva(
  "flex items-center justify-center text-current",
  {
    variants: {
      size: {
        sm: "h-2.5 w-2.5",
        default: "h-3.5 w-3.5",
        lg: "h-4 w-4",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

/**
 * Checkbox Props: Radix + size variant
 */
export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
    VariantProps<typeof checkboxVariants> {}

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
const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, size, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(checkboxVariants({ size }), className)}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cn(checkboxIconVariants({ size }))}>
      <Check className="h-full w-full" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));

Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox, checkboxVariants };
