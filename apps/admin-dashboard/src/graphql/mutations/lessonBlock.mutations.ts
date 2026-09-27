import { prisma } from "@lib/prisma";
import { checkAndAwardAchievements } from "../../services/achievements";

builder.mutationField("completeLesson", (t) =>
  t.field({
    type: "LessonProgress",
    args: {
      lessonId: t.arg.string({ required: true }),
    },
    resolve: async (_, { lessonId }, ctx) => {
      const userId = ctx.user.id;

      return await prisma.$transaction(async (tx) => {
        // 1. Mark lesson as completed
        const progress = await tx.lessonProgress.upsert({
          where: {
            userId_lessonId: { userId, lessonId },
          },
          update: { completed: true },
          create: { userId, lessonId, completed: true },
        });

        // 2. Count total completed lessons
        const lessonCompletedCount = await tx.lessonProgress.count({
          where: { userId, completed: true },
        });

        // 3. Update streak (SYN‑41)
        const streakDays = await updateUserStreak(userId, tx);
        // IMPORTANT: updateUserStreak must also accept tx

        // 4. Award achievements (SYN‑42)
        const awarded = await checkAndAwardAchievements({
          userId,
          lessonCompletedCount,
          streakDays,
          tx, // REQUIRED
        });

        // 5. Return progress + awarded achievements
        return {
          ...progress,
          awardedAchievements: awarded,
        };
      });
    },
  }),
);
