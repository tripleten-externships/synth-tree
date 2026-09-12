import { usePublicGetAllCoursesQuery } from "@synth-tree/api-types";
import { useNavigate } from "react-router-dom";
import RecommendedNextCarousel from "../components/RecommendedNextCarousel";
import CourseCard from "../components/CourseCard";
import { MY_PROGRESS_QUERY } from "../graphql/queries/myProgress";
import { useQuery } from "@apollo/client/react";
import ContinueCard from "../components/ContinueCard";

type ProgressItem = {
  id: string;
  status: string;
  updatedAt: string;
  node: {
    id: string;
    title: string;
    tree: {
      id: string;
      title: string;
      course: {
        id: string;
        title: string;
      };
    };
  };
};

type MyProgressData = {
  myProgress: ProgressItem[];
};

// Placeholder courses shown when the database has nothing published yet.
// Once seed/admin-created courses exist, the API result wins automatically.
const placeholderCourses = [
  { id: "1", title: "Organic Chemistry", description: "Learn the basics of organic chemistry" },
  { id: "2", title: "Basics of Physics", description: "Introduction to physics concepts" },
  { id: "3", title: "Advanced Geometry", description: "Deep dive into geometric principles" },
];

export default function Home() {
  const { data, loading, error } = usePublicGetAllCoursesQuery();
  // navigate() lets us send the user to a different page when they click something
  const { data: progressData } = useQuery<MyProgressData>(MY_PROGRESS_QUERY, {
    fetchPolicy: "network-only",
  });

  const navigate = useNavigate();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const apiCourses = data?.publicGetAllCourses ?? [];
  const courses = apiCourses.length > 0 ? apiCourses : placeholderCourses;
  const inProgressLesson = progressData?.myProgress?.find(
    (progress) => progress.status === "IN_PROGRESS",
  );

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-10 px-4 py-10 text-center sm:py-14">
      <header className="flex max-w-2xl flex-col items-center gap-4">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Welcome to Synth<span className="text-primary">Tree</span>
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
          A collection of courses on organic chemistry and more, organised into a clear study path
          with theory and quizzes built in.
        </p>
      </header>

      <section className="w-full">
        {inProgressLesson ? (
          <ContinueCard
            courseTitle={inProgressLesson.node.tree.course.title}
            lessonTitle={inProgressLesson.node.title}
            onResume={() =>
              navigate(
                `/courses/${inProgressLesson.node.tree.course.id}/nodes/${inProgressLesson.node.id}`,
              )
            }
          />
        ) : (
          <button
            type="button"
            onClick={() => navigate("/catalog")}
            className="w-full rounded-3xl border-2 border-dashed border-border bg-card p-10 text-center text-muted-foreground shadow-sm transition-colors hover:border-primary hover:bg-accent hover:text-accent-foreground"
          >
            Browse catalog
          </button>
        )}
      </section>

      <section className="w-full">
        <RecommendedNextCarousel />
      </section>

      <section className="w-full">
        <h2 className="mb-4 text-left text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Courses
        </h2>
        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.title}
              description={course.description ?? ""}
            />
          ))}
        </div>
      </section>

      {/* "Browse catalog" card — takes the user to the full course catalog page.
      <button
        type="button"
        onClick={() => navigate("/catalog")}
        className="w-full max-w-3xl rounded-3xl border-2 border-dashed border-border bg-card p-8 text-card-foreground shadow-sm transition-colors hover:border-primary hover:bg-accent hover:text-accent-foreground"
      >
        <span className="text-sm font-medium">Browse the full catalog →</span>
      </button> */}
    </div>
  );
}
