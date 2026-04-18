import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthFeature } from "./features/auth";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoutes } from "./components/ProtectedRoutes";
import DashboardLayout from "./layouts/DashboardLayout";

import ErrorBoundary from "./components/ErrorBoundary";
import { ColorPickerDemoPage } from "./pages/ColorPickerDemoPage";
import CoursesList from "./pages/courses/CoursesList";
import { ToastProvider } from "./components/Toast";

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <ToastProvider>
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
                        path="/color-picker-demo"
                        element={<ColorPickerDemoPage />}
                      />
                    </Routes>
                  </ProtectedRoutes>
                }
              />
            </Routes>
          </ToastProvider>
        </AuthProvider>{" "}
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
