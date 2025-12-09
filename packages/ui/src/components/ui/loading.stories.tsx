
import React from "react";
import type {Meta, StoryObj} from "@storybook/react";
import { Loading } from "./loading";

const meta: Meta<typeof Loading> = {
title: "UI/Loading Icon",
component: Loading,
parameters:{
    layout: "centered"
}, 
tags:["autodocs"],
 argTypes: {
   variant: {
    control: { type: "select"},
options: [
"default",
"muted" ,
"destructive",
"success",
"warning",
],
    },
size: {
control: { type: "select" },
options: ["default", "xs","sm","md", "lg", "xl", ]
},
show:{
control:{ type:"boolean"}
},
overlay:{
control:{ type:"boolean"}
},
fullscreen:{
control:{ type: "boolean"}
},
text:{
    control:{ type: "text"}
},
 },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
args: {
    text: "Loading data..."
},
};
export const Muted: Story = {
args: {
    variant: "muted",
    text: "Loading..."
},
};



export const Destructive: Story = {
  args:  {
    variant: "destructive",
text: "deleting..."


},
};
export const Success: Story = {
args:{
    variant: "success"
},
};
export const Warning: Story = {
args: {
    variant: "warning",
},
};
export const AllVariants: Story = {
  render: () => (
   <div className="flex flex-wrap gap-4">
      <Loading variant="default" text="Default" />
      <Loading variant="muted" text="Muted" />
      <Loading variant="destructive" text="Destructive" />
      <Loading variant="success" text="Success" />
      <Loading variant="warning" text="Warning" />
    </div>
  ),
};
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Loading size="xs" text = "Extra small"/>
      <Loading size="sm" text = "small"/>
      <Loading size="md" text = "Medium" />
      <Loading size="lg" text = "Large" />
      <Loading size="xl" text = "Extra Large" />
    </div>
  ),
};
