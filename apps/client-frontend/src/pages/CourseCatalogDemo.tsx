import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Input,
  Button,
  Badge,
} from "@skilltree/ui";

// Mock data for demo purposes
const MOCK_COURSES = [
  {
    id: "1",
    title: "React Fundamentals",
    description: "Learn the basics of React including components, props, state, and hooks. Build modern web applications with confidence.",
    status: "PUBLISHED",
    createdAt: "2026-01-15T10:00:00Z",
    author: {
      id: "author1",
      name: "Sarah Johnson",
      email: "sarah.j@example.com"
    }
  },
  {
    id: "2",
    title: "Advanced TypeScript",
    description: "Master TypeScript with advanced types, generics, decorators, and best practices for large-scale applications.",
    status: "PUBLISHED",
    createdAt: "2026-01-20T10:00:00Z",
    author: {
      id: "author2",
      name: "Michael Chen",
      email: "m.chen@example.com"
    }
  },
  {
    id: "3",
    title: "GraphQL API Design",
    description: "Build powerful and flexible APIs with GraphQL. Learn schema design, resolvers, mutations, and subscriptions.",
    status: "PUBLISHED",
    createdAt: "2026-01-25T10:00:00Z",
    author: {
      id: "author1",
      name: "Sarah Johnson",
      email: "sarah.j@example.com"
    }
  },
  {
    id: "4",
    title: "Node.js Backend Development",
    description: "Create scalable backend services with Node.js and Express. Cover authentication, databases, and deployment.",
    status: "PUBLISHED",
    createdAt: "2026-02-01T10:00:00Z",
    author: {
      id: "author3",
      name: "David Martinez",
      email: "d.martinez@example.com"
    }
  },
  {
    id: "5",
    title: "Cloud Architecture with AWS",
    description: "Design and deploy cloud-native applications on AWS. Learn Lambda, EC2, S3, and best practices for scalability.",
    status: "PUBLISHED",
    createdAt: "2026-02-03T10:00:00Z",
    author: {
      id: "author2",
      name: "Michael Chen",
      email: "m.chen@example.com"
    }
  },
  {
    id: "6",
    title: "Docker and Kubernetes",
    description: "Containerize your applications and orchestrate them at scale. Master Docker, K8s, and microservices architecture.",
    status: "PUBLISHED",
    createdAt: "2026-02-05T10:00:00Z",
    author: {
      id: "author3",
      name: "David Martinez",
      email: "d.martinez@example.com"
    }
  }
];

export default function CourseCatalogDemo() {
  const [search, setSearch] = useState("");

  // Filter courses based on search
  const filteredCourses = MOCK_COURSES.filter((course) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      course.title.toLowerCase().includes(searchLower) ||
      course.description.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Course Catalog</h1>
        <p className="text-muted-foreground">
          Browse and discover courses to enhance your skills
        </p>
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>🎨 Demo Mode:</strong> This is a standalone demo of the Course Catalog feature (ST-82) with mock data.
          </p>
        </div>
      </div>

      {/* Search Section */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <Input
            type="text"
            placeholder="Search courses by title or description..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            className="flex-1"
          />
          {search && (
            <Button
              variant="outline"
              onClick={() => setSearch("")}
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4 text-sm text-muted-foreground">
        Showing {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''}
      </div>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No courses found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search terms
          </p>
        </div>
      )}

      {/* Course Grid */}
      {filteredCourses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card
              key={course.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => alert(`Navigate to course detail: ${course.title}`)}
            >
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-xl">{course.title}</CardTitle>
                  <Badge variant="secondary">{course.status}</Badge>
                </div>
                <CardDescription>
                  {course.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  By {course.author.name || course.author.email}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    alert(`View details for: ${course.title}`);
                  }}
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
