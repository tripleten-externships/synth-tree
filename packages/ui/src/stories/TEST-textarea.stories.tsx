import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "../components/ui/textarea";

const meta: Meta<typeof Textarea> = {
  title: "UI/Textarea",
  component: Textarea,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A resizable textarea component with hover-to-reveal borders and desktop-style resize functionality.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: { type: "text" },
      description: "Label text displayed above the textarea",
      table: { category: "Text" },
      placeholder: "Label (e.g. Notes)",
    },
    title: {
      control: { type: "text" },
      description: "Title text displayed in the header section",
      table: { category: "Text" },
      placeholder: "Title (e.g. Instructions)",
    },
    initialWidth: {
      control: { type: "range", min: 200, max: 800, step: 10 },
      description: "Initial width of the textarea",
    },
    initialHeight: {
      control: { type: "range", min: 120, max: 600, step: 10 },
      description: "Initial height of the textarea",
    },
    minWidth: {
      control: { type: "range", min: 100, max: 400, step: 10 },
      description: "Minimum width constraint",
    },
    minHeight: {
      control: { type: "range", min: 60, max: 200, step: 10 },
      description: "Minimum height constraint",
    },
    maxWidth: {
      control: { type: "range", min: 400, max: 1200, step: 10 },
      description: "Maximum width constraint",
    },
    maxHeight: {
      control: { type: "range", min: 300, max: 800, step: 10 },
      description: "Maximum height constraint",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Plain resizable textarea with hover-to-reveal borders.
 * Hover over the edges to see resize cursors and border indicators.
 */
export const Default: Story = {
  args: {
    label: "Label", // Always provide label for accessibility
    textarea: "",
    initialWidth: 400,
    initialHeight: 200,
    minWidth: 200,
    minHeight: 120,
    maxWidth: 800,
    maxHeight: 600,
    placeholder:
      "Type your text here...\n\nMouse controls:\n• Click & drag textarea: Move position\n• Click & drag label: Reposition label\n• Drag resize handles: Resize textarea\n• Scroll wheel on label: Adjust distance\n\nKeyboard controls:\n• Ctrl+Arrows: Resize textarea\n• Shift+Arrows: Move textarea\n• Ctrl+Shift+Arrows: Move label\n• PageUp/PageDown: Adjust label distance",
    "aria-label": "Text input area for notes and instructions",
    "aria-labelledby": "synth-textarea-label",
    title: "Text input area for notes and instructions",
    id: "synth-textarea",
    role: "presentation",
  },
};

/**
 * Variant: With only label (no title)
 */
export const WithLabelOnly: Story = {
  args: {
    label: "Label",
    textarea: "",
    initialWidth: 400,
    initialHeight: 200,
    minWidth: 200,
    minHeight: 120,
    maxWidth: 800,
    maxHeight: 600,
    placeholder: "Type your text here...",
    "aria-label": "Text input area for notes",
    "aria-labelledby": "synth-textarea-label",
    title: "Text input area for notes",
    id: "synth-textarea",
    role: "presentation",
  },
};

/**
 * Variant: With only title (no label)
 */
export const WithTitleOnly: Story = {
  args: {
    title: "Text input area for instructions",
    textarea: "",
    initialWidth: 400,
    initialHeight: 200,
    minWidth: 200,
    minHeight: 120,
    maxWidth: 800,
    maxHeight: 600,
    placeholder: "Type your text here...",
    "aria-label": "Text input area for instructions",
    id: "synth-textarea",
    role: "presentation",
  },
};

/**
 * Variant: With only placeholder (no label or title)
 */
export const WithPlaceholderOnly: Story = {
  args: {
    textarea: "",
    initialWidth: 400,
    initialHeight: 200,
    minWidth: 200,
    minHeight: 120,
    maxWidth: 800,
    maxHeight: 600,
    placeholder: "Type your text here...",
    "aria-label": "Text input area",
    title: "Text input area",
    id: "synth-textarea",
    role: "presentation",
  },
};
