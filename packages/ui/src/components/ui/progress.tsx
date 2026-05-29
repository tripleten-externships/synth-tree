import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils";

const progressVariants = cva(
  "relative w-full overflow-hidden rounded-full bg-secondary",
  {
    variants: {
      variant: {
        primary: "",
        success: "",
        warning: "",
        destructive: "",
      },
      size: {
        sm: "h-1",
        md: "h-1.5",
        lg: "h-2.5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

const indicatorVariants = cva("h-full transition-all duration-300", {
  variants: {
    variant: {
      primary: "bg-primary",
      success: "bg-success",
      warning: "bg-warning",
      destructive: "bg-destructive",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

export interface ProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressVariants> {
  value: number;
  max?: number;
}

export function Progress({
  value,
  max = 100,
  variant,
  size,
  className,
  ...props
}: ProgressProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={cn(progressVariants({ variant, size, className }))}
      {...props}
    >
      <div
        className={cn(indicatorVariants({ variant }))}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

export default Progress;
