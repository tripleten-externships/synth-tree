import { useParams, Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useAdminCourseQuery, useUpdateCourseMutation } from "@synth-tree/api-types";
import { act, useEffect, useState } from "react";

function CourseBuilder() {
  const { courseId } = useParams();
  const { data, loading, error } = useAdminCourseQuery({
    variables: { id: courseId ?? "" },
    skip: !courseId,
  });

  const [formData, setFormData] = useState({ title: "", description: "", status: "" });
  const [activeTab, setActiveTab] = useState<"meta" | "tree" | "inspector">("meta");
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
    <>
      {/* mobile tab buttons */}
      <div className="flex gap-1 lg:hidden pt-2">
        <button
          className={`text-sm font-medium cursor-pointer text-muted-foreground border-0 bg-transparent flex-1 py-[7px] px-3.5 rounded-[9px] transition-all duration-[120ms]
                  ${activeTab === "meta" ? "bg-background text-foreground shadow-[0px_2px_3px_0px_rgba(0,0,0,0.16),0px_1px_2px_-1px_rgba(0,0,0,0.16)]" : "bg-transparent text-muted-foreground"}`}
          onClick={() => setActiveTab("meta")}
        >
          Meta
        </button>
        <button
          className={`text-sm font-medium cursor-pointer text-muted-foreground border-0 bg-transparent flex-1 py-[7px] px-3.5 rounded-[9px] transition-all duration-[120ms]
                  ${activeTab === "tree" ? "bg-background text-foreground shadow-[0px_2px_3px_0px_rgba(0,0,0,0.16),0px_1px_2px_-1px_rgba(0,0,0,0.16)]" : "bg-transparent text-muted-foreground"}`}
          onClick={() => setActiveTab("tree")}
        >
          Tree
        </button>
        <button
          className={`text-sm font-medium cursor-pointer text-muted-foreground border-0 bg-transparent flex-1 py-[7px] px-3.5 rounded-[9px] transition-all duration-[120ms]
                  ${activeTab === "inspector" ? "bg-background text-foreground shadow-[0px_2px_3px_0px_rgba(0,0,0,0.16),0px_1px_2px_-1px_rgba(0,0,0,0.16)]" : "bg-transparent text-muted-foreground"}`}
          onClick={() => setActiveTab("inspector")}
        >
          Inspector
        </button>
      </div>

      <div className="grid min-h-[calc(100vh-6rem)] grid-cols-1 gap-4 py-4 lg:grid-cols-[300px_1fr_320px]">
        <aside
          className={`rounded-lg border bg-card p-4 ${activeTab === "meta" ? "block" : "hidden"} lg:block`}
        >
          {loading && <p className="text-sm text-muted-foreground">Loading...</p>}

          {error && <p className="text-sm text-muted-foreground">Error</p>}

          {!loading && !error && !data?.adminCourse && (
            <p className="text-sm text-muted-foreground">Course not found</p>
          )}

          {data?.adminCourse && (
            <div className="flex flex-col gap-4">
              <Link
                to="/courses"
                className="flex items-center gap-1 text-sm font-medium text-muted-foreground"
              >
                <ChevronLeft className="h-4 w-4" />
                All courses
              </Link>
              <input
                className="w-full mt-4 text-xl font-bold py-2.5 px-3 rounded-sm border border-transparent focus:outline-none focus:ring focus:ring-primary/15"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                onBlur={() => handleBlur("title")}
              />
              <textarea
                rows={3}
                className="w-full text-sm text-muted-foreground mt-2 py-2.5 rounded-sm border border-transparent focus:outline-none focus:ring focus:ring-primary/15"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                onBlur={() => handleBlur("description")}
              />
              <div className="h-px bg-border my-6" />
              <div className="flex flex-col gap-4">
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Course settings
                </h4>
                <label className="mb-1.5 block text-foreground text-sm font-medium">
                  Visibility
                </label>
                <div className="flex gap-2">
                  <button
                    className={`text-sm font-medium cursor-pointer text-muted-foreground border-0 bg-transparent flex-1 py-[7px] px-3.5 rounded-[9px] transition-all duration-[120ms]
                  ${formData.status === "DRAFT" ? "bg-background text-foreground shadow-[0px_2px_3px_0px_rgba(0,0,0,0.16),0px_1px_2px_-1px_rgba(0,0,0,0.16)]" : "bg-transparent text-muted-foreground"}`}
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
                  </button>
                  <button
                    className={`text-sm font-medium cursor-pointer text-muted-foreground border-0 bg-transparent flex-1 py-[7px] px-3.5 rounded-[9px] transition-all duration-[120ms]
                  ${formData.status === "PUBLISHED" ? "bg-background text-foreground shadow-[0px_2px_3px_0px_rgba(0,0,0,0.16),0px_1px_2px_-1px_rgba(0,0,0,0.16)]" : "bg-transparent text-muted-foreground"}`}
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
                  </button>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {formData.status === "DRAFT"
                    ? "Only admins can see this course."
                    : "Visible to all learners."}
                </p>
              </div>
            </div>
          )}
        </aside>

        <section
          className={`rounded-lg border bg-card p-4 ${activeTab === "tree" ? "block" : "hidden"} lg:block`}
        >
          <h2 className="text-lg font-semibold">Tree Canvas</h2>
          <p className="text-sm text-muted-foreground">Empty tree canvas.</p>
        </section>

        <aside
          className={`rounded-lg border bg-card p-4 ${activeTab === "inspector" ? "block" : "hidden"} lg:block`}
        >
          <h2 className="text-lg font-semibold">Inspector</h2>
          <p className="text-sm text-muted-foreground">Inspector pane.</p>
        </aside>
      </div>
    </>
  );
}

export default CourseBuilder;
