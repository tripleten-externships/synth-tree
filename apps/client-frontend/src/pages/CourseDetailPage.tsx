// CourseDetailPage - shows the full details of a single course
// This page loads when a user clicks a course card
// The courseId comes from the URL e.g. /courses/123

import { useParams } from "react-router-dom";

// Shape of what a course looks like - matches the mock data in SkillTreeHomePage
interface Course {
  id: string;
  title: string;
  description: string;
}

// MOCK DATA - placeholder only, replace when real database courses are available
const mockCourses: Course[] = [
  { id: "1", title: "Organic Chemistry", description: "Learn the basics of organic chemistry" },
  { id: "2", title: "Basics of Physics", description: "Introduction to physics concepts" },
  { id: "3", title: "Advanced Geometry", description: "Deep dive into geometric principles" },
];

export default function CourseDetailPage() {
  // Grab the courseId from the URL
  const { courseId } = useParams();

  // Find the course that matches the ID in the URL
  const course = mockCourses.find((c) => c.id === courseId);

  // If no course found show a simple message
  if (!course) return <div className="p-8">Course not found.</div>;

  return (
    <div className="flex flex-col gap-6 p-8 max-w-3xl mx-auto">
      {/* Back link to go back to the course list */}
      <a href="/" className="text-sm text-gray-500 hover:underline">← Back to courses</a>

      {/* Course title */}
      <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>

      {/* Course description */}
      <p className="text-gray-600 text-lg">{course.description}</p>

      {/* Start learning button */}
      <button className="w-fit bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors">
        Start Learning
      </button>
    </div>
  );
}