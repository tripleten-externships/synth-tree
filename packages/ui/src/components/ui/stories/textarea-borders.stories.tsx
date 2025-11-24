import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "../textarea";

const meta: Meta<typeof Textarea> = {
  title: "UI/Text Area/Label with Title and Textarea (with borders)",
  component: Textarea,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A resizable textarea component with a label and title, with borders, under the Text Area section.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    label: "Label",
    title: "Title",
    textarea:
      "Type your text here...\n\nMouse controls:\n• Click & drag textarea: Move position\n• Click & drag label: Reposition label\n• Drag resize handles: Resize textarea\n• Scroll wheel on label: Adjust distance",
    initialWidth: 400,
    initialHeight: 200,
    minWidth: 200,
    minHeight: 120,
    maxWidth: 800,
    maxHeight: 600,
  },
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
    textarea: {
      control: "text",
      description: "Textarea value/content (controlled or custom section)",
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
};

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
    containerClassName: "border border-border rounded-xl",
  },
};

export const TitleAndTextarea: Story = {
  name: "Title and Textarea",
  args: {
    label: "",
    title: "Title",
    initialWidth: 400,
    initialHeight: 200,
    minWidth: 200,
    minHeight: 120,
    maxWidth: 800,
    maxHeight: 600,
    containerClassName: "border border-border rounded-xl",
  },
  argTypes: {
    label: { table: { disable: true }, control: false },
  },
};

export const LabelAndTextarea: Story = {
  name: "Label and Textarea",
  args: {
    label: "Label",
    title: "",
    initialWidth: 400,
    initialHeight: 200,
    minWidth: 200,
    minHeight: 120,
    maxWidth: 800,
    maxHeight: 600,
    containerClassName: "border border-border rounded-xl",
  },
  argTypes: {
    title: { table: { disable: true }, control: false },
  },
};

export const TextareaOnly: Story = {
  name: "Textarea",
  args: {
    label: "",
    title: "",
    initialWidth: 400,
    initialHeight: 200,
    minWidth: 200,
    minHeight: 120,
    maxWidth: 800,
    maxHeight: 600,
    containerClassName: "border border-border rounded-xl",
  },
  argTypes: {
    label: { table: { disable: true }, control: false },
    title: { table: { disable: true }, control: false },
  },
};
