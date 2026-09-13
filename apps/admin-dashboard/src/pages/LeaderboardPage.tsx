import { useQuery } from "@apollo/client/react";
import { ADMIN_LEADERBOARD_QUERY } from "../graphql/queries/leaderboard.query";

type AdminLeaderboardQuery = {
  leaderboard: {
    currentUserRank: number;
    entries: Array<{
      userId: string;
      displayName: string;
      avatar: string | null;
      totalXp: number;
      streak: number;
      rank: number;
    }>;
  };
};

/**
 * AdminLeaderboardPage
 *
 * This page allows administrators to view the global leaderboard.
 * It uses the GraphQL API instead of importing backend resolver code,
 * which is the correction Ko requested in the review.
 */
export default function AdminLeaderboardPage() {
  /**
   * Execute the GraphQL leaderboard query.
   * The query returns:
   * {
   *   leaderboard: {
   *     currentUserRank: number,
   *     entries: [...]
   *   }
   * }
   */
  const { data, loading, error } = useQuery<AdminLeaderboardQuery>(ADMIN_LEADERBOARD_QUERY, {
    variables: { limit: 100 },
  });

  // Show loading state while waiting for API response
  if (loading) {
    return <div className="p-8">Loading leaderboard...</div>;
  }

  // Show error state if the API request fails
  if (error) {
    return <div className="p-8 text-red-600">Error loading leaderboard. Please try again.</div>;
  }

  const entries = data?.leaderboard.entries ?? [];

  // Handle empty leaderboard state
  if (!entries.length) {
    return <div className="p-8">No XP data available.</div>;
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">Admin Leaderboard</h1>
      <p className="mb-6">Global XP rankings across all users.</p>

      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">Rank</th>
            <th>Name</th>
            <th>XP</th>
            <th>Streak</th>
          </tr>
        </thead>

        <tbody>
          {entries.map((entry) => (
            <tr key={entry.userId} className="border-b">
              {/* Rank */}
              <td className="py-2">{entry.rank}</td>

              {/* Avatar + Name */}
              <td>
                <div className="flex items-center gap-3">
                  {/**
                   * Show avatar if available.
                   * If the image fails to load, hide it and show fallback initial.
                   */}
                  {entry.avatar ? (
                    <img
                      src={entry.avatar}
                      alt=""
                      className="h-8 w-8 rounded-full object-cover"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                        event.currentTarget.nextElementSibling?.classList.remove("hidden");
                      }}
                    />
                  ) : null}

                  {/**
                   * Fallback avatar: first letter of displayName
                   */}
                  <span
                    aria-hidden="true"
                    className={`h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm ${
                      entry.avatar ? "hidden" : "flex"
                    }`}
                  >
                    {entry.displayName.charAt(0).toUpperCase()}
                  </span>

                  <span>{entry.displayName}</span>
                </div>
              </td>

              {/* XP */}
              <td>{entry.totalXp}</td>

              {/* Streak */}
              <td>{entry.streak} days</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
