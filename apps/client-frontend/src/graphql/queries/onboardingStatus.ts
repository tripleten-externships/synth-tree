import { gql } from "@apollo/client";

// Read by ProtectedRoute to send users who haven't finished signup back to
// onboarding (SYN-47).
export const ONBOARDING_STATUS_QUERY = gql`
  query OnboardingStatus {
    currentUser {
      id
      onboardingComplete
    }
  }
`;
