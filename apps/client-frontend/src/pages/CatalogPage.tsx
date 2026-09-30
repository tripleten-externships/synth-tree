import { useEffect, useMemo, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  useMyProgressQuery,
  usePublicGetAllCoursesQuery,
} from "@synth-tree/api-types";
import CourseCard from "../components/CourseCard";

type CatalogTab = "all" | "enrolled";

function useFirebaseUid() {
  const [uid, setUid] = useState<string | null>(
    () => getAuth().currentUser?.uid ?? null,
  );

  useEffect(() => {
    return onAuthStateChanged(getAuth(), (user) => {
      setUid(user?.uid ?? null);
    });
  }, []);

  return uid;
}

export default function CatalogPage() {
  const uid = useFirebaseUid();
  const {
    data,
    loading: coursesLoading,
    error: coursesError,
  } = usePublicGetAllCoursesQuery();
  const {
    data: progressData,
    loading: progressLoading,
    error: progressError,
  } = useMyProgressQuery({
    variables: uid ? { userId: uid } : undefined,
    skip: !uid,
  });

  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<CatalogTab>("all");

  const courses = data?.publicGetAllCourses ?? [];
  const progress = progressData?.myProgress ?? [];

  const enrolledTreeIds = useMemo(() => {
    const ids = new Set<string>();
    for (const row of progress) {
      const treeId = row.node?.treeId;
      if (treeId) ids.add(treeId);
      console.log("Enrolled");
    }
    return ids;
  }, [progress]);

  const filteredCourses = useMemo(() => {
    const q = query.trim().toLowerCase();

    return courses.filter((course) => {
      const matchesQuery =
        q.length === 0 ||
        course.title.toLowerCase().includes(q) ||
        (course.description ?? "").toLowerCase().includes(q);

      const enrolled = course.trees.some((tree) => enrolledTreeIds.has(tree.id));
      const matchesTab = tab === "all" || enrolled;

      return matchesQuery && matchesTab;
    });
  }, [courses, query, tab, enrolledTreeIds]);

  const loading = coursesLoading || (!!uid && progressLoading);
  const error = coursesError ?? progressError;

  if (loading) {
    return (
      <div className="text-muted-foreground py-12 text-center text-sm">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive py-12 text-center text-sm">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-7 flex items-center gap-3">
        <div className="relative max-w-[400px] flex-1">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted-foreground pointer-events-none absolute left-3.5 top-3"
            aria-hidden
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses…"
            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring h-10 w-full rounded-md border px-3 py-2 pl-[38px] text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          />
        </div>

        <div className="bg-muted inline-flex items-center rounded-lg p-1">
          <button
            type="button"
            onClick={() => setTab("all")}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              tab === "all"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setTab("enrolled")}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              tab === "enrolled"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Enrolled
          </button>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="text-muted-foreground py-12 text-center text-sm">
          No courses yet — admins create them in the dashboard
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-muted-foreground py-12 text-center text-sm">
          No courses match your search
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.title}
              description={course.description ?? ""}
            />
          ))}
        </div>
      )}
    </div>
  );
}
