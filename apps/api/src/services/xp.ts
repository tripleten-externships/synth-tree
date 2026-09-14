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
        ? (metadata as Record<string, unknown>).nodeId ??
          (metadata as Record<string, unknown>).quizId
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

    const isNewDay =
      userXp.todayAsOf.toDateString() !== now.toDateString();

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

    return xpEvent;
  });
}
