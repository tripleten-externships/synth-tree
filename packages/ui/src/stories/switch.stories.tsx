/**
 * Switch Stories - ST-34
 * Storybook docs: size variants + RHF integration
 */
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";

const meta: Meta<typeof Switch> = {
  title: "UI/Form/Switch",
  component: Switch,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Switch/toggle: size variants w/ Radix UI. Accessibility + keyboard nav. RHF integration.",
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
        <Switch id="small" size="sm" />
        <Label htmlFor="small">Small</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="default" size="default" />
        <Label htmlFor="default">Default</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="large" size="lg" />
        <Label htmlFor="large">Large</Label>
      </div>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch id="off" />
        <Label htmlFor="off">Off</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="on" checked />
        <Label htmlFor="on">On</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="disabled-off" disabled />
        <Label htmlFor="disabled-off">Disabled (Off)</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="disabled-on" disabled checked />
        <Label htmlFor="disabled-on">Disabled (On)</Label>
      </div>
    </div>
  ),
};

// RHF integration
export const WithReactHookForm: Story = {
  render: () => {
    const { control, handleSubmit, watch } = useForm({
      defaultValues: {
        notifications: false,
        darkMode: true,
        autoSave: false,
      },
    });

    const watchedValues = watch();

    const onSubmit = (data: {
      notifications: boolean;
      darkMode: boolean;
      autoSave: boolean;
    }) => {
      alert(`Submitted: ${JSON.stringify(data, null, 2)}`);
    };

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-80">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications" className="text-sm font-normal">
              Enable notifications
            </Label>
            <Controller
              name="notifications"
              control={control}
              render={({ field: { value, onChange, ...field } }) => (
                <Switch
                  {...field}
                  id="notifications"
                  checked={value}
                  onCheckedChange={onChange}
                />
              )}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="darkMode" className="text-sm font-normal">
              Dark mode
            </Label>
            <Controller
              name="darkMode"
              control={control}
              render={({ field: { value, onChange, ...field } }) => (
                <Switch
                  {...field}
                  id="darkMode"
                  checked={value}
                  onCheckedChange={onChange}
                />
              )}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="autoSave" className="text-sm font-normal">
              Auto-save drafts
            </Label>
            <Controller
              name="autoSave"
              control={control}
              render={({ field: { value, onChange, ...field } }) => (
                <Switch
                  {...field}
                  id="autoSave"
                  checked={value}
                  onCheckedChange={onChange}
                />
              )}
            />
          </div>
        </div>

        <div className="pt-4">
          <div className="text-sm text-muted-foreground mb-2">
            Current values: {JSON.stringify(watchedValues, null, 2)}
          </div>
          <Button type="submit" size="sm">
            Save Settings
          </Button>
        </div>
      </form>
    );
  },
};

// Controlled state
export const ControlledExample: Story = {
  render: () => {
    const [enabled, setEnabled] = useState(false);

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between w-64">
          <Label htmlFor="controlled">Feature enabled</Label>
          <Switch
            id="controlled"
            checked={enabled}
            onCheckedChange={(value) => setEnabled(value === true)}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Current state: {enabled ? "Enabled" : "Disabled"}
        </p>
        <Button
          onClick={() => setEnabled(!enabled)}
          size="sm"
          variant="outline"
        >
          Toggle Feature
        </Button>
      </div>
    );
  },
};

// Settings panel UI
export const SettingsPanel: Story = {
  render: () => {
    const [settings, setSettings] = useState({
      notifications: true,
      emailUpdates: false,
      autoBackup: true,
      analytics: false,
    });

    const updateSetting = (key: keyof typeof settings) => {
      setSettings((prev) => ({
        ...prev,
        [key]: !prev[key],
      }));
    };

    return (
      <div className="w-80 p-6 border border-border rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="notifications-setting">Push notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications about updates
              </p>
            </div>
            <Switch
              id="notifications-setting"
              checked={settings.notifications}
              onCheckedChange={() => updateSetting("notifications")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-setting">Email updates</Label>
              <p className="text-sm text-muted-foreground">
                Get weekly digest emails
              </p>
            </div>
            <Switch
              id="email-setting"
              checked={settings.emailUpdates}
              onCheckedChange={() => updateSetting("emailUpdates")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="backup-setting">Auto backup</Label>
              <p className="text-sm text-muted-foreground">
                Automatically backup your data
              </p>
            </div>
            <Switch
              id="backup-setting"
              checked={settings.autoBackup}
              onCheckedChange={() => updateSetting("autoBackup")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="analytics-setting">Usage analytics</Label>
              <p className="text-sm text-muted-foreground">
                Help improve our service
              </p>
            </div>
            <Switch
              id="analytics-setting"
              checked={settings.analytics}
              onCheckedChange={() => updateSetting("analytics")}
            />
          </div>
        </div>
      </div>
    );
  },
};

// Accessibility features
export const AccessibilityExample: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <h3 className="text-lg font-semibold">Accessibility Features</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="keyboard-nav">
            Use Tab to focus, Space/Enter to toggle
          </Label>
          <Switch id="keyboard-nav" />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="screen-reader">Screen reader accessible</Label>
          <Switch id="screen-reader" />
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        This component supports keyboard navigation and screen readers with
        proper ARIA attributes.
      </p>
    </div>
  ),
};
