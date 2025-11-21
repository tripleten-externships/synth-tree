import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "../badge";

const meta: Meta<typeof Badge> = {
  title: "UI/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "secondary", "destructive", "outline"],
    },
    children: {
      control: { type: "text" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Badge",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary",
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "Destructive",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
};

export const StatusBadges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Active</Badge>
      <Badge variant="secondary">Pending</Badge>
      <Badge variant="destructive">Error</Badge>
      <Badge variant="outline">Draft</Badge>
    </div>
  ),
};

export const Numbers: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">1</Badge>
      <Badge variant="secondary">12</Badge>
      <Badge variant="destructive">99+</Badge>
      <Badge variant="outline">New</Badge>
    </div>
  ),
};

export const WithText: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span>Status:</span>
        <Badge variant="default">Online</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span>Priority:</span>
        <Badge variant="destructive">High</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span>Category:</span>
        <Badge variant="secondary">Development</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span>Type:</span>
        <Badge variant="outline">Feature</Badge>
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Badge className="text-xs px-2 py-0.5">Small</Badge>
      <Badge>Default</Badge>
      <Badge className="text-sm px-3 py-1">Large</Badge>
    </div>
  ),
};

export const CustomColors: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge className="bg-blue-500 text-white hover:bg-blue-600">Info</Badge>
      <Badge className="bg-green-500 text-white hover:bg-green-600">
        Success
      </Badge>
      <Badge className="bg-yellow-500 text-black hover:bg-yellow-600">
        Warning
      </Badge>
      <Badge className="bg-purple-500 text-white hover:bg-purple-600">
        Premium
      </Badge>
      <Badge className="bg-pink-500 text-white hover:bg-pink-600">
        Special
      </Badge>
    </div>
  ),
};

export const InteractiveBadges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge
        className="cursor-pointer hover:bg-primary/80 transition-colors"
        onClick={() => alert("Badge clicked!")}
      >
        Clickable
      </Badge>
      <Badge
        variant="outline"
        className="cursor-pointer hover:bg-accent transition-colors"
        onClick={() => alert("Outline clicked!")}
      >
        Interactive
      </Badge>
      <Badge
        variant="secondary"
        className="cursor-pointer hover:bg-secondary/80 transition-colors"
        onClick={() => alert("Secondary clicked!")}
      >
        Button-like
      </Badge>
    </div>
  ),
};

export const NotificationBadges: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="relative inline-block">
        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        <Badge
          variant="destructive"
          className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
        >
          3
        </Badge>
      </div>

      <div className="relative inline-block">
        <div className="w-12 h-8 bg-gray-300 rounded"></div>
        <Badge
          variant="default"
          className="absolute -top-2 -right-2 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs"
        >
          !
        </Badge>
      </div>

      <div className="relative inline-block">
        <span className="text-lg">Messages</span>
        <Badge
          variant="destructive"
          className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
        >
          5
        </Badge>
      </div>
    </div>
  ),
};

export const TagExample: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Article Tags</h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">React</Badge>
          <Badge variant="outline">TypeScript</Badge>
          <Badge variant="outline">Web Development</Badge>
          <Badge variant="outline">Frontend</Badge>
          <Badge variant="outline">JavaScript</Badge>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Skills</h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">Expert</Badge>
          <Badge variant="default">Intermediate</Badge>
          <Badge variant="outline">Beginner</Badge>
        </div>
      </div>
    </div>
  ),
};

export const ProductBadges: Story = {
  render: () => (
    <div className="space-y-4 max-w-sm">
      <div className="border rounded-lg p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold">Premium Plan</h3>
          <Badge variant="default">Popular</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Advanced features for power users
        </p>
      </div>

      <div className="border rounded-lg p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold">Enterprise Plan</h3>
          <Badge variant="destructive">Limited Time</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Full-featured solution for teams
        </p>
      </div>

      <div className="border rounded-lg p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold">Basic Plan</h3>
          <Badge variant="outline">Free</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Essential features to get started
        </p>
      </div>
    </div>
  ),
};
