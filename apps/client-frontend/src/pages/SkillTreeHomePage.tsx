import OrganicChemistry from "../../assets/organic-chemistry.svg";
import BasicsOfPhysics from "../../assets/basics-of-physics.svg";
import AdvancedGeometry from "../../assets/advanced-geometry.svg";
import NodeIcon from "../../assets/node-icon.svg";

export default function Home() {
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
        
        {/* Organic Chemistry */}
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <img src={OrganicChemistry} alt="Organic Chemistry" className="h-12 mx-auto mb-4" />
          <h3 className="mb-2 text-lg font-semibold">Organic Chemistry</h3>
          <p className="text-sm text-gray-600">10 chapters · 100 hours of learning</p>
        </div>

        {/* Basics of Physics */}
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <img src={BasicsOfPhysics} alt="Basics of Physics" className="h-12 mx-auto mb-4" />
          <h3 className="mb-2 text-lg font-semibold">Basics of Physics</h3>
          <p className="text-sm text-gray-600">12 chapters · 120 hours of learning</p>
        </div>

        {/* Advanced Geometry */}
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <img src={AdvancedGeometry} alt="Advanced Geometry" className="h-12 mx-auto mb-4" />
          <h3 className="mb-2 text-lg font-semibold">Advanced Geometry</h3>
          <p className="text-sm text-gray-600">5 chapters · 50 hours of learning</p>
        </div>

      </div>

      {/* More Courses Coming Soon */}
      <div className="mt-10 w-full max-w-3xl rounded-3xl border border-gray-200 bg-white p-10 shadow-sm">
        <img src={NodeIcon} alt="More Courses Coming Soon" className="h-12 mx-auto mb-4" />
        <p className="text-gray-500">More courses coming soon</p>
      </div>
    </div>
  );
}
