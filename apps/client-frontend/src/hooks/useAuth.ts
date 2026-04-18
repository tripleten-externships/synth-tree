import { getAuth, signOut } from "firebase/auth";

export default function useAuth() {
  const logout = async () => {
    const auth = getAuth();
    await signOut(auth);
    // TODO: redirect to /auth/login once client-frontend auth is implemented
    // For now reload the page — ProtectedRoute will handle blocking unauthenticated users
    window.location.href = "/";
  };

  return { logout };
}