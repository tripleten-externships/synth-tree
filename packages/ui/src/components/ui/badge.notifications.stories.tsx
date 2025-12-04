import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./badge";

const DoubleLayeredBadgesComponent = (args: any) => {
  const [hover, setHover] = useState(false);

  return (
    <div className="flex gap-4">
      <div className="inline-block">
        <div
          className="relative w-8 h-8 bg-muted rounded-full flex items-center justify-center"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{
            backgroundColor:
              hover && args.enableOuterHover ? args.outerHoverColor : undefined,
          }}
        >
          <Badge
            variant="destructive"
            className="h-5 w-5 rounded-full p-0 border-0 flex items-center justify-center text-center text-xs z-10 hover:bg-destructive"
            style={{
              backgroundColor:
                hover && args.enableInnerHover
                  ? args.innerHoverColor
                  : undefined,
            }}
          >
            3
          </Badge>
        </div>
      </div>

      <div className="inline-block">
        <div
          className="relative w-8 h-8 bg-muted rounded-full flex items-center justify-center"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{
            backgroundColor:
              hover && args.enableOuterHover ? args.outerHoverColor : undefined,
          }}
        >
          <Badge
            variant="default"
            className="h-4 w-4 rounded-full p-0 border-0 flex items-center justify-center text-center text-xs z-10 hover:bg-primary"
            style={{
              backgroundColor:
                hover && args.enableInnerHover
                  ? args.innerHoverColor
                  : undefined,
            }}
          >
            !
          </Badge>
        </div>
      </div>

      <div className="inline-block">
        <div
          className="relative w-8 h-8 bg-muted rounded-full flex items-center justify-center"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{
            backgroundColor:
              hover && args.enableOuterHover ? args.outerHoverColor : undefined,
          }}
        >
          <Badge
            variant="destructive"
            className="h-5 w-5 rounded-full p-0 border-0 flex items-center justify-center text-center text-xs z-10 hover:bg-destructive"
            style={{
              backgroundColor:
                hover && args.enableInnerHover
                  ? args.innerHoverColor
                  : undefined,
            }}
          >
            5
          </Badge>
        </div>
      </div>
    </div>
  );
};

const SingleLayeredBadgesComponent = (args: any) => {
  const [hover, setHover] = useState(false);

  return (
    <div
      className="bg-muted rounded-lg flex items-center justify-center px-2 py-1"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        backgroundColor:
          hover && args.enableBlockHover ? args.blockHoverColor : undefined,
      }}
    >
      <span
        className="text-lg"
        style={{
          color:
            hover && args.enableTextHover ? args.textHoverColor : undefined,
        }}
      >
        Messages
      </span>
    </div>
  );
};

const meta: Meta = {
  title: "UI/Badge/Notifications",
  parameters: {
    layout: "centered",
    controls: {
      sort: "alpha",
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const DoubleLayered: Story = {
  args: {
    outerHoverColor: "#3b82f6",
    enableOuterHover: false,
    innerHoverColor: "#64748b",
    enableInnerHover: false,
  },
  argTypes: {
    enableOuterHover: {
      name: "1. Enable Outer Hover",
      control: {
        type: "boolean",
        labels: {
          true: "On",
          false: "Off",
        },
      },
      description: "Toggle hover effect for outer gray circles",
    },
    outerHoverColor: {
      name: "2. Outer Hover Color",
      control: { type: "color" },
      description: "Hover color for the outer gray circles",
    },
    enableInnerHover: {
      name: "3. Enable Inner Hover",
      control: {
        type: "boolean",
        labels: {
          true: "On",
          false: "Off",
        },
      },
      description: "Toggle hover effect for inner badges",
    },
    innerHoverColor: {
      name: "4. Inner Hover Color",
      control: { type: "color" },
      description: "Hover color for the inner badges",
    },
  },
  render: (args) => <DoubleLayeredBadgesComponent {...args} />,
};

export const SingleLayered: Story = {
  args: {
    blockHoverColor: "#e5e7eb",
    enableBlockHover: false,
    textHoverColor: "#3b82f6",
    enableTextHover: false,
  },
  argTypes: {
    enableBlockHover: {
      name: "1. Enable Block Hover",
      control: {
        type: "boolean",
        labels: {
          true: "On",
          false: "Off",
        },
      },
      description: "Toggle hover effect for the block background",
    },
    blockHoverColor: {
      name: "2. Block Hover Color",
      control: { type: "color" },
      description: "Hover color for the block background",
    },
    enableTextHover: {
      name: "3. Enable Text Hover",
      control: {
        type: "boolean",
        labels: {
          true: "On",
          false: "Off",
        },
      },
      description: "Toggle hover effect for Messages text",
    },
    textHoverColor: {
      name: "4. Text Hover Color",
      control: { type: "color" },
      description: "Hover color for the Messages text",
    },
  },
  render: (args) => <SingleLayeredBadgesComponent {...args} />,
};
