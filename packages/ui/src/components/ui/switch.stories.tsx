import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "./switch";
import {
  createSizeArgTypes,
  createDimensionArgTypes,
  createIconSizeArgTypes,
  createStateArgTypes,
  createColorArgTypes,
  createThumbColorArgTypes,
  createSwitchDefaults,
} from "@/utils/storybook-helpers";

const meta: Meta<typeof Switch> = {
  title: "UI/Switch",
  component: Switch,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A customizable switch/toggle component with accessibility, keyboard navigation, and size variants.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    ...createSizeArgTypes(),
    ...createDimensionArgTypes(),
    ...createIconSizeArgTypes("thumb"),
    ...createStateArgTypes(),
    ...createColorArgTypes(),
    ...createThumbColorArgTypes(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: createSwitchDefaults(),
};

export const Checked: Story = {
  args: createSwitchDefaults({ checked: true }),
};

export const Disabled: Story = {
  args: createSwitchDefaults({ disabled: true }),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center space-x-6">
      <Switch
        size="sm"
        widthOffset={0}
        heightOffset={0}
        thumbSizeOffset={0}
        checkedColor="hsl(var(--primary))"
        uncheckedColor="hsl(var(--muted))"
        borderColor="hsl(var(--border))"
        checkedThumbColor="hsl(var(--primary-foreground))"
        uncheckedThumbColor="hsl(var(--muted-foreground))"
      />
      <Switch
        size="default"
        widthOffset={0}
        heightOffset={0}
        thumbSizeOffset={0}
        checkedColor="hsl(var(--primary))"
        uncheckedColor="hsl(var(--muted))"
        borderColor="hsl(var(--border))"
        checkedThumbColor="hsl(var(--primary-foreground))"
        uncheckedThumbColor="hsl(var(--muted-foreground))"
      />
      <Switch
        size="lg"
        widthOffset={0}
        heightOffset={0}
        thumbSizeOffset={0}
        checkedColor="hsl(var(--primary))"
        uncheckedColor="hsl(var(--muted))"
        borderColor="hsl(var(--border))"
        checkedThumbColor="hsl(var(--primary-foreground))"
        uncheckedThumbColor="hsl(var(--muted-foreground))"
      />
    </div>
  ),
};
