import * as React from "react";
import { useState } from "react";
import { Input } from "./input";
import { Label } from "./label";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";

/**
 * Textarea Customization Modal - ST-34 Extension
 *
 * Reusable modal for admin textarea dimension control
 * Can be triggered from any textarea w/ edit button
 */

export interface TextareaCustomizationProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentWidth: number;
  currentHeight: number;
  onApply: (width: number, height: number) => void;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  title?: string;
  // Database integration props (optional)
  onReset?: () => void | Promise<void>;
  hasCustomization?: boolean;
  instanceId?: string;
}

const TextareaCustomizationModal: React.FC<TextareaCustomizationProps> = ({
  isOpen,
  onOpenChange,
  currentWidth,
  currentHeight,
  onApply,
  minWidth = 200,
  maxWidth = 800,
  minHeight = 80,
  maxHeight = 400,
  title = "Customize Textarea Dimensions",
  onReset,
  hasCustomization = false,
  instanceId,
}) => {
  const [width, setWidth] = useState(currentWidth.toString());
  const [height, setHeight] = useState(currentHeight.toString());

  // Reset values when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setWidth(currentWidth.toString());
      setHeight(currentHeight.toString());
    }
  }, [isOpen, currentWidth, currentHeight]);

  const handleApply = () => {
    const newWidth = Math.max(
      minWidth,
      Math.min(maxWidth, parseInt(width) || currentWidth)
    );
    const newHeight = Math.max(
      minHeight,
      Math.min(maxHeight, parseInt(height) || currentHeight)
    );
    onApply(newWidth, newHeight);
    onOpenChange(false);
  };

  const handleReset = async () => {
    if (onReset) {
      await onReset();
    }
  };

  const presets = [
    { label: "Small", width: 300, height: 80 },
    { label: "Medium", width: 400, height: 120 },
    { label: "Large", width: 600, height: 200 },
    { label: "Extra Large", width: 800, height: 300 },
  ];

  const applyPreset = (presetWidth: number, presetHeight: number) => {
    setWidth(presetWidth.toString());
    setHeight(presetHeight.toString());
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Adjust the width and height of the textarea. Changes will apply
            immediately.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Custom Dimension Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="modal-width-input">Width (px)</Label>
              <div className="space-y-1">
                <Input
                  id="modal-width-input"
                  type="number"
                  min={minWidth}
                  max={maxWidth}
                  value={width}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setWidth(e.target.value)
                  }
                />
                <span className="text-xs text-muted-foreground">
                  Range: {minWidth}-{maxWidth}px
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="modal-height-input">Height (px)</Label>
              <div className="space-y-1">
                <Input
                  id="modal-height-input"
                  type="number"
                  min={minHeight}
                  max={maxHeight}
                  value={height}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setHeight(e.target.value)
                  }
                />
                <span className="text-xs text-muted-foreground">
                  Range: {minHeight}-{maxHeight}px
                </span>
              </div>
            </div>
          </div>

          {/* Preset Options */}
          <div className="space-y-3">
            <Label>Quick Presets</Label>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((preset) => (
                <Button
                  key={preset.label}
                  variant="outline"
                  size="sm"
                  onClick={() => applyPreset(preset.width, preset.height)}
                  className="justify-start"
                >
                  {preset.label}
                  <span className="ml-2 text-xs text-muted-foreground">
                    {preset.width}×{preset.height}
                  </span>
                </Button>
              ))}
            </div>
          </div>

          {/* Preview Info */}
          <div className="rounded-md bg-muted p-3">
            <div className="text-sm">
              <span className="font-medium">Preview: </span>
              {parseInt(width) || currentWidth}px ×{" "}
              {parseInt(height) || currentHeight}px
            </div>
          </div>
        </div>

        <DialogFooter>
          <div className="flex w-full justify-between">
            <div>
              {hasCustomization && onReset && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleReset}
                  title="Remove customization and reset to defaults"
                >
                  Reset to Default
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleApply}>Apply Changes</Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { TextareaCustomizationModal };
