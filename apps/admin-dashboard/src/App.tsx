import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthFeature } from "./features/auth";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoutes } from "./components/ProtectedRoutes";
import DashboardLayout from "./layouts/DashboardLayout";

function App() {
  return (
    <BrowserRouter>
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
                    element={
                      <DashboardLayout>
                        <div className="flex flex-col ml-16 items-start mt-16">
                          <h1 className="text-3xl font-bold mb-2">Courses</h1>
                          <p className="text-lg text-muted-foreground mb-8">
                            No courses yet
                          </p>
                          <div className="flex flex-col items-center justify-center border border-gray-200 rounded-lg w-72 h-40">
                            <span className="text-3xl mb-2">+</span>
                            <span className="text-base font-bold">
                              New Course
                            </span>
                          </div>
                        </div>
                      </DashboardLayout>
                    }
                  />
                  <Route
                    path="/"
                    element={<Navigate to="/dashboard" replace />}
                  />
                </Routes>
              </ProtectedRoutes>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
