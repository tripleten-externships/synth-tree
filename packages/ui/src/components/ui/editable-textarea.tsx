import * as React from "react";
import { Edit3 } from "lucide-react";
import { Textarea, type TextareaProps } from "./textarea";
import { Button } from "./button";
import { TextareaCustomizationModal } from "./textarea-customization-modal";
import { useUISettings } from "../../hooks/useUICustomization";
import { cn } from "@/utils";

export interface EditableTextareaProps extends TextareaProps {
  /** Admin edit mode - shows edit button */
  adminMode?: boolean;
  /** Unique instance ID for database persistence */
  instanceId?: string;
  /** Default dimensions */
  defaultWidth?: number;
  defaultHeight?: number;
}

/**
 * Database-persistent admin-customizable textarea
 * with modal-based dimension controls
 */
export const EditableTextarea = React.forwardRef<
  HTMLTextAreaElement,
  EditableTextareaProps
>(
  (
    {
      adminMode = false,
      instanceId,
      defaultWidth = 300,
      defaultHeight = 100,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    // Generate unique ID if needed
    const actualInstanceId = instanceId || React.useId();

    // Load settings with defaults
    const {
      settings,
      hasCustomization,
      isLoading,
      saveCustomization,
      deleteCustomization,
    } = useUISettings(actualInstanceId, "textarea", {
      width: defaultWidth,
      height: defaultHeight,
    });

    // Save dimensions
    const handleApply = async (width: number, height: number) => {
      try {
        await saveCustomization({ width, height });
        setIsModalOpen(false);
      } catch (error) {
        console.error("Failed to save textarea customization:", error);
      }
    };

    // Reset to defaults
    const handleReset = async () => {
      try {
        if (hasCustomization) {
          await deleteCustomization();
        }
        setIsModalOpen(false);
      } catch (error) {
        console.error("Failed to reset textarea customization:", error);
      }
    };

    // Dynamic styles from settings
    const dynamicStyle = {
      width: settings.width ? `${settings.width}px` : undefined,
      height: settings.height ? `${settings.height}px` : undefined,
      minWidth: settings.width ? `${settings.width}px` : undefined,
      minHeight: settings.height ? `${settings.height}px` : undefined,
      ...style,
    };

    if (isLoading) {
      return (
        <div className="animate-pulse">
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      );
    }

    return (
      <div className="relative inline-block">
        <Textarea
          ref={ref}
          className={cn(
            hasCustomization && "ring-2 ring-blue-200 ring-offset-2",
            className
          )}
          style={dynamicStyle}
          {...props}
        />

        {adminMode && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="absolute -top-2 -right-2 h-6 w-6 p-0"
            title="Customize textarea dimensions"
          >
            <Edit3 className="h-3 w-3" />
          </Button>
        )}

        {adminMode && (
          <TextareaCustomizationModal
            isOpen={isModalOpen}
            onOpenChange={(open) => setIsModalOpen(open)}
            currentWidth={settings.width || defaultWidth}
            currentHeight={settings.height || defaultHeight}
            onApply={handleApply}
            hasCustomization={hasCustomization}
            instanceId={actualInstanceId}
          />
        )}
      </div>
    );
  }
);

EditableTextarea.displayName = "EditableTextarea";
