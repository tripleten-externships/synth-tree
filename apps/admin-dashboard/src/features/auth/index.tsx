import { Route,Routes } from "react-router-dom";

import AuthLayout from "../../layouts/AuthLayout";
import { Login } from "./pages/Login";

export function AuthFeature() {
  return (
    <AuthLayout>
      <Routes>
        <Route path="login" element={<Login />} />
      </Routes>
    </AuthLayout>
  );
}
