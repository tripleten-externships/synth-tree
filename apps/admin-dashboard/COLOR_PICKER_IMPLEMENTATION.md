# Color Picker Implementation

## Overview
A custom-built color picker component with gradient square selector and hue spectrum slider, ready for integration into course and skill node creation forms.

## Features

✅ **ColorPicker Component** ([Colorpicker.tsx](./src/components/Colorpicker.tsx))
- 2D gradient square for saturation/lightness selection
- 1D hue spectrum slider (full 360° color range)
- Live color preview with hex code display
- Click outside to confirm selection
- Parses `initialColor` prop to set starting color
- Lightweight (no external dependencies)
- Returns hex color codes (#RRGGBB)

✅ **Demo Page** ([ColorPickerDemoPage.tsx](./src/pages/ColorPickerDemoPage.tsx))
- Interactive demonstration of the color picker
- Live preview of selected colors
- Multiple usage examples

✅ **Storybook Stories** ([Colorpicker.stories.tsx](./src/components/Colorpicker.stories.tsx))
- Component documentation and interactive examples
- Run with `pnpm storybook`

## Usage

### ColorPicker Component

\`\`\`tsx
import { ColorPicker } from "./components/Colorpicker";

function MyComponent() {
  const [color, setColor] = useState("#3b82f6");
  const [showPicker, setShowPicker] = useState(false);

  return (
    <>
      <button onClick={() => setShowPicker(true)}>
        Pick Color
      </button>
      
      {showPicker && (
        <ColorPicker
          initialColor={color}
          onConfirm={(hex) => {
            setColor(hex);
            setShowPicker(false);
          }}
        />
      )}
    </>
  );
}
\`\`\`

### Routes

- `/color-picker-demo` - Interactive demo page showcasing the color picker component

## Implementation Details

### Color Model
- Uses HSV (Hue, Saturation, Value) internally for smooth gradients
- Converts to/from hex codes for external interface
- Hue: 0-360° (full color spectrum)
- Saturation: 0-100% (white to full color)
- Value: 0-100% (black to full brightness)

### Event Handling
- Mouse drag support for smooth color selection
- Click-and-drag on gradient square updates saturation/value
- Click-and-drag on hue slider updates hue
- Click outside picker to confirm and close

### Next Steps (TODOs)
- [ ] Integrate into course creation forms (ST-59)
- [ ] Integrate into skill node creation forms
- [ ] Connect to GraphQL mutations for persisting colors
- [ ] Add color fields to database schema

## Testing

1. Start the dev server: `pnpm dev`
2. Navigate to `/color-picker-demo`
3. Test the color picker by selecting different colors
4. Verify the picker responds to clicks and drags
5. Test clicking outside to confirm selection
6. Run Storybook: `pnpm storybook` to view component documentation
