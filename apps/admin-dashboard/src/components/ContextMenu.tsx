import React from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Button } from "@skilltree/ui";
import { FiMoreHorizontal } from "react-icons/fi";


// Defines object structure for menu items
interface MenuItem {
    label: string;
    icon?: React.ComponentType<any>;
    onClick: () => void;
    variant?: "default" | "destructive";
}

// Allows use of props to pass in menu items
interface ContextMenuProps {
    items: MenuItem[];
}

// Renders a dropdown menu when clicking a kebab button
const ContextMenu = ({ items }: ContextMenuProps) => {
    return (
        <DropdownMenu modal={false}>
            {/* Trigger button to open the dropdown menu */}
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="More options" className="w-8 h-8 hover:bg-transparent focus-visible:outline-none text-[rgba(33,33,33,0.5)] dark:text-[rgba(255,255,255,0.5)] dark:hover:text-accent-foreground">
                    <FiMoreHorizontal className="w-8 h-8"/> 
                </Button>
            </DropdownMenuTrigger>
            {/* Dropdown menu content */}
            <DropdownMenuContent
                alignOffset={-8}
                side="bottom" 
                align="start" 
                className="w-129 bg-white border-[1px] border-[rgba(0,0,0,0.1)] shadow-[0px_2px_8px_0px_rgba(0,0,0,0.1)] rounded-[8px] overflow-hidden data-[state=open]:animate-[fade-in_120ms_ease-out] data-[state=closed]:animate-[fade-out_120ms_ease-in]"
            >
                {/* Render each menu item */}
                {items.map((item, index) => (
                    <DropdownMenuItem 
                        key={index} 
                        onClick={item.onClick} 
                        className={`flex items-center px-[16px] py-3 sm:py-[10px] min-h-[44px] sm:min-h-[0px] text-[14px] cursor-pointer focus:outline-none ${
                            item.variant === "destructive" 
                                ? "text-red-600 hover:bg-red-50 focus:bg-red-50" 
                                : "text-black hover:bg-gray-100 focus:bg-gray-100"
                        }`}
                    >
                        <div className="flex items-center">
                            {/* Optional icon */}
                            {item.icon && <item.icon className="mr-2 h-4 w-4" />} 
                            {/* Menu item label */}
                            <div className="leading-none mb-[1px]">{item.label}</div> 
                        </div>
                    </DropdownMenuItem>
                ))} 
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default ContextMenu;