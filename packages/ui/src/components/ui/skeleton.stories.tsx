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
        "rounded"
        ],
        description: "Shape of the skeleton"
    },
   animate: {
    control: { type: "boolean" },
    description: "Toggle animation on/off"
   },
   className: {
    control: { type: "text"},
    description: "Custom Tailwind classes for dimensions (e.g., 'w-32 h-6')"
   },
},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Rectangle: Story = { 
  args:{ shape: "rectangle", animate: true, className: "w-32 h-6"} 
};

export const Circle: Story = { 
  args: { shape: "circle", animate: true, className: "w-12 h-12" } 
};

export const Rounded: Story = { 
  args: { shape: "rounded", animate: true, className: "w-32 h-6" } 
};

export const AnimatedOn: Story = { 
  args: { shape: "rectangle", animate: true, className: "w-32 h-6" },
  name: "Animation On"
};

export const AnimatedOff: Story = { 
  args: { shape: "rectangle", animate: false, className: "w-32 h-6" },
  name: "Animation Off"
};