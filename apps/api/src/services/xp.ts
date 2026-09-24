import { PrismaClient, Prisma } from "@prisma/client";

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
        ? (metadata as Record<string, unknown>).nodeId ??
          (metadata as Record<string, unknown>).quizId
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

    return xpEvent;
  };

  // Reuse the caller's transaction when one is supplied so the XP award commits
  // atomically with the surrounding write; otherwise open our own.
  if (tx) {
    return run(tx);
  }

  return prisma.$transaction(run);
}
