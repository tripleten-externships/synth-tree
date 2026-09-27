import { LEADERBOARD_QUERY } from "../graphql/leaderboardQuery";
import { apolloClient as client } from "../lib/apollo";

export type LeaderboardEntry = {
  userId: string;
  displayName: string;
  avatar: string | null;
  totalXp: number;
  streak: number;
  rank: number;
};

export type LeaderboardPayload = {
  entries: LeaderboardEntry[];
  currentUserRank: number | null;
};

export async function fetchLeaderboard(limit = 100): Promise<LeaderboardPayload> {
  const { data } = await client.query<{ leaderboard: LeaderboardPayload }>({
    query: LEADERBOARD_QUERY,
    variables: { limit },
  });

  if (!data) {
    throw new Error("Leaderboard query returned no data");
  }

  return data.leaderboard;
}
