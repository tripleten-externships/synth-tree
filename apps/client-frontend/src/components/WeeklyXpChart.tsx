import { Card, cn } from "@synth-tree/ui";
import type { XpWeekDay } from "../lib/xpWeek";

// Tallest bar height, as in the design (64px bars in an 80px row).
const MAX_BAR_PX = 64;

// "Your week" card on the learner home (SYN-50): one bar per day, Monday to
// Sunday, with today's bar and label highlighted.
export default function WeeklyXpChart({ days }: { days: XpWeekDay[] }) {
  const maxXp = Math.max(1, ...days.map((day) => day.xp));

  return (
    <Card className="rounded-3xl border-border p-5">
      <h2 className="mb-3.5 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Your week
      </h2>

      <ol className="flex h-20 items-end gap-1">
        {days.map((day) => (
          <li key={day.name} className="flex h-full flex-1 flex-col justify-end">
            <span className="sr-only">
              {day.name}
              {day.isToday && ", today"}: {day.xp} XP
            </span>
            {day.xp > 0 && (
              <div
                aria-hidden="true"
                title={`${day.xp} XP`}
                className={cn(
                  // Not rounded-t-md: the theme's 1.4rem --radius makes that an arch.
                  "w-full rounded-t bg-primary transition-[height] duration-300",
                  !day.isToday && "opacity-70",
                )}
                style={{ height: `${(day.xp / maxXp) * MAX_BAR_PX}px` }}
              />
            )}
          </li>
        ))}
      </ol>

      <div aria-hidden="true" className="mt-2 flex gap-1 text-[11px] text-muted-foreground">
        {days.map((day) => (
          <span
            key={day.name}
            className={cn("flex-1 text-center", day.isToday && "font-semibold text-foreground")}
          >
            {day.label}
          </span>
        ))}
      </div>
    </Card>
  );
}
