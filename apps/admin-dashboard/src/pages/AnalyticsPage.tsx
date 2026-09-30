import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import type {
  AdminAnalyticsQuery,
  AdminAnalyticsQueryVariables,
  AnalyticsRange,
} from "@synth-tree/api-types";
import { ADMIN_ANALYTICS_QUERY } from "../graphql/queries/adminAnalytics";

const ranges: { value: AnalyticsRange; label: string }[] = [
  { value: "SEVEN_DAYS", label: "7 days" },
  { value: "THIRTY_DAYS", label: "30 days" },
  { value: "NINETY_DAYS", label: "90 days" },
  { value: "ALL", label: "All time" },
];
const cards = [
  { key: "activeLearners", label: "Active learners", unit: "" },
  { key: "lessonsCompleted", label: "Lessons completed", unit: "" },
  { key: "avgSessionMinutes", label: "Avg session", unit: " min" },
  { key: "courseCompletionRate", label: "Course completion", unit: "%" },
] as const;

export default function AnalyticsPage() {
  const [range, setRange] = useState<AnalyticsRange>("SEVEN_DAYS");
  const { data, loading, error, refetch } = useQuery<
    AdminAnalyticsQuery,
    AdminAnalyticsQueryVariables
  >(ADMIN_ANALYTICS_QUERY, {
    variables: { range },
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });

  return (
    <section className="w-full max-w-7xl mx-auto py-8" aria-labelledby="analytics-heading">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 id="analytics-heading" className="text-3xl font-bold">
            Analytics
          </h1>
          <p className="text-muted-foreground mt-2">Learner activity and lesson completions</p>
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Date range">
          {ranges.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={range === option.value}
              onClick={() => setRange(option.value)}
              className={`rounded-lg px-4 py-2 border ${range === option.value ? "bg-primary text-primary-foreground" : "bg-card text-foreground"}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      {error ? (
        <div role="alert" className="p-4 border rounded-lg">
          <p>Unable to load analytics. Please try again.</p>
          <button type="button" className="mt-2 underline" onClick={() => void refetch()}>
            Retry
          </button>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
          aria-busy={loading}
          aria-live="polite"
        >
          {cards.map(({ key, label, unit }) => {
            const stat = !loading ? data?.adminAnalytics[key] : undefined;
            const change = stat?.percentChange;
            return (
              <article
                key={key}
                className="rounded-2xl border bg-card text-card-foreground p-6 shadow-sm"
              >
                <h2 className="text-sm font-medium text-muted-foreground">{label}</h2>
                <p className="text-3xl font-bold mt-3">
                  {loading
                    ? "Loading…"
                    : stat?.current == null
                      ? "Not available"
                      : `${stat.current.toLocaleString()}${unit}`}
                </p>
                <p className="text-sm text-muted-foreground mt-3">
                  {loading
                    ? "Comparing periods…"
                    : stat?.current == null
                      ? "Not currently measured"
                      : range === "ALL"
                        ? "All recorded history · no previous period"
                        : change == null
                          ? "Change unavailable: previous period was zero"
                          : `${change > 0 ? "+" : ""}${change}% vs. previous period`}
                </p>
                {!loading && stat?.previous != null && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Previous: {stat.previous.toLocaleString()}
                    {unit}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      )}
      <p className="text-sm text-muted-foreground mt-5">
        Data refreshes at most once a minute. Date ranges use rolling 24-hour days.
      </p>
    </section>
  );
}
