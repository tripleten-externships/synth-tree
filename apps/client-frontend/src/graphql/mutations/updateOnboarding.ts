import { gql } from "@apollo/client";

export const UPDATE_ONBOARDING = gql`
  mutation UpdateOnboarding($interests: [String!]!) {
    updateOnboarding(interests: $interests) {
      id
      interests
    }
  }
`;

// Signup step 3 (SYN-47): saving the daily goal also marks onboarding complete.
// Selecting onboardingComplete updates the cached User so the onboarding
// redirect sees the new value.
export const COMPLETE_ONBOARDING = gql`
  mutation CompleteOnboarding($dailyGoalMinutes: Int!) {
    updateOnboarding(dailyGoalMinutes: $dailyGoalMinutes) {
      id
      dailyGoalMinutes
      onboardingComplete
    }
  }
`;
