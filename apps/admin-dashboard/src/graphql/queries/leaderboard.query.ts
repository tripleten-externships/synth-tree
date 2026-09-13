import { gql } from "@apollo/client";

/**
 * GraphQL query used by the admin dashboard to fetch leaderboard data.
 * This replaces the incorrect backend imports Ko mentioned.
 */
export const ADMIN_LEADERBOARD_QUERY = gql`
  query AdminLeaderboard($limit: Int = 100) {
    leaderboard(limit: $limit) {
      currentUserRank
      entries {
        userId
        displayName
        avatar
        totalXp
        streak
        rank
      }
    }
  }
`;
