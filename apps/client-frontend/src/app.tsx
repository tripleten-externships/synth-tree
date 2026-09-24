import { createBrowserRouter, RouterProvider } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
// ErrorBoundary lives inside ProtectedMainLayout because React Router's default
// ErrorBoundary would otherwise replace it.
import ErrorBoundary from "./components/ErrorBoundary";
import MainLayout from "./layouts/MainLayout";

import Home from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import LessonsPage from "./pages/LessonsPage";
import SkillTreesPage from "./pages/SkillTreesPage";
import ProfilePage from "./pages/ProfilePage";
import CourseDetailPage from "./pages/CourseDetailPage";
import NodePage from "./pages/NodePage";
import CatalogPage from "./pages/CatalogPage";
import SignInPage from "./pages/auth/SignInPage";
import NotFoundPage from "./pages/NotFoundPage";
import SignUpPage from "./pages/auth/SignUpPage";
import { Toaster } from "@synth-tree/ui";

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
    path: "/auth/login",
    element: <SignInPage />,
  },
  {
    path: "/",
    element: <ProtectedMainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "leaderboard", element: <LeaderboardPage /> },
      { path: "lessons", element: <LessonsPage /> },
      { path: "skill-trees", element: <SkillTreesPage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "courses/:courseId", element: <CourseDetailPage /> },
      { path: "courses/:courseId/nodes/:nodeId", element: <NodePage /> },
      { path: "catalog", element: <CatalogPage /> },
    ],
  },
  {
    path: "/auth/signup",
    element: <SignUpPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster position="top-center" />
    </AuthProvider>
  );
}
