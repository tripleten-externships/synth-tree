import type { Prisma } from "@prisma/client";

export const DAILY_QUESTS = [
  {
    key: "earn_50_xp",
    label: "Earn 50 XP",
    goal: 50,
    eventType: "XP_EARNED",
  },
  {
    key: "complete_2_lessons",
    label: "Complete 2 lessons",
    goal: 2,
    eventType: "LESSON_COMPLETED",
  },
  {
    key: "score_100_quiz",
    label: "Get 100% on a quiz",
    goal: 1,
    eventType: "PERFECT_QUIZ",
  },
] as const;

export type DailyQuestEventType = (typeof DAILY_QUESTS)[number]["eventType"];

export function startOfToday(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export async function ensureDailyQuests(
  tx: Prisma.TransactionClient,
  userId: string,
  date = startOfToday(),
) {
  await Promise.all(
    DAILY_QUESTS.map((quest) =>
      tx.userDailyQuest.upsert({
        where: {
          userId_questKey_date: {
            userId,
            questKey: quest.key,
            date,
          },
        },
        update: {},
        create: {
          userId,
          questKey: quest.key,
          date,
          goal: quest.goal,
        },
      }),
    ),
  );

  return tx.userDailyQuest.findMany({
    where: { userId, date },
    orderBy: { questKey: "asc" },
  });
}

export async function incrementDailyQuestProgress(
  tx: Prisma.TransactionClient,
  userId: string,
  eventType: DailyQuestEventType,
  amount = 1,
) {
  const date = startOfToday();

  await ensureDailyQuests(tx, userId, date);

  const matchingQuests = DAILY_QUESTS.filter((quest) => quest.eventType === eventType);

  for (const quest of matchingQuests) {
    // Atomic increment on incomplete rows only. Using a DB-side increment
    // (rather than read-modify-write) avoids the lost-update race where two
    // concurrent events both read the same `current` and one bump is dropped.
    await tx.userDailyQuest.updateMany({
      where: {
        userId,
        questKey: quest.key,
        date,
        completed: false,
      },
      data: {
        current: { increment: amount },
      },
    });

    // Clamp any overshoot back to the goal and flip `completed` once reached.
    await tx.userDailyQuest.updateMany({
      where: {
        userId,
        questKey: quest.key,
        date,
        completed: false,
        current: { gte: quest.goal },
      },
      data: {
        current: quest.goal,
        completed: true,
      },
    });
  }
}
