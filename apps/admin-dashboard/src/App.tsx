import { Toaster } from "@synth-tree/ui";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import ErrorBoundary from "./components/ErrorBoundary";
import { ProtectedRoutes } from "./components/ProtectedRoutes";
import { AuthProvider } from "./contexts/AuthContext";
import { AuthFeature } from "./features/auth";
import DashboardLayout from "./layouts/DashboardLayout";
import CourseBuilder from "./pages/courses/CourseBuilder";
import CoursesList from "./pages/courses/CoursesList";

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <Routes>
            <Route path="/auth/*" element={<AuthFeature />} />
            <Route
              path="/*"
              element={
                <ProtectedRoutes>
                  <Routes>
                    <Route path="/dashboard" element={<Navigate to="/courses" replace />} />
                    <Route path="/" element={<Navigate to="/courses" replace />} />
                    <Route
                      path="/courses"
                      element={
                        <DashboardLayout>
                          <CoursesList />
                        </DashboardLayout>
                      }
                    />
                    <Route
                      path="/courses/:courseId/edit"
                      element={
                        <DashboardLayout>
                          <CourseBuilder />
                        </DashboardLayout>
                      }
                    />
                  </Routes>
                </ProtectedRoutes>
              }
            />
          </Routes>
          <Toaster position="top-center" />
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
