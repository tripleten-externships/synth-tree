import type { Meta, StoryObj } from "@storybook/react";

import { Icon, ICON_NAMES } from "./icon";

const meta: Meta<typeof Icon> = {
  title: "UI/Icon",
  component: Icon,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-6 gap-4 p-6 bg-white text-black rounded-md">
      {ICON_NAMES.map((name) => (
        <div key={name} className="flex flex-col items-center gap-2">
          <Icon name={name} size={18} />
          <span className="text-[11px] font-mono text-black/80">{name}</span>
        </div>
      ))}
    </div>
  ),
};
