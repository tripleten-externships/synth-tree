// CourseDetailPage — a course's skill tree with a progress sidebar (SYN-30).
// Loads when a learner clicks a course card. courseId comes from the URL.
import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useLearnerCourseTreeQuery } from "@synth-tree/api-types";
import { Button, Card, Hex, Progress } from "@synth-tree/ui";
import CourseSkillTree from "../components/CourseSkillTree";
import { deriveSkillTree, PLACEHOLDER_ICON } from "../lib/deriveSkillTree";
import { summarizeCourseProgress } from "../lib/courseProgress";

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-1 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold tabular-nums text-foreground">{value}</span>
    </div>
  );
}

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { data, loading, error } = useLearnerCourseTreeQuery({
    variables: { courseId: courseId ?? "" },
    skip: !courseId,
    // Refetch on every visit so node states reflect lessons finished since.
    fetchPolicy: "cache-and-network",
  });

  const course = data?.courseForLearner;
  const allNodes = useMemo(() => course?.trees.flatMap((t) => t.nodes) ?? [], [course]);
  const progress = useMemo(
    () => summarizeCourseProgress(allNodes, deriveSkillTree(allNodes).nodes),
    [allNodes],
  );

  if (loading && !course) return <div className="p-8">Loading…</div>;
  if (error && !course) return <div className="p-8">Error: {error.message}</div>;
  if (!course) return <div className="p-8">Course not found.</div>;

  const trees = course.trees.filter((t) => t.nodes.length > 0);

  return (
    <div className="mx-auto max-w-6xl p-6 lg:p-8">
      <Link to="/" className="text-sm text-muted-foreground hover:underline">
        ← Back to home
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[320px_1fr] lg:items-start lg:gap-12">
        <aside className="flex flex-col gap-5 lg:sticky lg:top-24">
          {/* TODO(SYN-28 icon follow-up): courses have no icon field yet. */}
          <Hex icon={PLACEHOLDER_ICON as never} status="current" size={72} />

          <div>
            <h1 className="text-3xl font-bold text-foreground">{course.title}</h1>
            {course.description && (
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {course.description}
              </p>
            )}
          </div>

          <div>
            <div className="mb-1.5 flex items-baseline justify-between">
              <span className="text-sm font-medium text-foreground">Course progress</span>
              <span className="text-sm font-semibold tabular-nums text-primary">
                {progress.percent}%
              </span>
            </div>
            <Progress value={progress.percent} />
          </div>

          <Card className="p-4">
            <StatRow label="Chapters passed" value={`${progress.completed}/${progress.total}`} />
            {/* XP and time per course aren't tracked yet (SYN-78). */}
            <StatRow label="XP earned" value="—" />
            <StatRow label="Time spent" value="—" />
          </Card>

          {progress.continueNodeId && (
            <Button
              size="lg"
              className="w-full"
              onClick={() => navigate(`/courses/${course.id}/nodes/${progress.continueNodeId}`)}
            >
              {progress.allComplete ? "Review course" : "Continue learning"} →
            </Button>
          )}
        </aside>

        <main className="flex flex-col gap-10">
          {trees.length === 0 && (
            <p className="text-muted-foreground">This course doesn't have any lessons yet.</p>
          )}

          {trees.map((tree) => (
            <section key={tree.id} className="flex flex-col gap-4">
              {trees.length > 1 && (
                <h2 className="text-xl font-semibold text-foreground">{tree.title}</h2>
              )}
              <div className="mx-auto w-full max-w-[520px]">
                <CourseSkillTree courseId={course.id} nodes={tree.nodes} />
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}
