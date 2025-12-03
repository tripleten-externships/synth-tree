import * as React from "react";
import {cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils";

const skeletonVariants = cva(
    "",
    {
        variants: {
            shape: {
                rectangle: "",
                circle: "rounded-full",
                rounded: "rounded-lg",
                hexagon: "hexagon-class w-16 h-16"
            }
        },
        defaultVariants: {
            shape: "rectangle"
        }
    }
);

// Inject hexagon CSS class once (client-side only)
if (typeof window !== "undefined") {
    if (!document.getElementById("skeleton-hexagon-style")) {
        const style = document.createElement("style");
        style.id = "skeleton-hexagon-style";
        style.innerHTML = `
            .hexagon-class {
                clip-path: polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%);
                border-radius: 8px; /* fallback for browsers that don't support clip-path */
                background-color: #BABABA;
                display: inline-block;
                width: 100px;
                height: 89px;
                opacity: 1;
                box-shadow: 0px -4px 2px 0px #00000040 inset;
                transform: rotate(0deg);
            }
        `;
        document.head.appendChild(style);
    }
}


export interface SkeletonProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof skeletonVariants> {
    animate?: boolean;
}


const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
    ({ className, shape, animate, ...props }, ref) => {
        // If hexagon, ensure width/height are set unless overridden
        const isHexagon = shape === "hexagon";
        const baseStyle = { 
            backgroundColor: "#BABABA",
            border: "none",
            outline: "none"
        };
        const hexagonStyle = isHexagon ? { width: "100px", height: "89px", opacity: 1 } : {};
        const finalStyle = { ...baseStyle, ...hexagonStyle, ...props.style };
        
        return (
            <div
                ref={ref}
                className={cn(skeletonVariants({ shape }), className)}
                style={finalStyle}
                {...props}
            />
        );
    }
);

Skeleton.displayName = "Skeleton";

export {Skeleton, skeletonVariants} ; 

