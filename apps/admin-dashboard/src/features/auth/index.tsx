import { Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login";
import { ForgotPassword } from "./pages/ForgotPassword";
import AuthLayout from "../../layouts/AuthLayout";

export function AuthFeature() {
  return (
    <AuthLayout>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
      </Routes>
    </AuthLayout>
  );
}
