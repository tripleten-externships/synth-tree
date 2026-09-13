import { useEffect, useState } from "react";
import { fetchLeaderboard } from "../utils/api"; // Calls your GraphQL API
import { useAuth } from "../contexts/AuthContext"; // Gives access to Firebase user

export default function LeaderboardPage() {
  /**
   * entries → the list of leaderboard rows returned by the API
   * currentUserRank → the user's global rank (even if outside top 100)
   * loading → controls the loading state while fetching data
   */
  const [entries, setEntries] = useState([]);
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Firebase authenticated user (contains uid, displayName, etc.)
  const { user } = useAuth();

  /**
   * Fetch leaderboard data on page load.
   * This calls your GraphQL API through fetchLeaderboard(),
   * which returns:
   * {
   *   entries: [...],
   *   currentUserRank: number
   * }
   */
  useEffect(() => {
    async function load() {
      try {
        const data = await fetchLeaderboard(100);

        // Store the list of leaderboard entries
        setEntries(data.entries);

        // Store the user's global rank
        setCurrentUserRank(data.currentUserRank);
      } finally {
        // Stop showing the loading state
        setLoading(false);
      }
    }

    load();
  }, []);

  /**
   * Show a loading message while waiting for API response.
   */
  if (loading) {
    return <div className="p-8">Loading leaderboard...</div>;
  }

  /**
   * If the leaderboard is empty, show a friendly message.
   * This handles the "empty state" Ko mentioned.
   */
  if (!entries.length) {
    return <div className="p-8">No XP yet — start earning!</div>;
  }

  /**
   * Find the current user's entry in the leaderboard.
   * We compare using Firebase UID (user.uid), NOT user.id.
   * This highlights the user's row in the table.
   */
  const currentUserEntry = entries.find((e) => e.userId === user?.uid);

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">Leaderboard</h1>
      <p className="mb-6">See how you rank against other learners.</p>

      {/**
       * Leaderboard table
       * Shows rank, name, XP, and streak for each user.
       */}
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
          {entries.map((entry) => {
            // Highlight the current user's row
            const isCurrentUser = entry.userId === user?.uid;

            return (
              <tr
                key={entry.userId}
                className={`border-b ${isCurrentUser ? "bg-yellow-100 font-semibold" : ""}`}
              >
                {/* Rank */}
                <td className="py-2">{entry.rank}</td>

                {/* Avatar + Name */}
                <td>
                  <div className="flex items-center gap-3">
                    {/**
                     * If the user has an avatar, show it.
                     * If the image fails to load, hide it and show the fallback initial.
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

                    {/* Display name */}
                    <span>{entry.displayName}</span>
                  </div>
                </td>

                {/* XP */}
                <td>{entry.totalXp}</td>

                {/* Streak */}
                <td>{entry.streak} days</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/**
       * Global rank section
       * Always shown — even if the user is outside the top 100.
       * Uses the new API field currentUserRank.
       */}
      <div className="mt-8 p-4 bg-blue-50 border rounded">
        <h2 className="font-bold">Your Rank</h2>
        <p>You are ranked #{currentUserRank} globally.</p>
      </div>
    </div>
  );
}
