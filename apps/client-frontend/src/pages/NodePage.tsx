// NodePage — a single skill node: its lesson content + (optional) quiz.
// Route: /courses/:courseId/nodes/:nodeId
import { Link, useNavigate, useParams } from "react-router-dom";
import { usePublicCourseQuery } from "@synth-tree/api-types";
import { LessonViewer } from "../components/LessonViewer";
import QuizRunner from "../components/QuizRunner";

export default function NodePage() {
  const { courseId, nodeId } = useParams();
  const navigate = useNavigate();

  const { data, loading, error } = usePublicCourseQuery({
    variables: { id: courseId ?? "" },
    skip: !courseId,
  });

  if (loading) return <div className="p-8">Loading…</div>;
  if (error) return <div className="p-8">Error: {error.message}</div>;

  const course = data?.publicCourse;
  const node = course?.trees.flatMap((t) => t.nodes).find((n) => n.id === nodeId);
  if (!course || !node) return <div className="p-8">Lesson not found.</div>;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 p-8">
      <Link
        to={`/courses/${course.id}`}
        className="text-sm text-gray-500 hover:underline"
      >
        ← Back to {course.title}
      </Link>

      <h1 className="text-2xl font-bold text-gray-900">{node.title}</h1>

      {/* Lesson content. Opening this marks the node in progress (SYN-31). */}
      <LessonViewer nodeId={node.id} onNext={() => navigate(`/courses/${course.id}`)} />

      {node.quiz && <QuizRunner quiz={node.quiz} />}
    </div>
  );
}
