import { Prisma } from "@prisma/client";

/**
 * checkAndAwardAchievements
 *
 * This function checks whether a user qualifies for any achievements
 * based on the event that just happened (lesson completion, streak update, quiz perfect, etc.)
 * and awards any achievements they have not already earned.
 *
 * IMPORTANT:
 * - This MUST run inside a Prisma transaction (tx)
 * - Achievements are awarded based on "trigger" strings stored in the Achievement table
 * - We prevent duplicates by checking UserAchievement before inserting
 */
export async function checkAndAwardAchievements(ctx: {
  userId: string; // The user who may earn achievements
  lessonCompletedCount?: number; // How many lessons the user has completed
  streakDays?: number; // Current streak length
  quizPerfect?: boolean; // Whether the user got a perfect quiz score
  tx: Prisma.TransactionClient; // Transaction client (required for atomic writes)
}) {
  // We collect all achievement triggers the user qualifies for
  const triggers: string[] = [];

  /**
   * LESSON-BASED ACHIEVEMENTS
   * These fire when the user completes a certain number of lessons.
   */
  if (ctx.lessonCompletedCount === 1) {
    triggers.push("lesson_completed_count:1"); // "First Step"
  }

  if (ctx.lessonCompletedCount === 10) {
    triggers.push("lesson_completed_count:10"); // "Deep Dive"
  }

  /**
   * STREAK ACHIEVEMENTS
   * These fire when the user reaches certain streak milestones.
   */
  if (ctx.streakDays === 7) {
    triggers.push("streak_days:7"); // "Week Streak"
  }

  if (ctx.streakDays === 30) {
    triggers.push("streak_days:30"); // "Month Streak"
  }

  /**
   * QUIZ ACHIEVEMENTS
   * Fires when the user gets a perfect quiz score.
   */
  if (ctx.quizPerfect) {
    triggers.push("quiz_perfect"); // "Perfect Quiz"
  }

  // If no triggers matched, user earns nothing
  if (triggers.length === 0) return [];

  /**
   * STEP 1 — Find achievements that match the triggers
   * Example:
   * If triggers = ["lesson_completed_count:1"],
   * we fetch the Achievement row with trigger = "lesson_completed_count:1"
   */
  const achievements = await ctx.tx.achievement.findMany({
    where: { trigger: { in: triggers } },
  });

  // If no achievements match the triggers, return nothing
  if (!achievements.length) return [];

  /**
   * STEP 2 — Check which achievements the user already earned
   * We prevent duplicates by checking UserAchievement.
   */
  const already = await ctx.tx.userAchievement.findMany({
    where: {
      userId: ctx.userId,
      achievementId: { in: achievements.map((a) => a.id) },
    },
  });

  // Convert earned achievements into a Set for fast lookup
  const earnedIds = new Set(already.map((a) => a.achievementId));

  /**
   * STEP 3 — Filter out achievements the user already has
   * Only award achievements they have NOT earned yet.
   */
  const toInsert = achievements.filter((a) => !earnedIds.has(a.id));

  // If user already has all of them, return nothing
  if (!toInsert.length) return [];

  /**
   * STEP 4 — Insert new achievements into UserAchievement
   * This awards the achievements.
   */
  await ctx.tx.userAchievement.createMany({
    data: toInsert.map((a) => ({
      userId: ctx.userId,
      achievementId: a.id,
    })),
  });

  /**
   * STEP 5 — Return the achievements that were awarded
   * Your GraphQL mutation will send these back to the frontend
   * so you can show toast notifications.
   */
  return toInsert;
}
