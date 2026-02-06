import { useState } from "react";
// @ts-ignore - Apollo Client types will resolve after TS server restart
import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { BROWSE_COURSES_QUERY } from "../graphql/queries/courseCatalog";
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

interface Course {
  id: string;
  title: string;
  description: string | null;
  status: string;
  createdAt: string;
  author: {
    id: string;
    name: string | null;
    email: string;
  };
}

export default function CourseCatalog() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  // const [category, setCategory] = useState(""); // TODO: Enable when category field is added to Course model

  const { data, loading, error } = useQuery(BROWSE_COURSES_QUERY, {
    variables: {
      search: search || undefined,
      // category: category || undefined, // TODO: Enable when category field is added
      page: 1,
      limit: 20,
    },
  });

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Course Catalog</h1>
        <div className="text-red-600">
          Failed to load courses. Please try again later.
        </div>
      </div>
    );
  }

  const courses: Course[] = data?.browseCourses ?? [];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Course Catalog</h1>
        <p className="text-muted-foreground">
          Browse and discover courses to enhance your skills
        </p>
      </div>

      {/* Search and Filter Section */}
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

          {/* Category filter - placeholder for future implementation */}
          {/* <div className="flex gap-2">
            <Button
              variant={category === "" ? "default" : "outline"}
              onClick={() => setCategory("")}
            >
              All Categories
            </Button>
            <Button
              variant={category === "frontend" ? "default" : "outline"}
              onClick={() => setCategory("frontend")}
            >
              Frontend
            </Button>
            <Button
              variant={category === "backend" ? "default" : "outline"}
              onClick={() => setCategory("backend")}
            >
              Backend
            </Button>
            <Button
              variant={category === "cloud" ? "default" : "outline"}
              onClick={() => setCategory("cloud")}
            >
              Cloud
            </Button>
          </div> */}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="text-muted-foreground">Loading courses...</div>
          </div>
        )}

        {/* Empty State */}
        {!loading && courses.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No courses found</h3>
            <p className="text-muted-foreground">
              {search
                ? "Try adjusting your search terms"
                : "No published courses available yet"}
            </p>
          </div>
        )}

        {/* Course Grid */}
        {!loading && courses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card
                key={course.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/courses/${course.id}`)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-xl">{course.title}</CardTitle>
                    <Badge variant="secondary">{course.status}</Badge>
                  </div>
                  <CardDescription>
                    {course.description || "No description available"}
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
                      navigate(`/courses/${course.id}`);
                    }}
                  >
                    View Details
                  </Button>
                  {/* TODO: Show enrollment status when auth is implemented */}
                  {/* <span className="text-sm text-muted-foreground">
                    Not enrolled
                  </span> */}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
    </div>
  );
}