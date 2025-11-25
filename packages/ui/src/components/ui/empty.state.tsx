import  React from "react";
import { cn } from "@/utils"; 
import { Button } from "./button";
import type { ReactNode, HTMLAttributes } from "react";

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
    icon?: ReactNode;
    title: string;
    description?: string;
    action?: ReactNode;
}

export function EmptyState({ icon, title, description, action, className, ...props }: EmptyStateProps) {
return (
    <div className={cn("flex flex-col items-center justify-center py-12", className)} {...props}>
     {icon && <div className="mb-4">{icon}</div>}
     <h2 className= "text-xl font-semibold mb-2">{title}</h2>
     {description && <p className= "text-muted-foreground mb-4">{description}</p>}
{action}
    </div>
);
}