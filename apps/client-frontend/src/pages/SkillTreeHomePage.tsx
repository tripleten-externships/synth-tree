import { usePublicGetAllCoursesQuery } from "@synth-tree/api-types";
import { useNavigate } from "react-router-dom";
import RecommendedNextCarousel from "../components/RecommendedNextCarousel";
import CourseCard from "../components/CourseCard";

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
  const navigate = useNavigate();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const apiCourses = data?.publicGetAllCourses ?? [];
  const courses = apiCourses.length > 0 ? apiCourses : placeholderCourses;

  return (
    <div className="flex flex-col items-center text-center gap-6">
      <h1 className="text-[32px] font-medium leading-none text-[#212121]">Synth Tree</h1>

      <p className="max-w-3xl text-[32px] font-medium leading-none text-[#212121] mt-4">
        Synth Tree is a collection of courses on organic chemistry and more, organised in a clear
        study path with theory and quizzes inside.
      </p>

      <RecommendedNextCarousel />

      <div className="mt-12 grid w-full max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            id={course.id}
            title={course.title}
            description={course.description ?? ""}
          />
        ))}
      </div>

      {/* "Browse catalog" card — clicking it takes the user to the full course catalog page.
          The dashed border style matches the design mock for this card.
          TODO: the design shows a circle icon above the text — we don't have that asset yet.
          Once we find or receive the correct SVG file, add it here as an <img> above the <p>. */}
      <div
        className="mt-10 w-full max-w-3xl rounded-3xl border-2 border-dashed border-gray-300 bg-white p-10 shadow-sm cursor-pointer transition-shadow hover:shadow-lg text-center"
        onClick={() => navigate("/catalog")}
      >
        <p className="text-gray-500">Browse catalog</p>
      </div>
    </div>
  );
}
