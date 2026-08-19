import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../button";
import { IconSelectorPopover } from "./icon-selector-popover";
import type { IconId } from "./icon-options";

const meta: Meta<typeof IconSelectorPopover> = {
  title: "UI/IconSelectorPopover",
  component: IconSelectorPopover,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = React.useState<IconId | null>(null);

    return (
      <div className="flex gap-4 items-center">
        <IconSelectorPopover value={value} onSelect={setValue}>
          <div
            className="relative w-24 h-24 bg-[hsl(218_90%_65%)]
            [clip-path:polygon(25%_10%,_75%_10%,_100%_50%,_75%_90%,_25%_90%,_0%_50%)]"
          >
            <Button
              className="
                bg-transparent
                hover:bg-transparent active:bg-transparent focus:bg-transparent
                rounded-none shadow-none
                focus-visible:ring-0
            "
              type="button"
              variant="ghost"
            >
              <div className="absolute top-5 left-8 text-white text-5xl font-thin">
                +
              </div>
            </Button>
          </div>
        </IconSelectorPopover>

        <p className="text-sm">
          Selected: <span className="font-mono">{value ?? "none"}</span>
        </p>
      </div>
    );
  },
};
