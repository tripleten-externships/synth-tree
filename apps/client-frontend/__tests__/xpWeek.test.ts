import {
  activeStreakDays,
  dailyGoalXp,
  startOfLocalWeek,
  streakHint,
  summarizeXpWeek,
  type StreakHint,
} from "../src/lib/xpWeek";

// Dates use the local-time constructor (month is 0-based), so these tests pass
// in any TZ. Thursday 24 Sep 2026, 10:00 local.
const THURSDAY = new Date(2026, 8, 24, 10);

const at = (day: number, hour = 12, month = 8) => new Date(2026, month, day, hour).toISOString();
const text = (hint: StreakHint) => `${hint.before}${hint.streak ?? ""}${hint.after}`;

describe("startOfLocalWeek", () => {
  it("returns local midnight on Monday", () => {
    expect(startOfLocalWeek(THURSDAY)).toEqual(new Date(2026, 8, 21));
  });

  it("puts Sunday in the week that started the Monday before", () => {
    expect(startOfLocalWeek(new Date(2026, 8, 27, 23, 59))).toEqual(new Date(2026, 8, 21));
  });

  it("keeps Monday itself", () => {
    expect(startOfLocalWeek(new Date(2026, 8, 21, 0, 0))).toEqual(new Date(2026, 8, 21));
  });
});

describe("summarizeXpWeek", () => {
  it("returns Monday to Sunday with today flagged", () => {
    const { days } = summarizeXpWeek([], THURSDAY);

    expect(days.map((d) => d.label)).toEqual(["M", "T", "W", "T", "F", "S", "S"]);
    expect(days.map((d) => d.isToday)).toEqual([false, false, false, true, false, false, false]);
    expect(days[3].name).toBe("Thursday");
  });

  it("adds up events per local day", () => {
    const { days, todayXp } = summarizeXpWeek(
      [
        { amount: 50, createdAt: at(21, 9) },
        { amount: 100, createdAt: at(21, 23) },
        { amount: 50, createdAt: at(23, 0) },
        { amount: 50, createdAt: at(24, 8) },
      ],
      THURSDAY,
    );

    expect(days.map((d) => d.xp)).toEqual([150, 0, 50, 50, 0, 0, 0]);
    expect(todayXp).toBe(50);
  });

  it("ignores events from before this Monday", () => {
    const { days } = summarizeXpWeek([{ amount: 80, createdAt: at(20, 23) }], THURSDAY);

    expect(days.every((d) => d.xp === 0)).toBe(true);
  });

  it("reports 0 XP today when the learner has only earned XP earlier in the week", () => {
    expect(summarizeXpWeek([{ amount: 50, createdAt: at(23) }], THURSDAY).todayXp).toBe(0);
  });

  it("still gives seven separate days in a week with a DST change", () => {
    // US clocks go back on Sunday 1 Nov 2026 (a 25-hour day in New York).
    const sunday = new Date(2026, 10, 1, 18);
    const { days, todayXp } = summarizeXpWeek(
      [
        { amount: 50, createdAt: at(26, 12, 9) },
        { amount: 70, createdAt: at(1, 1, 10) },
        { amount: 30, createdAt: at(1, 23, 10) },
      ],
      sunday,
    );

    expect(days.map((d) => d.xp)).toEqual([50, 0, 0, 0, 0, 0, 100]);
    expect(days[6].isToday).toBe(true);
    expect(todayXp).toBe(100);
  });
});

describe("dailyGoalXp", () => {
  it("converts the goal at 10 XP per minute", () => {
    expect([5, 15, 30, 60].map(dailyGoalXp)).toEqual([50, 150, 300, 600]);
  });

  it("falls back to the 15 minute signup default when no goal is saved", () => {
    expect(dailyGoalXp(null)).toBe(150);
    expect(dailyGoalXp(undefined)).toBe(150);
  });
});

// Streak days follow the server's rule (the user's saved timezone), not the
// browser's, so these use fixed UTC instants.
describe("activeStreakDays", () => {
  const streak = (lastActive: string | null, currentDays = 4) => ({ currentDays, lastActive });
  const THURSDAY_UTC = new Date("2026-09-24T10:00:00Z");

  it("keeps the streak when the learner was active today or yesterday", () => {
    expect(activeStreakDays(streak("2026-09-24T08:00:00Z"), THURSDAY_UTC, "UTC")).toBe(4);
    expect(activeStreakDays(streak("2026-09-23T23:00:00Z"), THURSDAY_UTC, "UTC")).toBe(4);
  });

  it("drops a streak that already lapsed (last active two or more days ago)", () => {
    expect(activeStreakDays(streak("2026-09-22T12:00:00Z", 12), THURSDAY_UTC, "UTC")).toBe(0);
  });

  it("counts days in the saved timezone, like the server, not the browser's", () => {
    // Denver learner, saved timezone still UTC: last active Thu 10:00 Denver
    // (16:00 UTC). Fri 19:00 Denver is already Saturday in UTC, so the server
    // would restart the streak.
    expect(
      activeStreakDays(streak("2026-09-24T16:00:00Z"), new Date("2026-09-26T01:00:00Z"), "UTC"),
    ).toBe(0);
    // Thu 20:00 Denver is Friday in UTC, so Sat 09:00 Denver is still in time.
    expect(
      activeStreakDays(streak("2026-09-25T02:00:00Z"), new Date("2026-09-26T15:00:00Z"), "UTC"),
    ).toBe(4);
  });

  it("uses the saved timezone once it is set", () => {
    // Tue 22:00 New York is Wednesday in UTC; now is Thu 19:00 New York.
    const lastActive = streak("2026-09-23T02:00:00Z");
    const now = new Date("2026-09-24T23:00:00Z");

    expect(activeStreakDays(lastActive, now, "America/New_York")).toBe(0);
    expect(activeStreakDays(lastActive, now, "UTC")).toBe(4);
  });

  it("falls back to UTC for a missing or unknown timezone, like the server", () => {
    expect(activeStreakDays(streak("2026-09-23T23:00:00Z"), THURSDAY_UTC, "Mars/Olympus")).toBe(4);
    expect(activeStreakDays(streak("2026-09-23T23:00:00Z"), THURSDAY_UTC, null)).toBe(4);
  });

  it("is 0 with no streak row or no activity yet", () => {
    expect(activeStreakDays(null, THURSDAY_UTC, "UTC")).toBe(0);
    expect(activeStreakDays(streak(null, 0), THURSDAY_UTC, "UTC")).toBe(0);
  });
});

describe("streakHint", () => {
  it("uses the ticket copy while the goal isn't reached and a streak is active", () => {
    const hint = streakHint(70, 150, 4);

    expect(text(hint)).toBe("80 XP to keep your 4-day streak.");
    expect(hint.streak).toBe("4-day streak");
  });

  it("says the streak is safe once the goal is reached", () => {
    expect(text(streakHint(150, 150, 4))).toBe("Goal reached. Your 4-day streak is safe.");
    expect(text(streakHint(400, 150, 0))).toBe("Goal reached for today.");
  });

  it("points at the goal when there is no active streak", () => {
    const hint = streakHint(0, 150, 0);

    expect(text(hint)).toBe("150 XP to reach today's goal.");
    expect(hint.streak).toBeNull();
  });
});
