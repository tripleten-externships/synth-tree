// NodePage — a single skill node: its lesson content + (optional) quiz.
// Route: /courses/:courseId/nodes/:nodeId
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { usePublicCourseQuery } from "@synth-tree/api-types";
import { Hex } from "@synth-tree/ui";
import { LessonViewer } from "../components/LessonViewer";
import { PLACEHOLDER_ICON } from "../lib/deriveSkillTree";

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
  const tree = course?.trees.find((t) => t.nodes.some((n) => n.id === nodeId));
  const node = tree?.nodes.find((n) => n.id === nodeId);
  if (!course || !tree || !node) return <div className="p-8">Lesson not found.</div>;

  return (
    <div className="mx-auto flex max-w-3xl flex-col p-6 lg:p-8">
      <Link
        to={`/courses/${course.id}`}
        className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to course
      </Link>

      {/* Breadcrumb: course · chapter (the node's tree). */}
      <div className="mb-2 flex items-center gap-3">
        {/* TODO(SYN-28 icon follow-up): nodes have no icon field yet. */}
        <Hex icon={PLACEHOLDER_ICON as never} status="current" size={36} />
        <p className="text-sm text-muted-foreground">
          <Link to={`/courses/${course.id}`} className="hover:underline">
            {course.title}
          </Link>{" "}
          · {tree.title}
        </p>
      </div>

      <h1 className="mb-6 text-3xl font-bold text-foreground">{node.title}</h1>

      {/* Lesson content. Opening this marks the node in progress (SYN-31). */}
      <LessonViewer
        nodeId={node.id}
        quiz={node.quiz}
        onNext={() => navigate(`/courses/${course.id}`)}
      />
    </div>
  );
}
