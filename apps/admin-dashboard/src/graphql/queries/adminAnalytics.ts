import { gql } from "@apollo/client";

export const ADMIN_ANALYTICS_QUERY = gql`
  query AdminAnalytics($range: AnalyticsRange!) {
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
      avgSessionMinutes {
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
