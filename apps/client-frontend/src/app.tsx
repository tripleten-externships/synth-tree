import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary"; // put ErrorBoundary in ProtectedMainLayout() because it gets overwritten by React-Routers default ErrorBoundary otherwise.

import MainLayout from "../layouts/MainLayout";
import SkillTreeHome from "./pages/SkillTreeHomePage";

import DashboardPage from "./pages/DashboardPage";
import LessonsPage from "./pages/LessonsPage";
import SkillTreesPage from "./pages/SkillTreesPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";

// A wrapper that combines protection + your layout + an Outlet
function ProtectedMainLayout() {
  return (
    <ErrorBoundary>
      <ProtectedRoute>
        <MainLayout>
          <Outlet />
        </MainLayout>
      </ProtectedRoute>
    </ErrorBoundary>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedMainLayout />, // shared shell for all main routes
    children: [
      {
        index: true, // "/" route
        element: <SkillTreeHome />, // SkillTree Home.tsx
      },
      {
        path: "dashboard", // "/dashboard"
        element: <DashboardPage />,
      },
      {
        path: "lessons", // "/lessons"
        element: <LessonsPage />,
      },
      {
        path: "skill-trees", // "/skill-trees"
        element: <SkillTreesPage />,
      },
      {
        path: "profile", // "/profile"
        element: <ProfilePage />,
      },
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
