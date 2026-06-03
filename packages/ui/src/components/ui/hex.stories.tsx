import type { Meta, StoryObj } from "@storybook/react";
import { ICON_OPTIONS } from "./icon-selector/icon-options";
import { Hex, type HexStatus, type HexStyle } from "./hex";

const STATUSES: HexStatus[] = ["completed", "current", "unlocked", "locked"];
const STYLES: HexStyle[] = ["solid", "outline", "textured"];

function HexVariantCell({
  icon,
  size,
  status,
  hexStyle,
}: {
  icon: (typeof ICON_OPTIONS)[number]["id"];
  size: number;
  status: HexStatus;
  hexStyle: HexStyle;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <Hex icon={icon} status={status} hexStyle={hexStyle} size={size} />
      <span className="text-xs text-muted-foreground">{status}</span>
    </div>
  );
}

const meta: Meta<typeof Hex> = {
  title: "UI/Hex",
  component: Hex,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    icon: {
      control: { type: "select" },
      options: ICON_OPTIONS.map((o) => o.id),
    },
    status: {
      control: { type: "select" },
      options: STATUSES,
    },
    hexStyle: {
      control: { type: "select" },
      options: STYLES,
    },
    size: {
      control: { type: "number" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: "flask",
    status: "current",
    hexStyle: "solid",
    size: 64,
  },
};

export const Clickable: Story = {
  args: {
    icon: "flask",
    status: "current",
    hexStyle: "solid",
    size: 64,
    onClick: () => undefined,
  },
};

export const BossSize: Story = {
  args: {
    icon: "flask",
    status: "current",
    hexStyle: "solid",
    size: 96,
  },
};

export const AllVariants: Story = {
  args: {
    icon: "flask",
    size: 64,
  },
  argTypes: {
    status: { control: false },
    hexStyle: { control: false },
    onClick: { control: false },
  },
  render: ({ icon, size }) => (
    <div className="space-y-8 p-4">
      {STYLES.map((hexStyle) => (
        <section key={hexStyle} className="space-y-3">
          <h3 className="text-sm font-semibold capitalize text-muted-foreground">
            {hexStyle}
          </h3>
          <div className="flex flex-wrap items-end gap-6">
            {STATUSES.map((status) => (
              <HexVariantCell
                key={status}
                icon={icon}
                size={size}
                status={status}
                hexStyle={hexStyle}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  ),
};
