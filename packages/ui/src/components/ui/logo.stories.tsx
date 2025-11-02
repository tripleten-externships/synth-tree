import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Logo } from "./logo";

const meta: Meta<typeof Logo> = {
  title: "UI/Logo",
  component: Logo,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    variant: {
      control: { type: "select" },
      options: ["default", "white", "dark", "muted"],
    },
    height: {
      control: { type: "text" },
      description: "Custom height (overrides size variant)",
    },
    width: {
      control: { type: "text" },
      description: "Custom width",
    },
    className: {
      control: { type: "text" },
      description: "Additional CSS classes",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const ExtraSmall: Story = {
  args: {
    size: "xs",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
  },
};

export const Medium: Story = {
  args: {
    size: "md",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
  },
};

export const ExtraLarge: Story = {
  args: {
    size: "xl",
  },
};

export const White: Story = {
  args: {
    variant: "white",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const Dark: Story = {
  args: {
    variant: "dark",
  },
  parameters: {
    backgrounds: { default: "light" },
  },
};

export const Muted: Story = {
  args: {
    variant: "muted",
  },
};

export const CustomSize: Story = {
  args: {
    height: 80,
    width: 300,
  },
};

export const WithClassName: Story = {
  args: {
    className: "opacity-75 hover:opacity-100 transition-opacity cursor-pointer",
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <div className="text-center">
        <Logo size="xs" />
        <p className="text-xs mt-2 text-muted-foreground">XS (24px)</p>
      </div>
      <div className="text-center">
        <Logo size="sm" />
        <p className="text-xs mt-2 text-muted-foreground">SM (32px)</p>
      </div>
      <div className="text-center">
        <Logo size="md" />
        <p className="text-xs mt-2 text-muted-foreground">MD (40px)</p>
      </div>
      <div className="text-center">
        <Logo size="lg" />
        <p className="text-xs mt-2 text-muted-foreground">LG (48px)</p>
      </div>
      <div className="text-center">
        <Logo size="xl" />
        <p className="text-xs mt-2 text-muted-foreground">XL (64px)</p>
      </div>
    </div>
  ),
};

export const AllColors: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-8">
      <div className="p-6 bg-white border rounded-lg text-center">
        <Logo variant="default" size="lg" />
        <p className="text-sm mt-2 text-muted-foreground">Default</p>
      </div>
      <div className="p-6 bg-gray-900 rounded-lg text-center">
        <Logo variant="white" size="lg" />
        <p className="text-sm mt-2 text-gray-300">White</p>
      </div>
      <div className="p-6 bg-gray-100 border rounded-lg text-center">
        <Logo variant="dark" size="lg" />
        <p className="text-sm mt-2 text-muted-foreground">Dark</p>
      </div>
      <div className="p-6 bg-white border rounded-lg text-center">
        <Logo variant="muted" size="lg" />
        <p className="text-sm mt-2 text-muted-foreground">Muted</p>
      </div>
    </div>
  ),
};

export const ResponsiveUsage: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-4">Mobile (xs)</h3>
        <div className="w-80 mx-auto p-4 border rounded-lg">
          <div className="flex items-center justify-between">
            <Logo size="xs" />
            <button className="text-sm">Menu</button>
          </div>
        </div>
      </div>

      <div className="text-center">
        <h3 className="text-lg font-semibold mb-4">Tablet (sm)</h3>
        <div className="w-96 mx-auto p-4 border rounded-lg">
          <div className="flex items-center justify-between">
            <Logo size="sm" />
            <nav className="flex gap-4 text-sm">
              <a href="#">Home</a>
              <a href="#">About</a>
              <a href="#">Contact</a>
            </nav>
          </div>
        </div>
      </div>

      <div className="text-center">
        <h3 className="text-lg font-semibold mb-4">Desktop (md)</h3>
        <div className="w-full max-w-4xl mx-auto p-6 border rounded-lg">
          <div className="flex items-center justify-between">
            <Logo size="md" />
            <nav className="flex gap-6">
              <a href="#" className="hover:text-primary">
                Home
              </a>
              <a href="#" className="hover:text-primary">
                Products
              </a>
              <a href="#" className="hover:text-primary">
                Services
              </a>
              <a href="#" className="hover:text-primary">
                About
              </a>
              <a href="#" className="hover:text-primary">
                Contact
              </a>
            </nav>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const BrandingShowcase: Story = {
  render: () => (
    <div className="space-y-12">
      {/* Header Usage */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Website Header</h3>
        <div className="w-full p-4 border rounded-lg bg-white">
          <div className="flex items-center justify-between">
            <Logo size="md" />
            <nav className="hidden md:flex gap-6">
              <a href="#" className="text-sm hover:text-primary">
                Home
              </a>
              <a href="#" className="text-sm hover:text-primary">
                About
              </a>
              <a href="#" className="text-sm hover:text-primary">
                Services
              </a>
              <a href="#" className="text-sm hover:text-primary">
                Contact
              </a>
            </nav>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded text-sm">
              Sign In
            </button>
          </div>
        </div>
      </div>

      {/* Footer Usage */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Website Footer</h3>
        <div className="w-full p-8 bg-gray-900 text-white rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1">
              <Logo variant="white" size="sm" />
              <p className="text-sm text-gray-300 mt-4">
                Building the future of digital experiences.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <a href="#" className="hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <a href="#" className="hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <a href="#" className="hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Status
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Business Card */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Business Card</h3>
        <div className="w-80 h-48 p-6 bg-gradient-to-br from-primary to-primary/80 text-white rounded-lg shadow-lg">
          <div className="flex flex-col justify-between h-full">
            <Logo variant="white" size="sm" />
            <div>
              <h4 className="font-bold text-lg">John Doe</h4>
              <p className="text-sm opacity-90">Senior Product Manager</p>
              <p className="text-xs opacity-75 mt-2">john.doe@skilltree.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Login Page */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Login Page</h3>
        <div className="w-96 mx-auto p-8 border rounded-lg bg-white">
          <div className="text-center mb-8">
            <Logo size="lg" className="mx-auto mb-4" />
            <h2 className="text-2xl font-bold">Welcome back</h2>
            <p className="text-muted-foreground">Sign in to your account</p>
          </div>
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border rounded-lg"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 border rounded-lg"
            />
            <button className="w-full p-3 bg-primary text-primary-foreground rounded-lg">
              Sign In
            </button>
          </div>
        </div>
      </div>

      {/* Email Signature */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Email Signature</h3>
        <div className="p-4 border rounded-lg bg-gray-50">
          <div className="flex items-center gap-4">
            <Logo size="xs" />
            <div className="text-sm">
              <p className="font-semibold">Jane Smith</p>
              <p className="text-muted-foreground">Marketing Director</p>
              <p className="text-muted-foreground">
                jane.smith@skilltree.com | +1 (555) 123-4567
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Loading State</h3>
        <div className="w-full h-32 flex items-center justify-center border rounded-lg bg-white">
          <div className="text-center">
            <Logo size="md" className="animate-pulse opacity-50" />
            <p className="text-sm text-muted-foreground mt-2">Loading...</p>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const InteractiveDemo: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-4">Interactive Logo</h3>
        <Logo
          size="lg"
          className="cursor-pointer hover:scale-105 transition-transform duration-200 hover:opacity-80"
        />
        <p className="text-sm text-muted-foreground mt-2">
          Hover to see effect
        </p>
      </div>

      <div className="text-center">
        <h3 className="text-lg font-semibold mb-4">Animated Logo</h3>
        <Logo size="lg" className="animate-bounce" />
        <p className="text-sm text-muted-foreground mt-2">CSS Animation</p>
      </div>
    </div>
  ),
};

export const AccessibilityDemo: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Accessibility Features</h3>
        <div className="p-4 border rounded-lg">
          <Logo size="md" />
          <p className="text-sm text-muted-foreground mt-2">
            The logo includes proper ARIA attributes:
          </p>
          <ul className="text-sm text-muted-foreground mt-2 space-y-1">
            <li>
              • <code>role="img"</code> for screen readers
            </li>
            <li>
              • <code>aria-label="SkillTree Logo"</code> for description
            </li>
            <li>• Scalable SVG format for crisp display at any size</li>
            <li>• Color variants for different backgrounds</li>
          </ul>
        </div>
      </div>
    </div>
  ),
};
