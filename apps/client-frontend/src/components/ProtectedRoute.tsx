import { Navigate } from "react-router-dom";
import { useOnboardingStatusQuery } from "@synth-tree/api-types";
import { useAuthContext } from "../contexts/AuthContext";

function FullPageLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center text-muted-foreground">
      Loading…
    </div>
  );
}

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { loading, isAuthenticated } = useAuthContext();

  // Signed-in users who haven't finished signup are sent back to onboarding (SYN-47).
  // network-only: this layout mounts once per visit, and a cached currentUser could
  // belong to a previously signed-in account.
  const { data, error } = useOnboardingStatusQuery({
    skip: loading || !isAuthenticated,
    fetchPolicy: "network-only",
  });

  if (loading) {
    return <FullPageLoading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // Wait for the status instead of flashing the app before a redirect.
  if (!data && !error) {
    return <FullPageLoading />;
  }

  // Step 1 already created the account, so resume at step 2. Fails open: on a
  // query error or a missing User row, render the app rather than lock the user out.
  if (data?.currentUser?.onboardingComplete === false) {
    return <Navigate to="/auth/signup?step=2" replace />;
  }

  return <>{children}</>;
}
