import { PrismaClient, Prisma } from "@prisma/client";

const DEFAULT_TIMEZONE = "UTC";
const MS_PER_DAY = 24 * 60 * 60 * 1000;

// Fall back to UTC for a missing or non-IANA timezone; Intl throws a
// RangeError on unknown zones, which would otherwise abort the XP award.
function resolveTimezone(timezone: string | null | undefined): string {
  if (!timezone) {
    return DEFAULT_TIMEZONE;
  }

  try {
    new Intl.DateTimeFormat("en-US", { timeZone: timezone });
    return timezone;
  } catch {
    return DEFAULT_TIMEZONE;
  }
}

// Calendar date of `date` in `timeZone`, as a UTC-midnight epoch value.
function localDayStart(date: Date, timeZone: string): number {
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

// Number of local calendar days from `from` to `to` in `timeZone`. Compares
// calendar dates rather than subtracting 24h, so 23h/25h DST days count as one.
function localDayDiff(from: Date, to: Date, timeZone: string): number {
  return Math.round((localDayStart(to, timeZone) - localDayStart(from, timeZone)) / MS_PER_DAY);
}

export async function awardXp(
  prisma: PrismaClient,
  userId: string,
  amount: number,
  reason: string,
  metadata?: Prisma.InputJsonValue,
  tx?: Prisma.TransactionClient,
) {
  const run = async (client: Prisma.TransactionClient) => {
    const rewardKey =
      metadata && typeof metadata === "object" && !Array.isArray(metadata)
        ? ((metadata as Record<string, unknown>).nodeId ??
          (metadata as Record<string, unknown>).quizId)
        : undefined;

    if (typeof rewardKey !== "string") {
      throw new Error("XP reward requires a nodeId or quizId");
    }

    const existingEvent = await client.xpEvent.findFirst({
      where: {
        userId,
        reason,
        rewardKey,
      },
    });

    if (existingEvent) {
      return existingEvent;
    }

    const xpEvent = await client.xpEvent.create({
      data: {
        userId,
        amount,
        reason,
        rewardKey,
        metadata,
      },
    });

    const userXp = await client.userXp.upsert({
      where: {
        userId,
      },
      update: {
        totalXp: {
          increment: amount,
        },
      },
      create: {
        userId,
        totalXp: amount,
      },
    });

    const now = new Date();

    // Compare day boundaries in UTC so a user's daily total resets on the same
    // calendar day regardless of the server's local timezone.
    const isNewDay =
      userXp.todayAsOf.toISOString().slice(0, 10) !==
      now.toISOString().slice(0, 10);

    await client.userXp.update({
      where: {
        userId,
      },
      data: {
        todayXp: isNewDay ? amount : userXp.todayXp + amount,
        todayAsOf: isNewDay ? now : userXp.todayAsOf,
      },
    });

    // Compute the week-start key in UTC (week starts Monday) so weekly buckets
    // are stable across timezones.
    const dayOfWeek = now.getUTCDay();

    const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    const weekStart = new Date(now);
    weekStart.setUTCDate(now.getUTCDate() - daysSinceMonday);

    const weekKey = weekStart.toISOString().slice(0, 10);

    const weeklyXp = (userXp.weeklyXp ?? {}) as Record<string, number>;

    const currentWeekXp = weeklyXp[weekKey] ?? 0;

    const newWeeklyXp = {
      ...weeklyXp,
      [weekKey]: currentWeekXp + amount,
    };

    await client.userXp.update({
      where: {
        userId,
      },
      data: {
        weeklyXp: newWeeklyXp,
      },
    });

    const user = await client.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        timezone: true,
      },
    });

    const timezone = resolveTimezone(user?.timezone);

    const streak = await client.userStreak.findUnique({
      where: {
        userId,
      },
    });

    let currentDays = 1;

    if (streak?.lastActive) {
      const dayDiff = localDayDiff(streak.lastActive, now, timezone);

      if (dayDiff === 0) {
        currentDays = streak.currentDays;
      } else if (dayDiff === 1) {
        currentDays = streak.currentDays + 1;
      }
    }

    const longestDays = Math.max(streak?.longestDays ?? 0, currentDays);

    await client.userStreak.upsert({
      where: {
        userId,
      },
      update: {
        currentDays,
        longestDays,
        lastActive: now,
      },
      create: {
        userId,
        currentDays,
        longestDays,
        lastActive: now,
      },
    });

    return xpEvent;
  };

  // Reuse the caller's transaction when one is supplied so the XP award commits
  // atomically with the surrounding write; otherwise open our own.
  if (tx) {
    return run(tx);
  }

  return prisma.$transaction(run);
}
