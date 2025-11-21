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
      description: "Switch size variant",
    },
    checked: {
      control: { type: "boolean" },
      description: "Checked state",
    },
    disabled: {
      control: { type: "boolean" },
      description: "Disabled state",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center space-x-6">
      <Switch size="sm" />
      <Switch size="default" />
      <Switch size="lg" />
    </div>
  ),
};
