import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils";

/**
 * Textarea variants: class-variance-authority
 * Size, resize, + state variants w/ styling
 */
const textareaVariants = cva(
  // Base styles - consistent with existing input component patterns
  "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  {
    variants: {
      // Size variants - compact/default/large contexts
      size: {
        sm: "min-h-[60px] px-2 py-1 text-sm",
        default: "min-h-[80px] px-3 py-2",
        lg: "min-h-[120px] px-4 py-3 text-lg md:text-base",
      },
      // Resize options - user resize control
      resize: {
        none: "resize-none",
        vertical: "resize-y",
        horizontal: "resize-x",
        both: "resize",
      },
      // State variants - validation feedback
      state: {
        default: "",
        error: "border-destructive focus-visible:ring-destructive",
        success: "border-success focus-visible:ring-success",
      },
    },
    defaultVariants: {
      size: "default",
      resize: "vertical",
      state: "default",
    },
  }
);

/**
 * Textarea Props: HTML textarea + variant options
 */
export interface TextareaProps
  extends React.ComponentProps<"textarea">,
    VariantProps<typeof textareaVariants> {}

/**
 * Textarea Component - ST-34
 *
 * Customizable textarea: size, resize, + state variants
 * - ForwardRef = react-hook-form
 * - Theme tokens
 * - HTML textarea attributes
 * - Use focus states + ARIA support
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, size, resize, state, ...props }, ref) => {
    return (
      <textarea
        className={cn(textareaVariants({ size, resize, state }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea, textareaVariants };
