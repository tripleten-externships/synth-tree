export const LEADERBOARD_QUERY = `
  query Leaderboard($limit: Int = 100) {
    leaderboard(limit: $limit) {
      rank
      displayName
      avatar
      totalXp
      streak
      userId
    }
  }
`;
