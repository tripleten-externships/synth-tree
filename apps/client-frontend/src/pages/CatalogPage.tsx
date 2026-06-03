import { usePublicGetAllCoursesQuery } from "@synth-tree/api-types";
import CourseCard from "../components/CourseCard";

export default function CatalogPage() {
  const { data, loading, error } = usePublicGetAllCoursesQuery();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const courses = data?.publicGetAllCourses ?? [];

  if (courses.length === 0) {
    return <div>No courses yet — admins create them in the dashboard</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          id={course.id}
          title={course.title}
          description={course.description ?? ""}
        />
      ))}
    </div>
  );
}
