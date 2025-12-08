import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { NextButton } from "./nextButton";

const meta: Meta<typeof NextButton> = {
  title: "UI/NextButton",
  component: NextButton,
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
    children: { control: "text" },
    className: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof NextButton>;

export const Default: Story = {
  args: {
    children: "Next Lesson",
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    children: "Next Lesson",
    disabled: true,
  },
};

export const CustomText: Story = {
  args: {
    children: "Continue learning",
    disabled: false,
  },
};
