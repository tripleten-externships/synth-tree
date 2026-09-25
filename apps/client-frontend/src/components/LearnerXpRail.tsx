import { useHomeXpWidgetsQuery } from "@synth-tree/api-types";
import { Card } from "@synth-tree/ui";
import TodayGoalCard from "./TodayGoalCard";
import WeeklyXpChart from "./WeeklyXpChart";
import { activeStreakDays, dailyGoalXp, startOfLocalWeek, summarizeXpWeek } from "../lib/xpWeek";

// Right rail of the learner home (SYN-50): today's goal and this week's XP.
export default function LearnerXpRail() {
  const now = new Date();
  // The same string for the whole week, so re-renders don't change the query
  // variables (and don't refetch).
  const since = startOfLocalWeek(now).toISOString();

  const { data, loading, error } = useHomeXpWidgetsQuery({
    variables: { since },
    // Show cached numbers right away, then refresh them in case the learner
    // just earned XP in a lesson.
    fetchPolicy: "cache-and-network",
  });

  if (loading && !data) {
    return (
      <div aria-hidden="true" className="flex flex-col gap-4">
        <div className="h-32 animate-pulse rounded-3xl border border-border bg-card" />
        <div className="h-40 animate-pulse rounded-3xl border border-border bg-card" />
      </div>
    );
  }

  if (error && !data) {
    return (
      <Card className="rounded-3xl border-border p-5">
        <p className="text-sm text-muted-foreground">Couldn't load your XP right now.</p>
      </Card>
    );
  }

  const user = data?.currentUser;
  const { days, todayXp } = summarizeXpWeek(user?.xpEvents ?? [], now);

  return (
    <div className="flex flex-col gap-4">
      <TodayGoalCard
        todayXp={todayXp}
        goalXp={dailyGoalXp(user?.dailyGoalMinutes)}
        streakDays={activeStreakDays(user?.streak, now, user?.timezone)}
      />
      <WeeklyXpChart days={days} />
    </div>
  );
}
