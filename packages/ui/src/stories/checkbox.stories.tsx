/**
 * Checkbox Stories - ST-34
 * Storybook docs: size variants + RHF integration
 */
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Checkbox } from "../components/ui/checkbox";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";

const meta: Meta<typeof Checkbox> = {
  title: "UI/Form/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Checkbox: size variants w/ Radix UI. Accessibility + keyboard nav. RHF integration.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["sm", "default", "lg"],
    },
    checked: {
      control: { type: "boolean" },
    },
    disabled: {
      control: { type: "boolean" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center space-x-6">
      <div className="flex items-center space-x-2">
        <Checkbox id="small" size="sm" />
        <Label htmlFor="small">Small</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="default" size="default" />
        <Label htmlFor="default">Default</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="large" size="lg" />
        <Label htmlFor="large">Large</Label>
      </div>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox id="unchecked" />
        <Label htmlFor="unchecked">Unchecked</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="checked" checked />
        <Label htmlFor="checked">Checked</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="disabled" disabled />
        <Label htmlFor="disabled">Disabled</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="disabled-checked" disabled checked />
        <Label htmlFor="disabled-checked">Disabled & Checked</Label>
      </div>
    </div>
  ),
};

// RHF integration
export const WithReactHookForm: Story = {
  render: () => {
    const { control, handleSubmit, watch } = useForm({
      defaultValues: {
        terms: false,
        newsletter: false,
        marketing: true,
      },
    });

    const watchedValues = watch();

    const onSubmit = (data: {
      terms: boolean;
      newsletter: boolean;
      marketing: boolean;
    }) => {
      alert(`Submitted: ${JSON.stringify(data, null, 2)}`);
    };

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-80">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Controller
              name="terms"
              control={control}
              render={({ field: { value, onChange, ...field } }) => (
                <Checkbox
                  {...field}
                  id="terms"
                  checked={value}
                  onCheckedChange={onChange}
                />
              )}
            />
            <Label htmlFor="terms" className="text-sm font-normal">
              I agree to the terms and conditions
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Controller
              name="newsletter"
              control={control}
              render={({ field: { value, onChange, ...field } }) => (
                <Checkbox
                  {...field}
                  id="newsletter"
                  checked={value}
                  onCheckedChange={onChange}
                />
              )}
            />
            <Label htmlFor="newsletter" className="text-sm font-normal">
              Subscribe to newsletter
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Controller
              name="marketing"
              control={control}
              render={({ field: { value, onChange, ...field } }) => (
                <Checkbox
                  {...field}
                  id="marketing"
                  checked={value}
                  onCheckedChange={onChange}
                />
              )}
            />
            <Label htmlFor="marketing" className="text-sm font-normal">
              Receive marketing emails
            </Label>
          </div>
        </div>

        <div className="pt-4">
          <div className="text-sm text-muted-foreground mb-2">
            Current values: {JSON.stringify(watchedValues, null, 2)}
          </div>
          <Button type="submit" size="sm">
            Submit
          </Button>
        </div>
      </form>
    );
  },
};

// Controlled state
export const ControlledExample: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);

    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="controlled"
            checked={checked}
            onCheckedChange={(value) => setChecked(value === true)}
          />
          <Label htmlFor="controlled">Controlled checkbox</Label>
        </div>
        <p className="text-sm text-muted-foreground">
          Current state: {checked ? "Checked" : "Unchecked"}
        </p>
        <Button
          onClick={() => setChecked(!checked)}
          size="sm"
          variant="outline"
        >
          Toggle
        </Button>
      </div>
    );
  },
};

// Accessibility features
export const AccessibilityExample: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <h3 className="text-lg font-semibold">Accessibility Features</h3>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox id="keyboard" />
          <Label htmlFor="keyboard">Use Tab to focus, Space to toggle</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="screen-reader" />
          <Label htmlFor="screen-reader">Screen reader accessible</Label>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        This component supports keyboard navigation and screen readers.
      </p>
    </div>
  ),
};
