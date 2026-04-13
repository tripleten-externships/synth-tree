// import OrganicChemistry from "../../assets/organic-chemistry.svg";
// import BasicsOfPhysics from "../../assets/basics-of-physics.svg";
// import AdvancedGeometry from "../../assets/advanced-geometry.svg";

import { usePublicGetAllCoursesQuery } from "@skilltree/api-types";
import { useNavigate } from "react-router-dom";
import NodeIcon from "../../assets/node-icon.svg";

export default function Home() {
    const navigate = useNavigate();

// MOCK DATA - placeholder only, replace when real database courses are available
const mockCourses = [
  { id: "1", title: "Organic Chemistry", description: "Learn the basics of organic chemistry" },
  { id: "2", title: "Basics of Physics", description: "Introduction to physics concepts" },
  { id: "3", title: "Advanced Geometry", description: "Deep dive into geometric principles" },
];

    const { data, loading, error } = usePublicGetAllCoursesQuery();

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex flex-col items-center text-center gap-6">
      <h1 className="text-[32px] font-medium leading-none text-[#212121]">
        SkillTree
      </h1>

      <p className="max-w-3xl text-[32px] font-medium leading-none text-[#212121] mt-4">
        SkillTree is a collection of courses on organic chemistry and more,
        organised in a clear study path with theory and quizzes inside.
      </p>

      {/* COURSE CARDS */}
      <div className="mt-12 grid w-full max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3">
{/* TODO: uncomment this when database has real courses */}
{/* {data?.publicGetAllCourses?.map((course: typeof data.publicGetAllCourses[number]) => ( */}

{/* MOCK DATA - remove this line when real database courses are available */}
{(mockCourses).map((course) => (
          <div
            key={course.id}
            className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm cursor-pointer"
            onClick={() => navigate(`/courses/${course.id}`)}
          >
            <h3 className="mb-2 text-lg font-semibold">{course.title}</h3>
            <p className="text-sm text-gray-600">{course.description}</p>
          </div>
        ))}
      </div>
      <div className="mt-10 w-full max-w-3xl rounded-3xl border border-gray-200 bg-white p-10 shadow-sm">
        <img src={NodeIcon} alt="More Courses Coming Soon" className="h-12 mx-auto mb-4" />
        <p className="text-gray-500">More courses coming soon</p>
      </div>
    </div>

    );
}
