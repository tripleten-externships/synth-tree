import * as React from "react";
import {cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils";

const skeletonVariants = cva(
    "bg-muted",
{
    variants: {
    shape: {
rectangle:"",
circle: "rounded-full",
rounded: "rounded-lg"
    },
    animate: {
      true: "animate-pulse",
      false: ""
    }
    },
defaultVariants:{
    shape: "rectangle",
    animate: true
    }
}
);


export interface SkeletonProps
extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof skeletonVariants> {
animate?: boolean;
        }


const Skeleton = React.forwardRef<HTMLDivElement,SkeletonProps>(
    ({ className, shape, animate = true, ...props }, ref) => {
return (
 <div ref={ref}
      className={cn(skeletonVariants({ shape, animate }), className)}
       {...props}
   />
     );
             
    }
);

Skeleton.displayName = "Skeleton";

export {Skeleton, skeletonVariants} ; 

