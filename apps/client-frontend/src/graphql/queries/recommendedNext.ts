import { gql } from "@apollo/client";

export const RECOMMENDED_NEXT_QUERY = gql`
  query RecommendedNext($limit: Int) {
    currentUser {
      recommendedNext(limit: $limit) {
        id
        title
        step
        orderInStep
        tree {
          id
          title
          course {
            id
            title
          }
        }
      }
    }
  }
`;
