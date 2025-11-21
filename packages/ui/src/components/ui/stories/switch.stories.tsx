import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "../switch/switch";

const meta: Meta<typeof Switch> = {
  title: "UI/Switch",
  component: Switch,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A customizable switch/toggle component with accessibility, keyboard navigation, and size variants.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["sm", "default", "lg"],
      description: "Switch size preset",
    },
    widthOffset: {
      control: { type: "range", min: -20, max: 20, step: 1 },
      description: "Width offset from size preset",
    },
    heightOffset: {
      control: { type: "range", min: -10, max: 10, step: 1 },
      description: "Height offset from size preset",
    },
    thumbSizeOffset: {
      control: { type: "range", min: -10, max: 10, step: 1 },
      description: "Thumb size offset from size preset",
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
    checkedThumbColor: {
      control: { type: "color" },
      description: "Thumb color when checked",
    },
    uncheckedThumbColor: {
      control: { type: "color" },
      description: "Thumb color when unchecked",
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
    thumbSizeOffset: 0,
    checkedColor: "hsl(var(--primary))",
    uncheckedColor: "hsl(var(--muted))",
    borderColor: "hsl(var(--border))",
    checkedThumbColor: "hsl(var(--primary-foreground))",
    uncheckedThumbColor: "hsl(var(--muted-foreground))",
  },
};

export const Checked: Story = {
  args: {
    checked: true,
    size: "default",
    widthOffset: 0,
    heightOffset: 0,
    thumbSizeOffset: 0,
    checkedColor: "hsl(var(--primary))",
    uncheckedColor: "hsl(var(--muted))",
    borderColor: "hsl(var(--border))",
    checkedThumbColor: "hsl(var(--primary-foreground))",
    uncheckedThumbColor: "hsl(var(--muted-foreground))",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    size: "default",
    widthOffset: 0,
    heightOffset: 0,
    thumbSizeOffset: 0,
    checkedColor: "hsl(var(--primary))",
    uncheckedColor: "hsl(var(--muted))",
    borderColor: "hsl(var(--border))",
    checkedThumbColor: "hsl(var(--primary-foreground))",
    uncheckedThumbColor: "hsl(var(--muted-foreground))",
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center space-x-6">
      <Switch
        size="sm"
        widthOffset={0}
        heightOffset={0}
        thumbSizeOffset={0}
        checkedColor="hsl(var(--primary))"
        uncheckedColor="hsl(var(--muted))"
        borderColor="hsl(var(--border))"
        checkedThumbColor="hsl(var(--primary-foreground))"
        uncheckedThumbColor="hsl(var(--muted-foreground))"
      />
      <Switch
        size="default"
        widthOffset={0}
        heightOffset={0}
        thumbSizeOffset={0}
        checkedColor="hsl(var(--primary))"
        uncheckedColor="hsl(var(--muted))"
        borderColor="hsl(var(--border))"
        checkedThumbColor="hsl(var(--primary-foreground))"
        uncheckedThumbColor="hsl(var(--muted-foreground))"
      />
      <Switch
        size="lg"
        widthOffset={0}
        heightOffset={0}
        thumbSizeOffset={0}
        checkedColor="hsl(var(--primary))"
        uncheckedColor="hsl(var(--muted))"
        borderColor="hsl(var(--border))"
        checkedThumbColor="hsl(var(--primary-foreground))"
        uncheckedThumbColor="hsl(var(--muted-foreground))"
      />
    </div>
  ),
};
