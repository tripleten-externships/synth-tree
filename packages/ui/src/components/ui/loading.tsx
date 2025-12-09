import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {Loader2} from "lucide-react";
import { cn } from "@/utils";

const loadingVariants = cva(
"animate-spin", //classes get variants
{
 variants: {
size: {
xs: "w-3 h-3",
sm:"w-4 h-4",
md:"w-6 h-6",
lg:"w-8 h-8",
xl:"w-12 h-12"
},
variant:{
default: "text-primary",
muted: "text-muted-foreground",
destructive: "text-destructive",
success: "text-success",
warning: "text-warning"
    }
 },
  defaultVariants:{
    size:"md",
    variant:"default"
  }
}
);


export interface LoadingProps
extends React.HTMLAttributes<HTMLDivElement>, //all html props
        VariantProps<typeof loadingVariants> {
            //customs props later?
show?: boolean;
overlay?:boolean;
fullscreen?: boolean;
text?: string;

        }



const Loading = React.forwardRef<HTMLDivElement,LoadingProps>(
       ({ className, size, variant, show, overlay, fullscreen, text, ...props}, ref) => {
        if (show === false) return null;

       return (
      <div ref={ref}
      className={cn(
fullscreen && "fixed inset-0 z-50 flex items-center justify-center",
overlay && "fixed inset-0 bg-black/50 flex items-center justify-center",
className)}
       {...props}>
      <Loader2 className={cn(loadingVariants({ size, variant, className }))} />
      {text && <p className= "mt-2 text-sm">{text}</p>}
      </div>
       );
         }    
       );
       
Loading.displayName = "Loading";

export {Loading, loadingVariants} ; 

