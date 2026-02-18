import React from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

/**
 * Props for the ProtectedRoutes component
 */
interface ProtectedRoutesProps {
  /** Child components (protected routes) to render when authenticated */
  children: React.ReactNode;
}

/**
 * ProtectedRoutes component that wraps React Router's Routes component
 * and provides authentication-based route protection.
 *
 * This component checks the user's authentication state and:
 * - Shows a loading indicator while authentication is being verified
 * - Redirects to the login page if the user is not authenticated
 * - Renders the protected routes if the user is authenticated
 *
 * @param props - Component props
 * @param props.children - The protected routes to render when authenticated
 * @returns JSX element with conditional rendering based on auth state
 *
 * @example
 * ```tsx
 * <ProtectedRoutes>
 *   <Routes>
 *     <Route path="/dashboard" element={<Dashboard />} />
 *     <Route path="/profile" element={<Profile />} />
 *   </Routes>
 * </ProtectedRoutes>
 * ```
 */
export const ProtectedRoutes: React.FC<ProtectedRoutesProps> = ({
  children,
}) => {
  const { loading, isAuthenticated } = useAuth();

  // Show loading state while authentication is being checked
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Loading...
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Verifying authentication
          </div>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // Render protected routes if authenticated
  return <>{children}</>;
};

export default ProtectedRoutes;
