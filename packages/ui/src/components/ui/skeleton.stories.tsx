import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton } from "./skeleton";



const meta: Meta<typeof Skeleton> = {
title: "Skeleton",
component: Skeleton,
parameters: {
    layout: "centered",
},
tags: ["autodocs"],
argTypes: {
    shape: {
        control:{ type: "select"},
        options: [
            "rectangle",
            "circle",
            "rounded",
            "hexagon"
        ]
    },
   className: {
    control: { type: "text"},
   },
},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Rectangle: Story = { 
    args: { shape: "rectangle", className: "w-32 h-6" } 
};

export const Circle: Story = { 
    args: { shape: "circle", className: "w-12 h-12" } 
};

export const Rounded: Story = { 
    args: { shape: "rounded", className: "w-32 h-6" } 
};

export const Hexagon: Story = {
    args: { shape: "hexagon" }
};

export const AllShapes: Story = {
    render: () => (
        <div className="space-y-6 p-4">
            <div>
                <h3 className="text-sm font-medium mb-3 text-gray-600">Individual Shapes</h3>
                <div className="flex items-center gap-4">
                    <div className="text-center">
                        <Skeleton shape="rectangle" className="w-32 h-6 mb-2" />
                        <span className="text-xs text-gray-500">Rectangle</span>
                    </div>
                    <div className="text-center">
                        <Skeleton shape="circle" className="w-12 h-12 mb-2" />
                        <span className="text-xs text-gray-500">Circle</span>
                    </div>
                    <div className="text-center">
                        <Skeleton shape="rounded" className="w-24 h-8 mb-2" />
                        <span className="text-xs text-gray-500">Rounded</span>
                    </div>
                    <div className="text-center">
                        <Skeleton shape="hexagon" className="mb-2" />
                        <span className="text-xs text-gray-500">Hexagon</span>
                    </div>
                </div>
            </div>
        </div>
    ),
    parameters: {
        layout: "fullscreen"
    }
};