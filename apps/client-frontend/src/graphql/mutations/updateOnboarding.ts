import { gql } from "@apollo/client";

export const UPDATE_ONBOARDING = gql`
  mutation UpdateOnboarding($interests: [String!]!) {
    updateOnboarding(interests: $interests) {
      id
      interests
    }
  }
`;
