import { useAuthContext } from "../contexts/AuthContext";

/**
 * Thin wrapper over the auth context so existing callers (e.g. ProfilePage's
 * `const { logout } = useAuth()`) keep working, while new code can also read
 * `user` / `login` / `loading` / `isAuthenticated`.
 */
export default function useAuth() {
  return useAuthContext();
}
