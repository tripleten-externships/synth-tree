import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "../checkbox/checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "UI/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A customizable checkbox component with accessibility, keyboard navigation, and size variants.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["sm", "default", "lg"],
      description: "Checkbox size variant",
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
      <Checkbox size="sm" />
      <Checkbox size="default" />
      <Checkbox size="lg" />
    </div>
  ),
};
