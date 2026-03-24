import { ApolloClient, InMemoryCache} from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { MockLink } from "@apollo/client/testing";
import { LessonViewer } from "../components/LessonViewer";
import { ContentType } from "@skilltree/api-types";

import { LESSON_BLOCKS_QUERY } from "../graphql/queries/lessonBlocks";

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
        lessonBlocksByNode: [
          {
            id: "1",
            type: ContentType.Html,
            html:
              "<h2>Welcome to React Basics</h2><p>This is an <strong>HTML block</strong> with rich text content. You'll learn the fundamentals of React including components, props, and state.</p>",
            caption: null,
            order: 1,
            __typename: "LessonBlock",
          },
          {
            id: "2",
            type: ContentType.Image,
            url: "https://picsum.photos/800/400?random=1",
            caption: "Figure 1: Sample diagram showing component hierarchy",
            order: 2,
            __typename: "LessonBlock",
          },
          {
            id: "3",
            type: ContentType.Html,
            html:
              "<h3>Key Concepts</h3><ul><li>Components are reusable pieces of UI</li><li>Props pass data from parent to child</li><li>State manages dynamic data</li></ul>",
            caption: null,
            order: 3,
            __typename: "LessonBlock",
          },
          {
            id: "4",
            type: ContentType.Video,
            url: "https://www.youtube.com/watch?v=acEOASYioGY",
            caption: null,
            order: 4,
            __typename: "LessonBlock",
          },
          {
            id: "5",
            type: ContentType.Html,
            html:
              "<h3>Next Steps</h3><p>After completing this lesson, you'll be ready to build your first React component. Click the button below to continue to the quiz!</p>",
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
    alert(
      "Next button clicked! In a real app, this would navigate to the quiz or next lesson.",
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            LessonViewer Component Demo
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <ApolloProvider client={client}>
            <LessonViewer nodeId="demo-node-1" onNext={handleNext} />
          </ApolloProvider>
        </div>
      </div>
    </div>
  );
}
