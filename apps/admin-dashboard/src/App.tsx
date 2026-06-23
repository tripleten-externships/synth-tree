import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@synth-tree/ui";

import { AuthFeature } from "./features/auth";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoutes } from "./components/ProtectedRoutes";
import DashboardLayout from "./layouts/DashboardLayout";
import ErrorBoundary from "./components/ErrorBoundary";
import CoursesList from "./pages/courses/CoursesList";
import LessonEditor from "./pages/lessons/LessonEditor";

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
                    <Route
                      path="/dashboard"
                      element={<Navigate to="/courses" replace />}
                    />
                    <Route
                      path="/"
                      element={<Navigate to="/courses" replace />}
                    />
                    <Route
                      path="/courses"
                      element={
                        <DashboardLayout>
                          <CoursesList />
                        </DashboardLayout>
                      }
                    />
                    <Route
                      path="/lessons/:nodeId/edit"
                      element={
                        <DashboardLayout>
                          <LessonEditor />
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
