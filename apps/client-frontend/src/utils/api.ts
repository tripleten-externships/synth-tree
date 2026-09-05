import { LEADERBOARD_QUERY } from "../graphql/leaderboardQuery";

export async function fetchLeaderboard(limit = 100) {
  const response = await fetch("http://localhost:4000/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: LEADERBOARD_QUERY,
      variables: { limit },
    }),
  });

  const json = await response.json();

  if (json.errors) {
    console.error(json.errors);
    throw new Error("Failed to load leaderboard");
  }

  return json.data.leaderboard;
}
