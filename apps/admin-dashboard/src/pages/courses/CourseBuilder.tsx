import { useParams } from "react-router-dom";
import { useAdminCourseQuery, useUpdateCourseMutation } from "@synth-tree/api-types";
import { useEffect, useState } from "react";

import { Button } from "@synth-tree/ui";

function CourseBuilder() {
  const { courseId } = useParams();
  const { data, loading, error } = useAdminCourseQuery({
    variables: { id: courseId ?? "" },
    skip: !courseId,
  });

  const [formData, setFormData] = useState({ title: "", description: "", status: "" });
  const [updateCourse] = useUpdateCourseMutation();

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: string) => {
    updateCourse({
      variables: {
        id: courseId ?? "",
        input: { [field]: formData[field as keyof typeof formData] },
      },
    });
  };

  useEffect(() => {
    if (data?.adminCourse) {
      setFormData({
        title: data.adminCourse.title,
        description: data.adminCourse.description ?? "",
        status: data.adminCourse.status,
      });
    }
  }, [data]);

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
            <input
              className="text-lg font-semibold"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              onBlur={() => handleBlur("title")}
            />
            <textarea
              className="text-sm text-muted-foreground"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              onBlur={() => handleBlur("description")}
            />
            <Button
              variant={formData.status === "DRAFT" ? "default" : "outline"}
              onClick={() => {
                handleChange("status", "DRAFT");
                updateCourse({
                  variables: {
                    id: courseId ?? "",
                    input: { status: "DRAFT" },
                  },
                });
              }}
            >
              Draft
            </Button>
            <Button
              variant={formData.status === "PUBLISHED" ? "default" : "outline"}
              onClick={() => {
                handleChange("status", "PUBLISHED");
                updateCourse({
                  variables: {
                    id: courseId ?? "",
                    input: { status: "PUBLISHED" },
                  },
                });
              }}
            >
              Published
            </Button>
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
