import { useEffect, useState } from "react";
import { fetchLeaderboard } from "../utils/api";
import { useAuth } from "../contexts/AuthContext";

export default function LeaderboardPage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchLeaderboard(100);
        setEntries(data);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return <div className="p-8">Loading leaderboard...</div>;
  }

  const currentUserEntry = entries.find((e) => e.userId === user?.id);

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">Leaderboard</h1>
      <p className="mb-6">See how you rank against other learners.</p>

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
            const isCurrentUser = entry.userId === user?.id;

            return (
              <tr
                key={entry.userId}
                className={`border-b ${isCurrentUser ? "bg-yellow-100 font-semibold" : ""}`}
              >
                <td className="py-2">{entry.rank}</td>
                <td>
                  <div className="flex items-center gap-3">
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
                <td>{entry.totalXp}</td>
                <td>{entry.streak} days</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {!currentUserEntry && (
        <div className="mt-8 p-4 bg-blue-50 border rounded">
          <h2 className="font-bold">Your Rank</h2>
          <p>You are ranked outside the top 100.</p>
        </div>
      )}
    </div>
  );
}
