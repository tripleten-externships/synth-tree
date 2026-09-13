import { gql } from "@apollo/client";

export const LEADERBOARD_QUERY = gql`
  query GlobalLeaderboard($limit: Int = 100) {
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
