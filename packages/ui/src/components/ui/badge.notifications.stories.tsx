import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./badge";

const NotificationBadgesComponent = (args: any) => {
  const count = args.messageCount;
  const showBadge = count > 0;
  const badgeContent = count > 9 ? "!" : count.toString();
  const badgeVariant = count > 9 ? "default" : "destructive";
  const badgeHoverClass =
    count > 9 ? "hover:bg-primary" : "hover:bg-destructive";
  const badgeSize = count > 9 ? "h-4 w-4" : "h-5 w-5";
  const spanText =
    count === 0 ? "No New Messages" : count === 1 ? "Message" : "Messages";

  return (
    <div className="w-full">
      <div className="relative bg-muted rounded-lg flex items-center justify-end px-2 py-1">
        <div className="flex items-center gap-2 cursor-pointer">
          {showBadge && (
            <div className="relative inline-block">
              <Badge
                variant={badgeVariant}
                className={`${badgeSize} rounded-full p-0 border-0 flex items-center justify-center text-center text-xs z-10 ${badgeHoverClass}`}
                style={{
                  backgroundColor: args.enableTextHover
                    ? args.textHoverColor
                    : undefined,
                }}
              >
                {badgeContent}
              </Badge>
            </div>
          )}

          <span
            className="text-lg"
            style={{
              color: args.enableTextHover ? args.textHoverColor : undefined,
            }}
          >
            {spanText}
          </span>
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
  title: "UI/Badge/Notification Badges",
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

export const NotificationBadges: Story = {
  args: {
    messageCount: 3,
    enableInnerHover: false,
    innerHoverColor: "#64748b",
    enableTextHover: false,
    textHoverColor: "#3b82f6",
  },
  argTypes: {
    messageCount: {
      name: "1. Message Count",
      control: { type: "number" },
      description: "Number displayed in the badge",
    },
    enableInnerHover: {
      name: "2. Circle Icon",
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
      name: "3. Circle Hover Color",
      control: { type: "color" },
      description: "Hover color for the circle badges",
    },
    enableTextHover: {
      name: "4. Enable Text Hover",
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
      name: "5. Text Hover Color",
      control: { type: "color" },
      description: "Hover color for the Messages text",
    },
  },
  render: (args) => (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-semibold mb-2">
          Count = 0: Hides the badge and displays "No New Messages"
        </h4>
        <NotificationBadgesComponent {...args} messageCount={0} />
      </div>
      <div>
        <h4 className="text-sm font-semibold mb-2">
          Count = 1: Shows red badge and "Message"
        </h4>
        <NotificationBadgesComponent {...args} messageCount={1} />
      </div>
      <div>
        <h4 className="text-sm font-semibold mb-2">
          Count {">"} 1: Shows red badge and "Messages"
        </h4>
        <NotificationBadgesComponent {...args} messageCount={5} />
      </div>
      <div>
        <h4 className="text-sm font-semibold mb-2">
          Count {">"} 9: Shows blue badge with ! and "Messages"
        </h4>
        <NotificationBadgesComponent {...args} messageCount={10} />
      </div>
      <div className="mt-8">
        <h4 className="text-sm font-semibold mb-2">
          Interactive Example (use controls below)
        </h4>
        <NotificationBadgesComponent {...args} />
      </div>
    </div>
  ),
};
