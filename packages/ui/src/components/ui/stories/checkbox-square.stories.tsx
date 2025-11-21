import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "../checkbox/checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "UI/Checkbox/Checkbox (square)",
  component: Checkbox,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A customizable checkbox component with square borders, accessibility, keyboard navigation, and size variants.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["sm", "default", "lg"],
      description: "Checkbox size preset",
    },
    widthOffset: {
      control: { type: "range", min: -10, max: 10, step: 1 },
      description: "Width offset from size preset",
    },
    heightOffset: {
      control: { type: "range", min: -10, max: 10, step: 1 },
      description: "Height offset from size preset",
    },
    iconSizeOffset: {
      control: { type: "range", min: -10, max: 10, step: 1 },
      description: "Icon size offset from size preset",
    },
    checked: {
      control: { type: "boolean" },
      description: "Checked state",
    },
    disabled: {
      control: { type: "boolean" },
      description: "Disabled state",
    },
    checkedColor: {
      control: { type: "color" },
      description: "Background color when checked",
    },
    uncheckedColor: {
      control: { type: "color" },
      description: "Background color when unchecked",
    },
    borderColor: {
      control: { type: "color" },
      description: "Border color",
    },
    checkedCheckmarkColor: {
      control: { type: "color" },
      description: "Checkmark color when checked",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: "default",
    widthOffset: 0,
    heightOffset: 0,
    iconSizeOffset: 0,
    checkedColor: "hsl(var(--primary))",
    uncheckedColor: "#ffffff",
    borderColor: "#479AFF",
    checkedCheckmarkColor: "hsl(var(--primary-foreground))",
    className: "rounded-none",
  },
};

export const Checked: Story = {
  args: {
    checked: true,
    size: "default",
    widthOffset: 0,
    heightOffset: 0,
    iconSizeOffset: 0,
    checkedColor: "hsl(var(--primary))",
    uncheckedColor: "#ffffff",
    borderColor: "#479AFF",
    checkedCheckmarkColor: "hsl(var(--primary-foreground))",
    className: "rounded-none",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    size: "default",
    widthOffset: 0,
    heightOffset: 0,
    iconSizeOffset: 0,
    checkedColor: "hsl(var(--primary))",
    uncheckedColor: "#ffffff",
    borderColor: "#479AFF",
    checkedCheckmarkColor: "hsl(var(--primary-foreground))",
    className: "rounded-none",
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center space-x-6">
      <Checkbox
        size="sm"
        widthOffset={0}
        heightOffset={0}
        iconSizeOffset={0}
        checkedColor="hsl(var(--primary))"
        uncheckedColor="#ffffff"
        borderColor="#479AFF"
        checkedCheckmarkColor="hsl(var(--primary-foreground))"
        className="rounded-none"
      />
      <Checkbox
        size="default"
        widthOffset={0}
        heightOffset={0}
        iconSizeOffset={0}
        checkedColor="hsl(var(--primary))"
        uncheckedColor="#ffffff"
        borderColor="#479AFF"
        checkedCheckmarkColor="hsl(var(--primary-foreground))"
        className="rounded-none"
      />
      <Checkbox
        size="lg"
        widthOffset={0}
        heightOffset={0}
        iconSizeOffset={0}
        checkedColor="hsl(var(--primary))"
        uncheckedColor="#ffffff"
        borderColor="#479AFF"
        checkedCheckmarkColor="hsl(var(--primary-foreground))"
        className="rounded-none"
      />
    </div>
  ),
};