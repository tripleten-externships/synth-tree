import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils";

const logoVariants = cva("inline-block", {
  variants: {
    size: {
      xs: "h-6",
      sm: "h-8",
      md: "h-10",
      lg: "h-12",
      xl: "h-16",
    },
    variant: {
      default: "text-foreground",
      white: "text-white",
      dark: "text-black",
      muted: "text-muted-foreground",
    },
  },
  defaultVariants: {
    size: "md",
    variant: "default",
  },
});

export interface LogoProps
  extends React.SVGProps<SVGSVGElement>,
    VariantProps<typeof logoVariants> {
  /**
   * Custom height for the logo. Overrides size variant when provided.
   */
  height?: string | number;
  /**
   * Custom width for the logo. When not provided, width is calculated automatically based on aspect ratio.
   */
  width?: string | number;
}

const Logo = React.forwardRef<SVGSVGElement, LogoProps>(
  ({ className, size, variant, height, width, ...props }, ref) => {
    // Calculate dimensions
    const logoHeight =
      height ||
      (size === "xs"
        ? 24
        : size === "sm"
        ? 32
        : size === "md"
        ? 40
        : size === "lg"
        ? 48
        : 64);
    const logoWidth = width || undefined; // Let SVG maintain aspect ratio if width not specified

    return (
      <svg
        ref={ref}
        className={cn(
          logoVariants({ size: height ? undefined : size, variant }),
          className
        )}
        height={logoHeight}
        width={logoWidth}
        viewBox="0 0 688 155"
        role="img"
        aria-label="SkillTree Logo"
        {...props}
      >
        <g>
          <path
            d="M229.1,44.2h0.8V45v7.2V53h-0.8h-21.9v57v0.8h-0.8h-8.5h-0.8V110V53h-22h-0.8v-0.8V45v-0.8h0.8H229.1z M293.2,85.9v24.7
h-10V84.9h-31.8v25.7h-10.1V44.1h25.2c13.1,0,26.5,2.2,26.5,18.6c0,7.6-2.7,12.9-8,15.6h0.6l0,0C290.6,78.3,293.2,80.9,293.2,85.9z
 M283.1,64.6c0-10.5-5.3-11.7-16.6-11.7h-15.2v23.3h15.2C278,76.2,283.1,74.6,283.1,64.6z M367.9,109.7l0.3,1h-10.5l-0.2-0.5
l-8.4-24.4h-24.4l-8.5,24.4l-0.2,0.5h-10.5l0.3-1l22.6-65l0.2-0.5H345l0.2,0.5L367.9,109.7z M346.1,77L337,50.4L327.7,77H346.1z
 M412.9,43.9h-0.5l-0.2,0.4L393.6,78l-18.5-33.7l-0.2-0.4h-0.5h-9h-1.3l0.7,1.1L386,82.6l0.2,0.4h0.5h2v26.6v0.8h0.8h8.4h0.8v-0.8
V83h2.1h0.5l0.2-0.4L422.6,45l0.7-1.1H422H412.9z M436.7,43.9h-0.8v0.8v65v0.8h0.8h45.9h0.8v-0.8v-7.2v-0.8h-0.8H446V81.4h32h0.8
v-0.8v-7v-0.8H478h-32V52.6h36.6h0.8v-0.8v-7.2v-0.8h-0.8h-45.9V43.9z M526.6,51.9L526.6,51.9c12-0.1,19.4,6.4,20.9,18.1l0.1,0.7
h10.1l-0.1-0.9C555.5,53,543.9,43,526.6,43c-19.2,0-32.1,13.7-32.1,34.2s12.9,34.3,32.1,34.3c17.3,0,28.9-10,31-26.8l0.1-0.9h-10.1
l-0.1,0.7c-1.5,11.8-8.9,18.2-20.9,18.2c-13.7,0-21.9-9.5-21.9-25.5C504.7,61.3,512.8,51.9,526.6,51.9z M564.2,44.2h-0.8V45v7.2V53
h0.8h22v57v0.8h0.8h8.5h0.8V110V53h21.9h0.8v-0.8V45v-0.8h-0.8H564.2z M688,77.4c0,20.5-12.8,34.3-31.9,34.3
c-19.1,0-32-13.8-32-34.3s12.9-34.2,32-34.2C675.2,43.1,688,56.9,688,77.4z M677.9,77.4c0-15.9-8.1-25.4-21.8-25.4
s-21.8,9.4-21.8,25.4s8.1,25.5,21.8,25.5C669.8,102.9,677.9,93.3,677.9,77.4z"
            fill="currentColor"
          />
          <path
            d="M82,92.6l-40.9,20.6c-0.6,0.3-1.3,0.3-1.9,0.1L8.4,101.4c-0.6-0.2-0.7-1.1-0.1-1.4l41.2-20.6c0.6-0.3,1.3-0.3,1.9-0.1
l30.5,11.9l0,0C82.6,91.4,82.6,92.3,82,92.6z M116.3,0.1L1.3,57.6C0.5,58,0,58.8,0,59.7v32.8c0,0.6,0.6,0.9,1.1,0.7l48.7-24.5
l0.1,0.1l66.2-33.1c0.8-0.4,1.3-1.2,1.3-2.1V0.8C117.4,0.2,116.8-0.2,116.3,0.1z M89.4,99.5L48.3,120c-0.8,0.4-1.3,1.2-1.3,2.1
l0.1,31.8c0,0.6,0.6,0.9,1.1,0.7l41.1-19.9c0.8-0.4,1.3-1.2,1.3-2.1l-0.1-32.4C90.6,99.6,90,99.2,89.4,99.5z"
            fill="currentColor"
          />
        </g>
      </svg>
    );
  }
);

Logo.displayName = "Logo";

export { Logo, logoVariants };
