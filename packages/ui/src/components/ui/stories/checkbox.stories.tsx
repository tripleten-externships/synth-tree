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
  title: "UI/Checkbox/Checkbox (circle)",
  component: Checkbox,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A customizable checkbox component with accessibility, keyboard navigation, and size variants.",
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
  args: createCheckboxDefaults({ className: "rounded-full" }),
};

export const Checked: Story = {
  render: () => {
    const [checked, setChecked] = useState(true);
    return (
      <Checkbox
        {...createCheckboxDefaults({ className: "rounded-full" })}
        checked={checked}
        onCheckedChange={(checked) => setChecked(checked === true)}
      />
    );
  },
};

export const Disabled: Story = {
  args: createCheckboxDefaults({
    disabled: true,
    className: "rounded-full",
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
        className="rounded-full"
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
        className="rounded-full"
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
        className="rounded-full"
      />
    </div>
  ),
};
