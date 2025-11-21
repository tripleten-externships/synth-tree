import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "../input";

const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: { type: "select" },
      options: ["text", "email", "password", "number", "search", "tel", "url"],
    },
    placeholder: {
      control: { type: "text" },
    },
    disabled: {
      control: { type: "boolean" },
    },
    readOnly: {
      control: { type: "boolean" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Enter text...",
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {},
  },
};

export const Email: Story = {
  args: {
    type: "email",
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {},
    placeholder: "Enter your email",
  },
};

export const Password: Story = {
  args: {
    type: "password",
    placeholder: "Enter your password",
  },
};

export const Search: Story = {
  args: {
    type: "search",
    placeholder: "Search...",
  },
};

export const Number: Story = {
  args: {
    type: "number",
    placeholder: "Enter a number",
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Disabled input",
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    value: "Read-only value",
    readOnly: true,
  },
};

export const WithValue: Story = {
  args: {
    value: "Pre-filled value",
    placeholder: "This won't show",
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {},
  },
};

export const File: Story = {
  args: {
    type: "file",
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Input placeholder="Small input" className="h-8 text-sm" />
      <Input placeholder="Default input" />
      <Input placeholder="Large input" className="h-12 text-base" />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Input placeholder="Default state" />
      <Input
        placeholder="Focused state"
        className="ring-2 ring-ring ring-offset-2"
      />
      <Input
        placeholder="Error state"
        className="border-destructive focus-visible:ring-destructive"
      />
      <Input
        placeholder="Success state"
        className="border-green-500 focus-visible:ring-green-500"
      />
      <Input placeholder="Disabled state" disabled />
    </div>
  ),
};

export const AllTypes: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 w-96">
      <Input type="text" placeholder="Text" />
      <Input type="email" placeholder="Email" />
      <Input type="password" placeholder="Password" />
      <Input type="number" placeholder="Number" />
      <Input type="search" placeholder="Search" />
      <Input type="tel" placeholder="Phone" />
      <Input type="url" placeholder="URL" />
      <Input type="date" />
    </div>
  ),
};

export const FormExample: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Full Name
        </label>
        <Input id="name" placeholder="John Doe" />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <Input id="email" type="email" placeholder="john@example.com" />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <Input id="password" type="password" placeholder="••••••••" />
      </div>
    </div>
  ),
};
