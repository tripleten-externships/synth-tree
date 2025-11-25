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
        ]
    },
   animate: {
    control: { type: "boolean" },
   },
   className: {
    control: { type: "text"},
   },
},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Rectangle: Story = { args:{ shape: "rectangle", className: "w-32 h-6"} };
export const Circle: Story = { args: { shape: "circle", className: "w-12 h-12" } };
export const Rounded: Story = { args: { shape: "rounded", className: "w-32 h-6" } };
export const Animated: Story = { args: { shape: "rectangle", animate: true, className: "w-32 h-6" } };
export const Static: Story = { args: { shape: "rectangle", animate: false, className: "w-32 h-6" } };