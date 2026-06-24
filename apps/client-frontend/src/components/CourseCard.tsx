// Importing pre-built Card pieces from the shared UI library (@synth-tree/ui)
import { Card, CardContent, CardTitle, CardDescription } from "@synth-tree/ui";
// ReactNode is a TypeScript type that means "anything React can render" —
// a component, a string, a <div>, etc. We use it so TypeScript knows the
// icon prop can hold any kind of renderable React content.
import { type ReactNode } from "react";

// useNavigate lets us send the user to a different page when they click the card
import { useNavigate } from "react-router-dom";

// This defines what information CourseCard needs to work:
// id — used to navigate to the correct course detail page
// title — the name of the course shown on the card
// description — a short summary shown below the title
// icon — optional SVG/icon to show inside the hex shape at the top of the card
// chapters — optional total number of chapters in the course
// hours — optional total hours to complete the course
// learners — optional number of people enrolled
// progress — optional 0–100 number; when provided, shows a progress bar and "X% complete"
interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  icon?: ReactNode;
  chapters?: number;
  hours?: number;
  learners?: number;
  progress?: number;
}

// Converts a raw learner count into a short readable string.
// e.g. 8400 → "8.4k", 500 → "500"
function formatLearners(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return count.toString();
}

// CourseCard — displays a single course as a clickable card
// Used in SkillTreeHomePage and CourseCatalog to show each course in the grid
// Destructuring pulls each prop out of the props object so we can use them by name below.
// The optional props (icon, chapters, hours, learners, progress) won't be passed by every
// caller — when they're left out, they'll just be undefined and we skip rendering that section.
export default function CourseCard({ id, title, description, icon, chapters, hours, learners, progress }: CourseCardProps) {
  // navigate() is the function we call to send the user to a new page
  const navigate = useNavigate();

  return (
    // Clicking anywhere on the card takes the user to the course detail page
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow border border-gray-200 rounded-3xl bg-white"
      onClick={() => navigate(`/courses/${id}`)}
    >
      <CardContent className="p-8">
        {/* Hex icon — only shown when an icon prop is passed.
            The && means "if icon exists, render this". If no icon is passed, nothing renders here.
            TODO: revisit once the API returns an icon field on Course, or once lucide-react
            is added as a direct dependency here (to match the admin dashboard's approach). */}
        {icon && (
          <div
            className="w-16 h-16 bg-blue-500 flex items-center justify-center text-white mb-4"
            style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
          >
            {icon}
          </div>
        )}

        {/* Course title shown in bold */}
        <CardTitle className="mb-2 text-lg font-semibold text-gray-900">{title}</CardTitle>

        {/* Course description shown in smaller gray text below the title */}
        <CardDescription className="text-sm text-gray-600">{description}</CardDescription>

        {/* Stats row — only shown if at least one of chapters, hours, or learners is passed.
            != null checks if a value is not null or undefined. Since all three props are optional,
            any of them could be missing. The || means "or" — any one being present is enough
            to render the row. The left span builds "12 chapters · 100h" and the right span
            shows "8.4k learners". The dot separator " · " only renders if both chapters and
            hours are present, so we never get a floating dot if one is missing. */}
        {(chapters != null || hours != null || learners != null) && (
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>
              {chapters != null && `${chapters} chapters`}
              {chapters != null && hours != null && " · "}
              {hours != null && `${hours}h`}
            </span>
            <span>{learners != null && `${formatLearners(learners)} learners`}</span>
          </div>
        )}

        {/* Progress bar — only shown when a progress prop is passed (meaning the user is enrolled).
            progress is a number from 0 to 100. The inner bar's width is set as a percentage
            using an inline style, so progress={42} makes it fill 42% of the track. */}
        {progress != null && (
          <div>
            <div className="w-full h-1.5 bg-gray-200 rounded-full mb-1">
              <div
                className="h-1.5 bg-blue-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-500">{progress}% complete</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
