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

// Read by signup step 2 to pre-fill interests a returning user already saved,
// so Continue doesn't overwrite them with an empty selection (SYN-47).
export const SAVED_INTERESTS_QUERY = gql`
  query SavedInterests {
    currentUser {
      id
      interests
    }
  }
`;
