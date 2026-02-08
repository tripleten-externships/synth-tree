import { BrowserRouter, Navigate,Route, Routes } from "react-router-dom";

import { ProtectedRoutes } from "./components/ProtectedRoutes";
import { AuthProvider } from "./contexts/AuthContext";
import { AuthFeature } from "./features/auth";

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
                  <Route path="/dashboard" element={<div>Dashboard</div>} />
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
