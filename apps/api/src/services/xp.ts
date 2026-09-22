import { PrismaClient, Prisma } from "@prisma/client";

export async function awardXp(
  prisma: PrismaClient,
  userId: string,
  amount: number,
  reason: string,
  metadata?: Prisma.InputJsonValue,
) {
  return prisma.$transaction(async (tx) => {
    const rewardKey =
      metadata && typeof metadata === "object" && !Array.isArray(metadata)
        ? ((metadata as Record<string, unknown>).nodeId ??
          (metadata as Record<string, unknown>).quizId)
        : undefined;

    if (typeof rewardKey !== "string") {
      throw new Error("XP reward requires a nodeId or quizId");
    }

    const existingEvent = await tx.xpEvent.findFirst({
      where: {
        userId,
        reason,
        rewardKey,
      },
    });

    if (existingEvent) {
      return existingEvent;
    }

    const xpEvent = await tx.xpEvent.create({
      data: {
        userId,
        amount,
        reason,
        rewardKey,
        metadata,
      },
    });

    const userXp = await tx.userXp.upsert({
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

    const isNewDay = userXp.todayAsOf.toDateString() !== now.toDateString();

    await tx.userXp.update({
      where: {
        userId,
      },
      data: {
        todayXp: isNewDay ? amount : userXp.todayXp + amount,
        todayAsOf: isNewDay ? now : userXp.todayAsOf,
      },
    });

    const dayOfWeek = now.getDay();

    const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - daysSinceMonday);

    const weekKey = weekStart.toISOString().slice(0, 10);

    const weeklyXp = (userXp.weeklyXp ?? {}) as Record<string, number>;

    const currentWeekXp = weeklyXp[weekKey] ?? 0;

    const newWeeklyXp = {
      ...weeklyXp,
      [weekKey]: currentWeekXp + amount,
    };

    await tx.userXp.update({
      where: {
        userId,
      },
      data: {
        weeklyXp: newWeeklyXp,
      },
    });

    const user = await tx.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        timezone: true,
      },
    });

    const timezone = user?.timezone ?? "UTC";

    const today = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(now);

    const streak = await tx.userStreak.findUnique({
      where: {
        userId,
      },
    });

    let currentDays = 1;

    if (streak?.lastActive) {
      const lastActiveDate = new Intl.DateTimeFormat("en-CA", {
        timeZone: timezone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(streak.lastActive);

      if (lastActiveDate === today) {
        currentDays = streak.currentDays;
      } else {
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);

        const yesterdayDate = new Intl.DateTimeFormat("en-CA", {
          timeZone: timezone,
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(yesterday);

        if (lastActiveDate === yesterdayDate) {
          currentDays = streak.currentDays + 1;
        }
      }
    }

    const longestDays = Math.max(streak?.longestDays ?? 0, currentDays);

    await tx.userStreak.upsert({
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
  });
}
