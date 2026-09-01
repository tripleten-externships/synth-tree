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

function startOfToday(date = new Date()) {
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

  const matchingQuests = DAILY_QUESTS.filter(
    (quest) => quest.eventType === eventType,
  );

  for (const quest of matchingQuests) {
    const existing = await tx.userDailyQuest.findUnique({
      where: {
        userId_questKey_date: {
          userId,
          questKey: quest.key,
          date,
        },
      },
    });

    if (!existing || existing.completed) continue;

    const nextCurrent = Math.min(existing.current + amount, existing.goal);

    await tx.userDailyQuest.update({
      where: {
        userId_questKey_date: {
          userId,
          questKey: quest.key,
          date,
        },
      },
      data: {
        current: nextCurrent,
        completed: nextCurrent >= existing.goal,
      },
    });
  }
}
