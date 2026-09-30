// Numbers behind the learner home's "Today's goal" and "Your week" cards
// (SYN-50). Days are the learner's local calendar days (browser timezone).

// The daily goal is saved in minutes (SYN-47) but shown in XP. 10 XP a minute
// makes the default 15 minutes 150 XP, about one lesson plus one quiz pass.
export const XP_PER_GOAL_MINUTE = 10;
// Same default as signup step 3, for users who never picked a goal.
export const DEFAULT_DAILY_GOAL_MINUTES = 15;

const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export interface XpEventLike {
  amount: number;
  createdAt: string | Date;
}

export interface XpWeekDay {
  label: string;
  name: string;
  xp: number;
  isToday: boolean;
}

export interface XpWeekSummary {
  // Monday to Sunday of the current week.
  days: XpWeekDay[];
  todayXp: number;
}

// The hint under the goal bar, split so the card can color the streak part.
export interface StreakHint {
  before: string;
  streak: string | null;
  after: string;
}

export function dailyGoalXp(dailyGoalMinutes: number | null | undefined): number {
  const minutes =
    dailyGoalMinutes && dailyGoalMinutes > 0 ? dailyGoalMinutes : DEFAULT_DAILY_GOAL_MINUTES;
  return minutes * XP_PER_GOAL_MINUTE;
}

// Local midnight on the Monday of `now`'s week. Weeks run Monday to Sunday,
// like the API's weeklyXp buckets.
export function startOfLocalWeek(now: Date): Date {
  const daysSinceMonday = (now.getDay() + 6) % 7;
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysSinceMonday);
}

// Local calendar days from `from` to `to`. Compares dates rather than
// subtracting 24h, so a 23h or 25h DST day still counts as one.
function localDayDiff(from: Date, to: Date): number {
  const fromDay = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  const toDay = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.round((toDay - fromDay) / MS_PER_DAY);
}

export function summarizeXpWeek(events: XpEventLike[], now: Date): XpWeekSummary {
  const weekStart = startOfLocalWeek(now);
  const todayIndex = localDayDiff(weekStart, now);
  const totals = DAY_NAMES.map(() => 0);

  for (const event of events) {
    const index = localDayDiff(weekStart, new Date(event.createdAt));
    if (index >= 0 && index < totals.length) totals[index] += event.amount;
  }

  return {
    days: DAY_NAMES.map((name, i) => ({
      label: name[0],
      name,
      xp: totals[i],
      isToday: i === todayIndex,
    })),
    todayXp: totals[todayIndex],
  };
}

// Same fallback as the API's awardXp: a missing or unknown zone means UTC
// (Intl throws a RangeError for unknown zones).
function resolveTimeZone(timeZone: string | null | undefined): string {
  if (!timeZone) return "UTC";
  try {
    new Intl.DateTimeFormat("en-US", { timeZone });
    return timeZone;
  } catch {
    return "UTC";
  }
}

// Calendar date of `date` in `timeZone`, as a UTC-midnight epoch value.
function dayInZone(date: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value);
  return Date.UTC(get("year"), get("month") - 1, get("day"));
}

// UserStreak.currentDays is only recalculated when XP is awarded, so a streak
// the learner already lost still holds its old number. It only counts if they
// were active today or yesterday, using the server's day rule
// (apps/api/src/services/xp.ts): days in the user's saved timezone. That is UTC
// for everyone until the browser's timezone is saved (SYN-127), so it can differ
// from the chart's local days in the evening.
export function activeStreakDays(
  streak: { currentDays: number; lastActive?: string | Date | null } | null | undefined,
  now: Date,
  timeZone: string | null | undefined,
): number {
  if (!streak?.lastActive || streak.currentDays <= 0) return 0;
  const zone = resolveTimeZone(timeZone);
  const daysSince =
    (dayInZone(now, zone) - dayInZone(new Date(streak.lastActive), zone)) / MS_PER_DAY;
  return daysSince <= 1 ? streak.currentDays : 0;
}

export function streakHint(todayXp: number, goalXp: number, streakDays: number): StreakHint {
  const remaining = Math.max(goalXp - todayXp, 0);
  const streak = streakDays > 0 ? `${streakDays}-day streak` : null;

  if (remaining === 0) {
    return streak
      ? { before: "Goal reached. Your ", streak, after: " is safe." }
      : { before: "Goal reached for today.", streak: null, after: "" };
  }
  if (streak) {
    return { before: `${remaining} XP to keep your `, streak, after: "." };
  }
  return { before: `${remaining} XP to reach today's goal.`, streak: null, after: "" };
}
