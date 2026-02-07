import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";


import MainLayout from "../layouts/MainLayout";
import SkillTreeHome from "./pages/SkillTreeHomePage";


import DashboardPage from "./pages/DashboardPage";
import LessonsPage from "./pages/LessonsPage";
import SkillTreesPage from "./pages/SkillTreesPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import CourseCatalog from "./pages/CourseCatalog";
import CourseCatalogDemo from "./pages/CourseCatalogDemo";

// A wrapper that combines protection + your layout + an Outlet
function ProtectedMainLayout() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <Outlet />
      </MainLayout>
    </ProtectedRoute>
  );
}

const router = createBrowserRouter([
  {
    path: "/courses-demo",
    element: <CourseCatalogDemo />,  // Demo version with mock data
  },
  {
    path: "/",
    element: <ProtectedMainLayout />,  // shared shell for all main routes
    children: [
      {
        index: true,            // "/" route
        element: <SkillTreeHome />, // SkillTree Home.tsx
      },
      {
        path: "courses",        // "/courses"
        element: <CourseCatalog />,
      },
      {
        path: "dashboard",      // "/dashboard"
        element: <DashboardPage />,
      },
      {
        path: "lessons",        // "/lessons"
        element: <LessonsPage />,
      },
      {
        path: "skill-trees",    // "/skill-trees"
        element: <SkillTreesPage />,
      },
      {
        path: "profile",        // "/profile"
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
