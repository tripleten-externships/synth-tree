import React from "react";
import { Skeleton } from "./skeleton";

export function SkeletonModal() {
	return (
		<div className="w-[604px] h-[642px] p-8 border rounded-[20px] bg-white flex flex-col gap-[44px]">
			<Skeleton shape="rectangle" className="h-10 w-full" /> {/* Name */}
			<Skeleton shape="rectangle" className="h-10 w-full" /> {/* Email */}
			<Skeleton shape="rectangle" className="h-10 w-full" /> {/* Password */}
			<Skeleton shape="rectangle" className="h-10 w-full" /> {/* Repeat password */}
			<Skeleton shape="rectangle" className="h-12 w-full" /> {/* Sign up button */}
			<Skeleton shape="rectangle" className="h-8 w-1/2" /> {/* Log In link */}
			<Skeleton shape="rectangle" className="h-12 w-full" /> {/* Google button */}
			<Skeleton shape="rectangle" className="h-12 w-full" /> {/* Facebook button */}
		</div>
	);
}