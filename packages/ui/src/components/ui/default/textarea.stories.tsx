import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "../textarea";

const meta: Meta<typeof Textarea> = {
  title: "UI/Default/Label with Title and Textarea",
  component: Textarea,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A resizable textarea component with a label and title, under the Default section.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: "text",
      description: "Label text displayed above the textarea",
      defaultValue: "Label",
    },
    title: {
      control: "text",
      description: "Title text displayed in the header section",
      defaultValue: "Title",
    },
    initialWidth: {
      control: { type: "range", min: 200, max: 800, step: 10 },
      description: "Initial width of the textarea",
      defaultValue: 400,
    },
    initialHeight: {
      control: { type: "range", min: 120, max: 600, step: 10 },
      description: "Initial height of the textarea",
      defaultValue: 200,
    },
    minWidth: {
      control: { type: "range", min: 100, max: 400, step: 10 },
      description: "Minimum width constraint",
      defaultValue: 200,
    },
    minHeight: {
      control: { type: "range", min: 60, max: 200, step: 10 },
      description: "Minimum height constraint",
      defaultValue: 120,
    },
    maxWidth: {
      control: { type: "range", min: 400, max: 1200, step: 10 },
      description: "Maximum width constraint",
      defaultValue: 800,
    },
    maxHeight: {
      control: { type: "range", min: 300, max: 800, step: 10 },
      description: "Maximum height constraint",
      defaultValue: 600,
    },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Label",
    title: "Title",
    initialWidth: 400,
    initialHeight: 200,
    minWidth: 200,
    minHeight: 120,
    maxWidth: 800,
    maxHeight: 600,
  },
};
