# LessonViewer Component Demo

## ST-84: Create Lesson Viewer Component

### Demo Page Location

The demo page is available at: **`/demo/lesson-viewer`**

### How to Access

1. Start the development server:
   ```bash
   cd apps/client-frontend
   pnpm dev
   ```

2. Navigate to: `http://localhost:5173/demo/lesson-viewer`

### Features Demonstrated

The demo showcases all the acceptance criteria:

- ✅ **Display lesson blocks in order** - Blocks are sorted by the `order` field
- ✅ **Render HTML blocks** - HTML content with proper sanitization using DOMPurify
- ✅ **Display images with captions** - Responsive images with optional figure captions
- ✅ **Embed videos** - YouTube videos using ReactPlayer with responsive 16:9 player
- ✅ **Handle embed iframes** - Safe iframe embedding with responsive aspect ratio
- ✅ **Next button** - Button to proceed to quiz or next node

### Technical Implementation

#### Files Created

1. **`src/components/LessonViewer.tsx`** - Main component
2. **`src/components/LessonViewer.css`** - Styling
3. **`src/pages/LessonViewerDemoPage.tsx`** - Demo page with mock data
4. **Route added to `src/app.tsx`** - `/demo/lesson-viewer`

#### Dependencies Used

- `@apollo/client` - GraphQL client with useQuery hook
- `dompurify` - HTML sanitization
- `react-player` - Video embedding
- `graphql` - GraphQL query parsing

#### Mock Data

The demo uses Apollo Client's `MockLink` to simulate a GraphQL response with:
- 5 lesson blocks (HTML, Image, HTML, Video, HTML)
- Different content types demonstrating all supported formats
- Proper ordering and captions

### Component API

```typescript
interface LessonViewerProps {
  nodeId: string;        // The skill node ID to fetch lessons for
  onNext: () => void;    // Callback when "Next" button is clicked
}
```

### Usage Example

```tsx
import { LessonViewer } from "../components/LessonViewer";

function MyLessonPage() {
  const handleNext = () => {
    // Navigate to quiz or next lesson
    console.log("Proceeding to next step");
  };

  return (
    <LessonViewer 
      nodeId="your-node-id" 
      onNext={handleNext} 
    />
  );
}
```

### GraphQL Query

The component queries:

```graphql
query LessonBlocks($nodeId: ID!) {
  lessonBlocks(nodeId: $nodeId) {
    id
    type
    content
    caption
    order
  }
}
```

### Content Types

The component handles these content types (from `@skilltree/api-types`):

- `ContentType.Html` - Sanitized HTML content
- `ContentType.Image` - Images with optional captions
- `ContentType.Video` - Video URLs (YouTube, Vimeo, etc.)
- `ContentType.Embed` - Generic iframe embeds

### Next Steps

To integrate into production:

1. Ensure your GraphQL API has a `lessonBlocks` query that matches the schema
2. Connect to your real Apollo Client instance (remove MockLink)
3. Implement the `onNext` callback to navigate to quiz or next lesson
4. Add loading states and error handling as needed
5. Customize styling in `LessonViewer.css` to match your design system
