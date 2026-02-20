import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { MockLink } from "@apollo/client/testing";
import { LessonViewer } from "../components/LessonViewer";
import { ContentType } from "@skilltree/api-types";

const LESSON_BLOCKS_QUERY = gql`
  query LessonBlocks($nodeId: ID!) {
    lessonBlocks(nodeId: $nodeId) {
      id
      type
      content
      caption
      order
    }
  }
`;

// Mock data for demonstration
const mocks = [
  {
    request: {
      query: LESSON_BLOCKS_QUERY,
      variables: {
        nodeId: "demo-node-1",
      },
    },
    result: {
      data: {
        lessonBlocks: [
          {
            id: "1",
            type: ContentType.Html,
            content: "<h2>Welcome to React Basics</h2><p>This is an <strong>HTML block</strong> with rich text content. You'll learn the fundamentals of React including components, props, and state.</p>",
            caption: null,
            order: 1,
            __typename: "LessonBlock",
          },
          {
            id: "2",
            type: ContentType.Image,
            content: "https://picsum.photos/800/400?random=1",
            caption: "Figure 1: Sample diagram showing component hierarchy",
            order: 2,
            __typename: "LessonBlock",
          },
          {
            id: "3",
            type: ContentType.Html,
            content: "<h3>Key Concepts</h3><ul><li>Components are reusable pieces of UI</li><li>Props pass data from parent to child</li><li>State manages dynamic data</li></ul>",
            caption: null,
            order: 3,
            __typename: "LessonBlock",
          },
          {
            id: "4",
            type: ContentType.Video,
            content: "https://www.youtube.com/watch?v=acEOASYioGY",
            caption: null,
            order: 4,
            __typename: "LessonBlock",
          },
          {
            id: "5",
            type: ContentType.Html,
            content: "<h3>Next Steps</h3><p>After completing this lesson, you'll be ready to build your first React component. Click the button below to continue to the quiz!</p>",
            caption: null,
            order: 5,
            __typename: "LessonBlock",
          },
        ],
      },
    },
  },
];

// Create a mock Apollo Client
const mockLink = new MockLink(mocks);
const client = new ApolloClient({
  link: mockLink,
  cache: new InMemoryCache(),
});

export default function LessonViewerDemoPage() {
  const handleNext = () => {
    alert("Next button clicked! In a real app, this would navigate to the quiz or next lesson.");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">LessonViewer Component Demo</h1>
          <p className="text-gray-600">ST-84: Create Lesson Viewer Component</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <ApolloProvider client={client}>
            <LessonViewer nodeId="demo-node-1" onNext={handleNext} />
          </ApolloProvider>
        </div>

        <div className="mt-8 p-6 bg-blue-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Features Demonstrated:</h2>
          <ul className="space-y-2 text-gray-700">
            <li>✅ Display all lesson blocks in order</li>
            <li>✅ Render HTML blocks with proper styling and sanitization</li>
            <li>✅ Display images with captions</li>
            <li>✅ Embed videos (YouTube) with responsive players</li>
            <li>✅ Handle different ContentType enums (HTML, IMAGE, VIDEO, EMBED)</li>
            <li>✅ "Next" button to proceed to quiz or next node</li>
          </ul>
        </div>

        <div className="mt-6 p-6 bg-green-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Technical Implementation:</h2>
          <ul className="space-y-2 text-gray-700">
            <li>📦 Apollo Client with useQuery hook</li>
            <li>🧹 DOMPurify for HTML sanitization</li>
            <li>🎥 ReactPlayer for video embedding</li>
            <li>🔒 Type-safe with TypeScript</li>
            <li>📊 GraphQL query for lesson blocks</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
