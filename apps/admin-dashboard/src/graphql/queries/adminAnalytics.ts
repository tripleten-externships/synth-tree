import { gql } from "@apollo/client";

export const ADMIN_ANALYTICS_QUERY = gql`
  query AdminAnalytics($range: DateRange!) {
    adminAnalytics(range: $range) {
      activeLearners {
        current
        previous
        percentChange
      }
      lessonsCompleted {
        current
        previous
        percentChange
      }
      avgSessionDuration {
        current
        previous
        percentChange
      }
      courseCompletionRate {
        current
        previous
        percentChange
      }
    }
  }
`;
