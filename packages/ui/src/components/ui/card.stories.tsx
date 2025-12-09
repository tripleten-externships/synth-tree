import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "./card";
import { Button } from "./button";

const meta: Meta<typeof Card> = {
  title: "UI/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    className: {
      control: { type: "text" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content goes here.</p>
      </CardContent>
    </Card>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content goes here.</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline">Cancel</Button>
        <Button>Save</Button>
      </CardFooter>
    </Card>
  ),
};

export const SimpleCard: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardContent className="pt-6">
        <p>This is a simple card with just content.</p>
      </CardContent>
    </Card>
  ),
};

export const HeaderOnly: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Header Only Card</CardTitle>
        <CardDescription>This card only has a header section.</CardDescription>
      </CardHeader>
    </Card>
  ),
};

export const LongContent: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Long Content Card</CardTitle>
        <CardDescription>
          This card demonstrates how longer content is handled.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris.
        </p>
        <p className="mb-4">
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
          dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
          proident.
        </p>
        <p>Sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          Read More
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const ProfileCard: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
            JD
          </div>
          <div>
            <CardTitle>John Doe</CardTitle>
            <CardDescription>Software Engineer</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Passionate about creating beautiful and functional user interfaces. 5+
          years of experience in React and TypeScript.
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          View Profile
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const StatsCard: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Analytics Overview</CardTitle>
        <CardDescription>Your performance this month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">1,234</div>
            <div className="text-sm text-muted-foreground">Total Views</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">+12%</div>
            <div className="text-sm text-muted-foreground">Growth</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">567</div>
            <div className="text-sm text-muted-foreground">New Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">89%</div>
            <div className="text-sm text-muted-foreground">Satisfaction</div>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};

export const FormCard: Story = {
  render: () => (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>
          Enter your details to create a new account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            placeholder="Enter your name"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            placeholder="Enter your email"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            placeholder="Enter your password"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Create Account</Button>
      </CardFooter>
    </Card>
  ),
};

export const CardSizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Card className="w-[250px]">
        <CardHeader>
          <CardTitle className="text-lg">Small Card</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Compact card for limited space.</p>
        </CardContent>
      </Card>

      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Medium Card</CardTitle>
          <CardDescription>Standard card size</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This is the default card size for most use cases.</p>
        </CardContent>
      </Card>

      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle className="text-xl">Large Card</CardTitle>
          <CardDescription>Spacious card for detailed content</CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            Large cards provide more space for detailed content and complex
            layouts. They work well for dashboards and detailed information
            displays.
          </p>
        </CardContent>
      </Card>
    </div>
  ),
};

export const CardVariants: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Default Card</CardTitle>
          <CardDescription>Standard card styling</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This is the default card appearance.</p>
        </CardContent>
      </Card>

      <Card className="border-primary">
        <CardHeader>
          <CardTitle>Primary Border</CardTitle>
          <CardDescription>Card with primary border</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This card has a primary colored border.</p>
        </CardContent>
      </Card>

      <Card className="bg-muted">
        <CardHeader>
          <CardTitle>Muted Background</CardTitle>
          <CardDescription>Card with muted background</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This card has a muted background color.</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Enhanced Shadow</CardTitle>
          <CardDescription>Card with larger shadow</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This card has an enhanced shadow effect.</p>
        </CardContent>
      </Card>
    </div>
  ),
};
