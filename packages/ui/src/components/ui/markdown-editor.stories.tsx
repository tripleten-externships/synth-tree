import React from "react";
import type { Meta, StoryObj } from "@storybook/react/*";

import { MarkdownEditor } from "./markdown-editor";

const meta: Meta<typeof MarkdownEditor> = {
  title: "UI/MarkdownEditor",
  component: MarkdownEditor,
  parameters: {
    layout: "padded",
    controls: {
      exclude: ["value", "onChange"],
    },
    a11y: {
      disable: true,
    },
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

const starter = `# Lesson Title

Write content in **Markdown**.

## Topics
- Lists
- Links
- Code

Inline code: \`const x = 1\`

\`\`\`
function add(a, b) {
 return a + b;
}
\`\`\`

[Open docs](https://example.com)
`;

function SplitHarness() {
  const [value, setValue] = React.useState(starter);

  return (
    <div className="max-w-6xl">
      <MarkdownEditor value={value} onChange={setValue} previewMode="split" />
    </div>
  );
}

function ToggleHarness() {
  const [value, setValue] = React.useState(starter);

  return (
    <div className="max-w-6xl">
      <MarkdownEditor value={value} onChange={setValue} previewMode="toggle" />
    </div>
  );
}

function XssHarness() {
  const [value, setValue] = React.useState(
    `# Sanitization demo

<script>alert("blocked")</script>

<img src="https://example.com/x.png" onerror="alert('blocked')" />

[bad link](javascript:alert("blocked"))
    `,
  );

  return (
    <div className="max-w-6xl">
      <MarkdownEditor value={value} onChange={setValue} previewMode="split" />
    </div>
  );
}

export const SplitView: Story = {
  render: () => <SplitHarness />,
};

export const ToggleView: Story = {
  render: () => <ToggleHarness />,
};

export const XssAttempt: Story = {
  render: () => <XssHarness />,
};
