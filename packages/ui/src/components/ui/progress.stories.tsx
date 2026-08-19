import type { Meta, StoryObj } from "@storybook/react";
import { Progress } from "./progress";

const meta: Meta<typeof Progress> = {
  title: "UI/Progress",
  component: Progress,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="w-[300px]">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["primary", "success", "warning", "destructive"],
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 70,
    max: 100,
    variant: "primary",
    size: "md",
  },
};

export const Success: Story = {
  args: {
    value: 80,
    variant: "success",
    max: 100,
    size: "md",
  },
};

export const Warning: Story = {
  args: {
    value: 50,
    variant: "warning",
    max: 100,
    size: "md",
  },
};

export const Destructive: Story = {
  args: {
    value: 30,
    variant: "destructive",
    max: 100,
    size: "md",
  },
};

export const Small: Story = {
  args: {
    value: 70,
    max: 100,
    size: "sm",
  },
};

export const Medium: Story = {
  args: {
    value: 70,
    max: 100,
    size: "md",
  },
};

export const Large: Story = {
  args: {
    value: 70,
    max: 100,
    size: "lg",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="w-[300px] space-y-4">
      <Progress value={70} variant="primary" />
      <Progress value={70} variant="success" />
      <Progress value={70} variant="warning" />
      <Progress value={70} variant="destructive" />
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="w-[300px] space-y-4">
      <Progress value={70} size="sm" />
      <Progress value={70} size="md" />
      <Progress value={70} size="lg" />
    </div>
  ),
};

export const CustomMax: Story = {
  args: {
    value: 3,
    max: 5,
  },
};
