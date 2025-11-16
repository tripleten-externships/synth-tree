// Customizable Textarea Stories - ST-34 Extension
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { CustomizableTextarea } from "../components/ui/customizable-textarea";

const meta: Meta<typeof CustomizableTextarea> = {
  title: "UI/Form/CustomizableTextarea",
  component: CustomizableTextarea,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Admin-controlled Textarea: real-time width/height via input fields. Presets + custom sizing.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    defaultWidth: {
      control: { type: "number", min: 200, max: 800 },
    },
    defaultHeight: {
      control: { type: "number", min: 80, max: 400 },
    },
    placeholder: {
      control: { type: "text" },
    },
    label: {
      control: { type: "text" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Start typing your content here...",
    label: "Admin Controlled Textarea",
  },
};

// Admin dashboard example
export const AdminDashboard: Story = {
  render: () => {
    const [savedDimensions, setSavedDimensions] = useState<{width: number, height: number} | null>(null);

    return (
      <div className="w-full max-w-4xl space-y-6">
        <div className="border-b pb-4">
          <h2 className="text-xl font-semibold">Content Management</h2>
          <p className="text-sm text-muted-foreground">
            Configure textarea dimensions for user input forms
          </p>
        </div>
        
        <CustomizableTextarea
          defaultWidth={500}
          defaultHeight={150}
          placeholder="Configure this textarea for your users..."
          label="User Content Input Area"
          onDimensionsChange={(width, height) => {
            setSavedDimensions({ width, height });
          }}
        />
        
        {savedDimensions && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <h3 className="font-medium text-green-900 dark:text-green-100">
              Configuration Saved
            </h3>
            <p className="text-sm text-green-700 dark:text-green-200">
              Textarea dimensions: {savedDimensions.width}px × {savedDimensions.height}px
            </p>
          </div>
        )}
      </div>
    );
  },
};

// Form builder context
export const FormBuilder: Story = {
  render: () => {
    const [forms, setForms] = useState([
      { id: 1, name: "User Feedback", width: 400, height: 120 },
      { id: 2, name: "Bug Reports", width: 600, height: 200 },
    ]);

    return (
      <div className="w-full max-w-6xl space-y-6">
        <div className="border-b pb-4">
          <h2 className="text-xl font-semibold">Form Builder</h2>
          <p className="text-sm text-muted-foreground">
            Design textarea components for different form contexts
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {forms.map((form) => (
            <div key={form.id} className="space-y-2">
              <h3 className="font-medium">{form.name} Form</h3>
              <CustomizableTextarea
                defaultWidth={form.width}
                defaultHeight={form.height}
                placeholder={`Enter ${form.name.toLowerCase()} here...`}
                label={`${form.name} Input`}
                onDimensionsChange={(width, height) => {
                  setForms(prev => prev.map(f => 
                    f.id === form.id ? { ...f, width, height } : f
                  ));
                }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  },
};

// Responsive design preview
export const ResponsivePreview: Story = {
  render: () => {
    const [currentDevice, setCurrentDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
    
    const devicePresets = {
      mobile: { width: 280, height: 100 },
      tablet: { width: 400, height: 120 },
      desktop: { width: 600, height: 160 },
    };

    return (
      <div className="w-full max-w-4xl space-y-6">
        <div className="border-b pb-4">
          <h2 className="text-xl font-semibold">Responsive Design Preview</h2>
          <p className="text-sm text-muted-foreground">
            Preview how textarea appears across different device sizes
          </p>
        </div>
        
        <div className="flex space-x-2">
          {Object.keys(devicePresets).map((device) => (
            <button
              key={device}
              onClick={() => setCurrentDevice(device as keyof typeof devicePresets)}
              className={`px-3 py-1 rounded text-sm capitalize ${
                currentDevice === device
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {device}
            </button>
          ))}
        </div>
        
        <CustomizableTextarea
          key={currentDevice} // Force re-render with new defaults
          defaultWidth={devicePresets[currentDevice].width}
          defaultHeight={devicePresets[currentDevice].height}
          placeholder={`Optimized for ${currentDevice} viewing...`}
          label={`${currentDevice} Layout Preview`}
        />
      </div>
    );
  },
};

// Content management system
export const CMS: Story = {
  render: () => {
    return (
      <div className="w-full max-w-5xl space-y-6">
        <div className="border-b pb-4">
          <h2 className="text-xl font-semibold">Content Management System</h2>
          <p className="text-sm text-muted-foreground">
            Configure content input areas for different sections
          </p>
        </div>
        
        <div className="grid gap-8 lg:grid-cols-2">
          <CustomizableTextarea
            defaultWidth={450}
            defaultHeight={120}
            placeholder="Blog post excerpt..."
            label="Blog Excerpt Editor"
            minWidth={300}
            maxWidth={600}
            minHeight={80}
            maxHeight={200}
          />
          
          <CustomizableTextarea
            defaultWidth={450}
            defaultHeight={200}
            placeholder="Full article content..."
            label="Article Content Editor"
            minWidth={300}
            maxWidth={600}
            minHeight={150}
            maxHeight={400}
          />
        </div>
      </div>
    );
  },
};