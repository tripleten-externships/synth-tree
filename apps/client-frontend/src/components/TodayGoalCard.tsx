import { Card, Progress } from "@synth-tree/ui";
import { streakHint } from "../lib/xpWeek";

interface TodayGoalCardProps {
  todayXp: number;
  goalXp: number;
  streakDays: number;
}

// "Today's goal" card on the learner home (SYN-50).
export default function TodayGoalCard({ todayXp, goalXp, streakDays }: TodayGoalCardProps) {
  const hint = streakHint(todayXp, goalXp, streakDays);

  return (
    <Card className="rounded-3xl border-border p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Today's goal
        </h2>
        <span className="text-xs tabular-nums text-muted-foreground">
          {todayXp}/{goalXp} XP
        </span>
      </div>

      {/* Capped at the goal so aria-valuenow never goes past aria-valuemax. */}
      <Progress
        value={Math.min(todayXp, goalXp)}
        max={goalXp}
        aria-label="Today's XP toward your daily goal"
        aria-valuetext={`${todayXp} of ${goalXp} XP`}
      />

      <p className="mt-2.5 text-sm text-muted-foreground">
        {hint.before}
        {hint.streak && (
          // warning-700 from the theme tokens: the default warning orange is
          // about 3:1 on white, too light for small text. Written out because
          // the preset's text-warning-700 compiles to invalid CSS (the scale
          // values are bare HSL numbers without hsl()).
          <strong className="font-semibold text-[hsl(25_90%_38%)] dark:text-warning">
            {hint.streak}
          </strong>
        )}
        {hint.after}
      </p>
    </Card>
  );
}
