// CourseDetailPage — shows a single course and its skill-tree nodes.
// Loads when a learner clicks a course card. courseId comes from the URL.
import { Link, useParams } from "react-router-dom";
import { usePublicCourseQuery } from "@synth-tree/api-types";

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const { data, loading, error } = usePublicCourseQuery({
    variables: { id: courseId ?? "" },
    skip: !courseId,
  });

  if (loading) return <div className="p-8">Loading…</div>;
  if (error) return <div className="p-8">Error: {error.message}</div>;

  const course = data?.publicCourse;
  if (!course) return <div className="p-8">Course not found.</div>;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 p-8">
      <Link to="/" className="text-sm text-gray-500 hover:underline">
        ← Back to courses
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
        {course.description && (
          <p className="mt-2 text-lg text-gray-600">{course.description}</p>
        )}
      </div>

      {course.trees.map((tree) => {
        const nodes = [...tree.nodes].sort(
          (a, b) => a.step - b.step || a.orderInStep - b.orderInStep,
        );
        return (
          <section key={tree.id} className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold text-gray-900">{tree.title}</h2>
            {tree.description && (
              <p className="text-sm text-gray-500">{tree.description}</p>
            )}
            <ol className="flex flex-col gap-2">
              {nodes.map((node, i) => (
                <li key={node.id}>
                  <Link
                    to={`/courses/${course.id}/nodes/${node.id}`}
                    className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 transition-shadow hover:shadow-md"
                  >
                    <span className="font-medium text-gray-900">
                      {i + 1}. {node.title}
                    </span>
                    {node.quiz && (
                      <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                        Quiz
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        );
      })}
    </div>
  );
}
