import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Checkbox } from "../checkbox";
import {
  createSizeArgTypes,
  createDimensionArgTypes,
  createIconSizeArgTypes,
  createStateArgTypes,
  createColorArgTypes,
  createCheckmarkColorArgTypes,
  createCheckboxDefaults,
} from "@/utils/storybook-helpers";

const meta: Meta<typeof Checkbox> = {
  title: "UI/Checkbox/Checkbox (square)",
  component: Checkbox,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A customizable checkbox component with square borders, accessibility, keyboard navigation, and size variants.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    ...createSizeArgTypes(),
    ...createDimensionArgTypes(),
    ...createIconSizeArgTypes("icon"),
    ...createStateArgTypes(),
    ...createColorArgTypes(),
    ...createCheckmarkColorArgTypes(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: createCheckboxDefaults({ className: "rounded-none" }),
};

export const Checked: Story = {
  render: () => {
    const [checked, setChecked] = useState(true);
    return (
      <Checkbox
        {...createCheckboxDefaults({ className: "rounded-none" })}
        checked={checked}
        onCheckedChange={(checked) => setChecked(checked === true)}
      />
    );
  },
};

export const Disabled: Story = {
  args: createCheckboxDefaults({
    disabled: true,
    className: "rounded-none",
  }),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center space-x-6">
      <Checkbox
        size="sm"
        widthOffset={0}
        heightOffset={0}
        iconSizeOffset={0}
        checkedColor="hsl(var(--primary))"
        uncheckedColor="#ffffff"
        borderColor="#479AFF"
        checkedCheckmarkColor="hsl(var(--primary-foreground))"
        className="rounded-none"
      />
      <Checkbox
        size="default"
        widthOffset={0}
        heightOffset={0}
        iconSizeOffset={0}
        checkedColor="hsl(var(--primary))"
        uncheckedColor="#ffffff"
        borderColor="#479AFF"
        checkedCheckmarkColor="hsl(var(--primary-foreground))"
        className="rounded-none"
      />
      <Checkbox
        size="lg"
        widthOffset={0}
        heightOffset={0}
        iconSizeOffset={0}
        checkedColor="hsl(var(--primary))"
        uncheckedColor="#ffffff"
        borderColor="#479AFF"
        checkedCheckmarkColor="hsl(var(--primary-foreground))"
        className="rounded-none"
      />
    </div>
  ),
};
