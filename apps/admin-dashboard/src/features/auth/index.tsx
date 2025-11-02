import { Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login";
import AuthLayout from "../../layouts/AuthLayout";

export function AuthFeature() {
  return (
    <AuthLayout>
      <Routes>
        <Route path="login" element={<Login />} />
      </Routes>
    </AuthLayout>
  );
}
