import type { UserCredential } from "firebase/auth";
import { useAuthContext } from "../contexts/AuthContext";
import type { FirebaseUser } from "../lib/firebase";

/**
 * Authentication hook interface
 */
interface UseAuthReturn {
  /** Current authenticated user or null if not authenticated */
  user: FirebaseUser | null;
  /** Loading state during authentication operations */
  loading: boolean;
  /** Sign in with email and password */
  login: (email: string, password: string) => Promise<UserCredential>;
  /** Sign out current user */
  logout: () => Promise<void>;
  /** Whether user is authenticated */
  isAuthenticated: boolean;
  /** Whether user is anonymous (not authenticated) */
  isAnonymous: boolean;
}

/**
 * Custom hook to access authentication state and methods
 *
 * This hook provides a convenient way to access the authentication context
 * throughout the application. It includes additional computed properties
 * for common authentication checks.
 *
 * @returns Authentication state and methods
 * @throws Error if used outside of AuthProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { user, login, logout, isAuthenticated } = useAuth();
 *
 *   if (isAuthenticated) {
 *     return <div>Welcome, {user?.email}!</div>;
 *   }
 *
 *   return <LoginForm onLogin={login} />;
 * }
 * ```
 */
export const useAuth = (): UseAuthReturn => {
  const context = useAuthContext();

  // Computed properties for convenience
  const isAuthenticated = context.user !== null;
  const isAnonymous = !isAuthenticated;

  return {
    ...context,
    isAuthenticated,
    isAnonymous,
  };
};

export default useAuth;
