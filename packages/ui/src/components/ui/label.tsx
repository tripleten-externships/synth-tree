import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils";

/**
 * Label component variants using class-variance-authority
 * Base styling for form labels with theme tokens
 */
const labelVariants = cva(
  // Base styles - accessible and consistent with form components
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);

/**
 * Label Component - ST-34 Support Component
 *
 * Radix UI primitives Label component
 * - Form labeling
 * - Disabled states peer styling
 * - Theme typography tokens
 * - forwardRef = form library
 */
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
