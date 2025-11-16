import * as React from "react";
import { useState } from "react";
import { Textarea } from "./textarea";
import { Input } from "./input";
import { Label } from "./label";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "./button";

/**
 * Admin Customizable Textarea - ST-34 Extension
 *
 * Textarea w/ real-time dimension controls
 * Admin can adjust width/height via input fields
 * Includes presets + custom sizing options
 */

interface CustomizableTextareaProps {
  defaultWidth?: number;
  defaultHeight?: number;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  onDimensionsChange?: (width: number, height: number) => void;
  placeholder?: string;
  label?: string;
}

const CustomizableTextarea = React.forwardRef<
  HTMLTextAreaElement,
  CustomizableTextareaProps
>(
  (
    {
      defaultWidth = 400,
      defaultHeight = 120,
      minWidth = 200,
      maxWidth = 800,
      minHeight = 80,
      maxHeight = 400,
      onDimensionsChange,
      placeholder = "Enter text here...",
      label = "Customizable Textarea",
      ...props
    },
    ref
  ) => {
    const [width, setWidth] = useState(defaultWidth);
    const [height, setHeight] = useState(defaultHeight);
    const [inputWidth, setInputWidth] = useState(defaultWidth.toString());
    const [inputHeight, setInputHeight] = useState(defaultHeight.toString());

    // Update dimensions when inputs change
    const handleApplyDimensions = () => {
      const newWidth = Math.max(
        minWidth,
        Math.min(maxWidth, parseInt(inputWidth) || defaultWidth)
      );
      const newHeight = Math.max(
        minHeight,
        Math.min(maxHeight, parseInt(inputHeight) || defaultHeight)
      );

      setWidth(newWidth);
      setHeight(newHeight);
      onDimensionsChange?.(newWidth, newHeight);
    };

    // Preset dimension options
    const presets = [
      { label: "Small", width: 300, height: 80 },
      { label: "Medium", width: 400, height: 120 },
      { label: "Large", width: 600, height: 200 },
      { label: "Extra Large", width: 800, height: 300 },
    ];

    const applyPreset = (presetWidth: number, presetHeight: number) => {
      setWidth(presetWidth);
      setHeight(presetHeight);
      setInputWidth(presetWidth.toString());
      setInputHeight(presetHeight.toString());
      onDimensionsChange?.(presetWidth, presetHeight);
    };

    return (
      <div className="space-y-4">
        {/* Admin Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Textarea Dimensions Control
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Custom Dimension Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="width-input">Width (px)</Label>
                <div className="flex space-x-2">
                  <Input
                    id="width-input"
                    type="number"
                    min={minWidth}
                    max={maxWidth}
                    value={inputWidth}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setInputWidth(e.target.value)
                    }
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground self-center">
                    {minWidth}-{maxWidth}px
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="height-input">Height (px)</Label>
                <div className="flex space-x-2">
                  <Input
                    id="height-input"
                    type="number"
                    min={minHeight}
                    max={maxHeight}
                    value={inputHeight}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setInputHeight(e.target.value)
                    }
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground self-center">
                    {minHeight}-{maxHeight}px
                  </span>
                </div>
              </div>
            </div>

            <Button onClick={handleApplyDimensions} size="sm">
              Apply Dimensions
            </Button>

            {/* Preset Options */}
            <div className="space-y-2">
              <Label>Quick Presets</Label>
              <div className="flex flex-wrap gap-2">
                {presets.map((preset) => (
                  <Button
                    key={preset.label}
                    variant="outline"
                    size="sm"
                    onClick={() => applyPreset(preset.width, preset.height)}
                  >
                    {preset.label} ({preset.width}×{preset.height})
                  </Button>
                ))}
              </div>
            </div>

            {/* Current Dimensions Display */}
            <div className="text-sm text-muted-foreground">
              Current: {width}px × {height}px
            </div>
          </CardContent>
        </Card>

        {/* Preview Textarea */}
        <div className="space-y-2">
          <Label htmlFor="customizable-textarea">{label}</Label>
          <Textarea
            {...props}
            ref={ref}
            id="customizable-textarea"
            placeholder={placeholder}
            resize="none" // Disable manual resize since admin controls it
            style={{
              width: `${width}px`,
              height: `${height}px`,
            }}
            className="transition-all duration-200 ease-in-out"
          />
        </div>
      </div>
    );
  }
);

CustomizableTextarea.displayName = "CustomizableTextarea";

export { CustomizableTextarea };
