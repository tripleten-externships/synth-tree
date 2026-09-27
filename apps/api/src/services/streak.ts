import { Prisma } from "@prisma/client";

export async function getUserStreakDays(
  userId: string,
  tx: Prisma.TransactionClient,
): Promise<number> {
  const streak = await tx.userStreak.findUnique({
    where: { userId },
    select: { currentDays: true },
  });

  return streak?.currentDays ?? 0;
}
