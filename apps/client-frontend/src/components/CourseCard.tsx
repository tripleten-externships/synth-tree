// Importing pre-built Card pieces from the shared UI library (@skilltree/ui)
import { Card, CardContent, CardTitle, CardDescription } from "@skilltree/ui";

// useNavigate lets us send the user to a different page when they click the card
import { useNavigate } from "react-router-dom";

// This defines what information CourseCard needs to work:
// id — used to navigate to the correct course detail page
// title — the name of the course shown on the card
// description — a short summary shown below the title
interface CourseCardProps {
  id: string;
  title: string;
  description: string;
}

// CourseCard — displays a single course as a clickable card
// Used in SkillTreeHomePage and CourseCatalog to show each course in the grid
export default function CourseCard({ id, title, description }: CourseCardProps) {
  // navigate() is the function we call to send the user to a new page
  const navigate = useNavigate();

  return (
    // Clicking anywhere on the card takes the user to the course detail page
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow border border-gray-200 rounded-3xl bg-white"
      onClick={() => navigate(`/courses/${id}`)}
    >
      <CardContent className="p-8">
        {/* Course title shown in bold */}
        <CardTitle className="mb-2 text-lg font-semibold text-gray-900">{title}</CardTitle>

        {/* Course description shown in smaller gray text below the title */}
        <CardDescription className="text-sm text-gray-600">{description}</CardDescription>
      </CardContent>
    </Card>
  );
}