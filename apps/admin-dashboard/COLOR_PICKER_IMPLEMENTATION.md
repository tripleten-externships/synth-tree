# Color Picker Implementation

## Overview
A custom-built color picker component with gradient square selector and hue spectrum slider, integrated into course and skill node creation forms.

## Features

✅ **ColorPicker Component** ([Colorpicker.tsx](./components/Colorpicker.tsx))
- 2D gradient square for saturation/lightness selection
- 1D hue spectrum slider (full 360° color range)
- Live color preview with hex code display
- Click outside to confirm selection
- Parses `initialColor` prop to set starting color
- Lightweight (no external dependencies)
- Returns hex color codes (#RRGGBB)

✅ **Integration Pages**
- **Create Course Page** ([CreateCoursePage.tsx](./pages/CreateCoursePage.tsx))
  - Brand color selection for courses
  - Live preview of course card with selected color
  - Form with title, description, and color picker
  
- **Create Skill Node Page** ([CreateSkillNodePage.tsx](./pages/CreateSkillNodePage.tsx))
  - Node color customization for skill trees
  - Circular node preview with selected color
  - Tree selection dropdown

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

- `/dashboard` - Main dashboard with navigation cards and color picker test
- `/courses/create` - Course creation form with brand color picker
- `/nodes/create` - Skill node creation form with node color picker

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
- [ ] Connect forms to GraphQL mutations (`createCourse`, `createFirstSkillNode`)
- [ ] Add loading states during mutation
- [ ] Add error handling and validation
- [ ] Fetch actual skill trees for node creation dropdown
- [ ] Add success notifications after creation
- [ ] Persist colors to database (add color fields to schema if needed)

## Testing

1. Start the dev server: `pnpm dev`
2. Navigate to `/dashboard`
3. Click navigation cards or test the standalone color picker
4. Try creating a course or node with different colors
5. Verify the color picker responds to clicks and drags
6. Test clicking outside to confirm selection
