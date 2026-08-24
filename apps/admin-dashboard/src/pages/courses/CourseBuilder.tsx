import { useParams } from "react-router-dom";
import { useAdminCourseQuery } from "@synth-tree/api-types";

function CourseBuilder() {
  const { courseId } = useParams();
  const { data, loading, error } = useAdminCourseQuery({
    variables: { id: courseId ?? "" },
    skip: !courseId,
  });

  return (
    <div className="grid min-h-[calc(100vh-6rem)] grid-cols-1 gap-4 py-4 lg:grid-cols-[300px_1fr_320px]">
      <aside className="rounded-lg border bg-card p-4">
        {loading && <p className="text-sm text-muted-foreground">Loading...</p>}

        {error && <p className="text-sm text-muted-foreground">Error</p>}

        {!loading && !error && !data?.adminCourse && (
          <p className="text-sm text-muted-foreground">Course not found</p>
        )}

        {data?.adminCourse && (
          <>
            <h2 className="text-lg font-semibold">{data.adminCourse.title}</h2>
            <p className="text-sm text-muted-foreground">{data.adminCourse.description}</p>
            <p className="text-sm text-muted-foreground">{data.adminCourse.status}</p>
          </>
        )}
      </aside>

      <section className="rounded-lg border bg-card p-4">
        <h2 className="text-lg font-semibold">Tree Canvas</h2>
        <p className="text-sm text-muted-foreground">Empty tree canvas.</p>
      </section>

      <aside className="rounded-lg border bg-card p-4">
        <h2 className="text-lg font-semibold">Inspector</h2>
        <p className="text-sm text-muted-foreground">Inspector pane.</p>
      </aside>
    </div>
  );
}

export default CourseBuilder;
