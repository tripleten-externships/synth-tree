import { createBrowserRouter, RouterProvider } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
// ErrorBoundary lives inside ProtectedMainLayout because React Router's default
// ErrorBoundary would otherwise replace it.
import ErrorBoundary from "./components/ErrorBoundary";
import MainLayout from "./layouts/MainLayout";

import SkillTreeHome from "./pages/SkillTreeHomePage";
import DashboardPage from "./pages/DashboardPage";
import LessonsPage from "./pages/LessonsPage";
import SkillTreesPage from "./pages/SkillTreesPage";
import ProfilePage from "./pages/ProfilePage";
import CourseDetailPage from "./pages/CourseDetailPage";
import NotFoundPage from "./pages/NotFoundPage";

// Shared shell for all authenticated routes.
function ProtectedMainLayout() {
  return (
    <ErrorBoundary>
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    </ErrorBoundary>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedMainLayout />,
    children: [
      { index: true, element: <SkillTreeHome /> },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "lessons", element: <LessonsPage /> },
      { path: "skill-trees", element: <SkillTreesPage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "courses/:courseId", element: <CourseDetailPage /> },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
