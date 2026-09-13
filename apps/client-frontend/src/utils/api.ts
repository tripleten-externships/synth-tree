import { LEADERBOARD_QUERY } from "../graphql/leaderboardQuery";
import { apolloClient as client } from "../lib/apollo";

export async function fetchLeaderboard(limit = 100) {
  const { data } = await client.query({
    query: LEADERBOARD_QUERY,
    variables: { limit },
  });

  return data.leaderboard;
}
