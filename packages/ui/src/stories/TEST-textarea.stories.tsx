// Textarea Stories - ST-34
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";

const meta: Meta<typeof Textarea> = {
  title: "UI/Form/Textarea",
  component: Textarea,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Textarea: size/resize/state variants. Multi-line input w/ RHF integration.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["sm", "default", "lg"],
    },
    resize: {
      control: { type: "select" },
      options: ["none", "vertical", "horizontal", "both"],
    },
    state: {
      control: { type: "select" },
      options: ["default", "error", "success"],
    },
    placeholder: {
      control: { type: "text" },
    },
    disabled: {
      control: { type: "boolean" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Type your message here...",
  },
};

// Size variants: sm/default/lg
export const Sizes: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <div>
        <Label htmlFor="small">Small</Label>
        <Textarea id="small" size="sm" placeholder="Small textarea" />
      </div>
      <div>
        <Label htmlFor="default">Default</Label>
        <Textarea id="default" size="default" placeholder="Default textarea" />
      </div>
      <div>
        <Label htmlFor="large">Large</Label>
        <Textarea id="large" size="lg" placeholder="Large textarea" />
      </div>
    </div>
  ),
};

// Resize behavior: none/vertical/horizontal/both
export const ResizeOptions: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <div>
        <Label htmlFor="none">No resize</Label>
        <Textarea id="none" resize="none" placeholder="Cannot be resized" />
      </div>
      <div>
        <Label htmlFor="vertical">Vertical resize</Label>
        <Textarea id="vertical" resize="vertical" placeholder="Can be resized vertically" />
      </div>
      <div>
        <Label htmlFor="horizontal">Horizontal resize</Label>
        <Textarea id="horizontal" resize="horizontal" placeholder="Can be resized horizontally" />
      </div>
      <div>
        <Label htmlFor="both">Both directions</Label>
        <Textarea id="both" resize="both" placeholder="Can be resized in both directions" />
      </div>
    </div>
  ),
};

// Visual states: default/error/success/disabled
export const States: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <div>
        <Label htmlFor="default-state">Default</Label>
        <Textarea id="default-state" state="default" placeholder="Default state" />
      </div>
      <div>
        <Label htmlFor="error-state">Error</Label>
        <Textarea id="error-state" state="error" placeholder="Error state" />
      </div>
      <div>
        <Label htmlFor="success-state">Success</Label>
        <Textarea id="success-state" state="success" placeholder="Success state" />
      </div>
      <div>
        <Label htmlFor="disabled-state">Disabled</Label>
        <Textarea id="disabled-state" disabled placeholder="Disabled state" />
      </div>
    </div>
  ),
};

// RHF integration w/ validation + error states
export const WithReactHookForm: Story = {
  render: () => {
    const { control, handleSubmit, formState: { errors } } = useForm({
      defaultValues: {
        message: "",
      },
    });

    const onSubmit = (data: { message: string }) => {
      alert(`Submitted: ${data.message}`);
    };

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-80">
        <div>
          <Label htmlFor="message">Message</Label>
          <Controller
            name="message"
            control={control}
            rules={{ 
              required: "Message is required",
              minLength: { value: 10, message: "Message must be at least 10 characters" }
            }}
            render={({ field }) => (
              <Textarea
                {...field}
                id="message"
                placeholder="Enter your message..."
                state={errors.message ? "error" : "default"}
              />
            )}
          />
          {errors.message && (
            <p className="text-sm text-destructive mt-1">{errors.message.message}</p>
          )}
        </div>
        <Button type="submit">Submit</Button>
      </form>
    );
  },
};

// Controlled state w/ character count
export const ControlledExample: Story = {
  render: () => {
    const [value, setValue] = useState("");

    return (
      <div className="space-y-4 w-80">
        <div>
          <Label htmlFor="controlled">Controlled Textarea</Label>
          <Textarea
            id="controlled"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Type something..."
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Character count: {value.length}
        </p>
      </div>
    );
  },
};