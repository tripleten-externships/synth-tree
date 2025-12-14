import React from "react";
import { Skeleton } from "./skeleton";

export function SkeletonQuizList() {
  return (
    <div className="w-[800px] flex flex-col gap-[40px]">
      {/* Header */}
      <Skeleton shape="rectangle" className="h-10 w-1/2 mb-4" />
      {/* Button */}
      <Skeleton shape="rectangle" className="h-10 w-32 mb-4" />
      {/* Questions */}
      {Array.from({ length: 13 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          {/* For questions with images (e.g., first few) */}
          {i < 5 && <Skeleton shape="rectangle" className="h-16 w-24" />}
            <Skeleton shape={i === 6 ? "hexagon" : "rectangle"} className="h-12 w-full" />
        </div>
      ))}
      {/* Bottom Button */}
      <Skeleton shape="rectangle" className="h-10 w-32 mt-4" />
    </div>
  );
}