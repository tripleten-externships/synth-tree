This file has been deleted.
// Editable Textarea Stories - ST-34 Extension  
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { EditableTextarea } from "../components/ui/editable-textarea";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

const meta: Meta<typeof EditableTextarea> = {
  title: "UI/Form/EditableTextarea",
  component: EditableTextarea,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Admin-editable Textarea: edit button (admin-only) opens dimension control modal. Reusable across forms.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    adminMode: {
      control: { type: "boolean" },
    },
    instanceId: {
      control: { type: "text" },
    },
    size: {
      control: { type: "select" },
      options: ["sm", "default", "lg"],
    },
    state: {
      control: { type: "select" },
      options: ["default", "error", "success"],
    },
    placeholder: {
      control: { type: "text" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Type your message here...",
    label: "Standard Textarea",
    isAdmin: false,
    customizable: false,
  },
};

export const AdminEditable: Story = {
  args: {
    placeholder: "This textarea can be customized by admins...",
    label: "Admin Customizable Textarea",
    isAdmin: true,
    customizable: true,
  },
};

// User vs Admin view comparison
export const UserVsAdmin: Story = {
  render: () => {
    const [isAdminMode, setIsAdminMode] = useState(false);

    return (
      <div className="w-full max-w-4xl space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h2 className="text-xl font-semibold">User vs Admin View</h2>
            <p className="text-sm text-muted-foreground">
              Toggle between user and admin perspectives
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant={isAdminMode ? "default" : "outline"}>
              {isAdminMode ? "Admin Mode" : "User Mode"}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAdminMode(!isAdminMode)}
            >
              Switch to {isAdminMode ? "User" : "Admin"} View
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Feedback Form</CardTitle>
            </CardHeader>
            <CardContent>
              <EditableTextarea
                placeholder="Share your feedback..."
                adminMode={isAdminMode}
                instanceId="feedback-textarea"
                defaultWidth={300}
                defaultHeight={100}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Support Request</CardTitle>
            </CardHeader>
            <CardContent>
              <EditableTextarea
                placeholder="Describe your issue..."
                adminMode={isAdminMode}
                instanceId="support-textarea"
                defaultWidth={350}
                defaultHeight={150}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  },
};

// Instance isolation demonstration
export const InstanceIsolation: Story = {
  render: () => {
    const [textareaStates, setTextareaStates] = useState({
      'textarea-1': { width: 300, height: 100 },
      'textarea-2': { width: 400, height: 120 },
      'textarea-3': { width: 500, height: 150 },
    });

    const handleDimensionChange = (width: number, height: number, textareaId?: string) => {
      if (textareaId) {
        setTextareaStates(prev => ({
          ...prev,
          [textareaId]: { width, height }
        }));
      }
    };

    return (
      <div className="w-full max-w-6xl space-y-6">
        <div className="border-b pb-4">
          <h2 className="text-xl font-semibold">Instance Isolation Test</h2>
          <p className="text-sm text-muted-foreground">
            Each textarea maintains its own independent dimensions
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {(Object.keys(textareaStates) as Array<keyof typeof textareaStates>).map((id) => {
            const state = textareaStates[id];
            return (
              <Card key={id}>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center justify-between">
                    Textarea {id.split('-')[1]}
                    <Badge variant="outline" className="text-xs">
                      {state.width}×{state.height}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <EditableTextarea
                    placeholder={`Content for ${id}...`}
                    adminMode={true}
                    instanceId={id}
                    defaultWidth={state.width}
                    defaultHeight={state.height}
                  />
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="p-4 bg-muted rounded-lg">
          <h3 className="font-medium mb-2">Current States:</h3>
          <pre className="text-xs">
            {JSON.stringify(textareaStates, null, 2)}
          </pre>
        </div>
      </div>
    );
  },
};

// Content management dashboard
export const CMSDashboard: Story = {
  render: () => {
    const [sections, setSections] = useState([
      { id: 1, name: "Blog Posts", type: "excerpt", width: 400, height: 100 },
      { id: 2, name: "Product Descriptions", type: "full", width: 500, height: 180 },
      { id: 3, name: "User Comments", type: "comment", width: 350, height: 80 },
    ]);

    const updateSection = (id: number, width: number, height: number) => {
      setSections(prev => prev.map(section => 
        section.id === id ? { ...section, width, height } : section
      ));
    };

    const handleDimensionChange = (width: number, height: number, textareaId?: string) => {
      // Parse the section ID from the textarea ID
      const sectionId = textareaId ? parseInt(textareaId.replace('section-', '')) : null;
      if (sectionId) {
        updateSection(sectionId, width, height);
      }
    };

    return (
      <div className="w-full max-w-6xl space-y-6">
        <div className="border-b pb-4">
          <h2 className="text-xl font-semibold">Content Management Dashboard</h2>
          <p className="text-sm text-muted-foreground">
            Admin can customize textarea dimensions for different content types independently
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {sections.map((section) => (
            <Card key={section.id}>
              <CardHeader>
                <CardTitle className="text-base flex items-center justify-between">
                  {section.name}
                  <Badge variant="outline" className="text-xs">
                    {section.width}×{section.height}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EditableTextarea
                  placeholder={`Enter ${section.name.toLowerCase()}...`}
                  adminMode={true}
                  instanceId={`section-${section.id}`}
                  defaultWidth={section.width}
                  defaultHeight={section.height}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  },
};

// Form builder scenario
export const FormBuilder: Story = {
  render: () => {
    const [formFields, setFormFields] = useState([
      { id: 1, label: "Name", type: "input" },
      { id: 2, label: "Message", type: "textarea", width: 400, height: 120 },
      { id: 3, label: "Additional Notes", type: "textarea", width: 400, height: 80 },
    ]);

    const handleFieldDimensionChange = (width: number, height: number, textareaId?: string) => {
      // Extract field ID from textarea ID
      const fieldId = textareaId ? parseInt(textareaId.replace('field-', '')) : null;
      if (fieldId) {
        setFormFields(prev => prev.map(field => 
          field.id === fieldId ? { ...field, width, height } : field
        ));
      }
    };

    return (
      <div className="w-full max-w-4xl space-y-6">
        <div className="border-b pb-4">
          <h2 className="text-xl font-semibold">Form Builder</h2>
          <p className="text-sm text-muted-foreground">
            Design forms with independently customizable textarea fields
          </p>
        </div>

        <div className="space-y-4">
          {formFields.map((field) => (
            <div key={field.id} className="p-4 border border-dashed rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Field {field.id}: {field.label}</span>
                {field.type === "textarea" && (
                  <Badge variant="secondary" className="text-xs">
                    {field.width}×{field.height}
                  </Badge>
                )}
              </div>
              
              {field.type === "textarea" ? (
                <EditableTextarea
                  placeholder={`Enter ${field.label.toLowerCase()}...`}
                  adminMode={true}
                  instanceId={`field-${field.id}`}
                  defaultWidth={field.width}
                  defaultHeight={field.height}
                />
              ) : (
                <div>
                  <label className="text-sm font-medium">{field.label}</label>
                  <input 
                    type="text" 
                    placeholder={`Enter ${field.label.toLowerCase()}...`}
                    className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  },
};

// Responsive design testing
export const ResponsiveTesting: Story = {
  render: () => {
    const [viewport, setViewport] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
    
    const viewportSizes = {
      mobile: { width: 280, height: 100 },
      tablet: { width: 400, height: 120 },
      desktop: { width: 600, height: 160 },
    };

    return (
      <div className="w-full max-w-5xl space-y-6">
        <div className="border-b pb-4">
          <h2 className="text-xl font-semibold">Responsive Design Testing</h2>
          <p className="text-sm text-muted-foreground">
            Test textarea dimensions across different viewports
          </p>
        </div>

        <div className="flex space-x-2">
          {Object.keys(viewportSizes).map((size) => (
            <Button
              key={size}
              variant={viewport === size ? "default" : "outline"}
              size="sm"
              onClick={() => setViewport(size as keyof typeof viewportSizes)}
              className="capitalize"
            >
              {size}
            </Button>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Article Content</CardTitle>
            </CardHeader>
            <CardContent>
              <EditableTextarea
                placeholder="Write your article..."
                adminMode={true}
                instanceId={`article-editor-${viewport}`}
                defaultWidth={viewportSizes[viewport].width}
                defaultHeight={viewportSizes[viewport].height}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Note</CardTitle>
            </CardHeader>
            <CardContent>
              <EditableTextarea
                placeholder="Quick note..."
                adminMode={true}
                instanceId={`note-editor-${viewport}`}
                defaultWidth={Math.round(viewportSizes[viewport].width * 0.8)}
                defaultHeight={Math.round(viewportSizes[viewport].height * 0.7)}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  },
};