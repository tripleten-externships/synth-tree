import type { Prisma, PrismaClient } from "@prisma/client";

export type AchievementDefinition = {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  trigger: string;
};

// The achievement catalog. `trigger` is matched by checkAndAwardAchievements
// (./achievements.ts). Seeded by scripts/seedAchievements.ts
// (`pnpm prisma:seed:achievements`) and scripts/seedDemoContent.ts
// (`pnpm db:seed:demo`).
export const ACHIEVEMENT_DEFINITIONS: readonly AchievementDefinition[] = [
  {
    id: "first-step",
    name: "First Step",
    description: "Complete your first lesson",
    icon: "footsteps",
    color: "primary",
    trigger: "lesson_completed_count:1",
  },
  {
    id: "deep-dive",
    name: "Deep Dive",
    description: "Complete 10 lessons",
    icon: "layers",
    color: "primary",
    trigger: "lesson_completed_count:10",
  },
  {
    id: "week-streak",
    name: "Week Streak",
    description: "Maintain a 7-day learning streak",
    icon: "calendar",
    color: "success",
    trigger: "streak_days:7",
  },
  {
    id: "month-streak",
    name: "Month Streak",
    description: "Maintain a 30-day learning streak",
    icon: "calendar-check",
    color: "brand",
    trigger: "streak_days:30",
  },
  {
    id: "perfect-quiz",
    name: "Perfect Quiz",
    description: "Score 100% on a quiz",
    icon: "star",
    color: "warning",
    trigger: "quiz_perfect",
  },
  {
    id: "branch-master",
    name: "Branch Master",
    description: "Complete all lessons in a branch",
    icon: "git-branch",
    color: "brand",
    trigger: "branch_completed",
  },
  {
    id: "boss",
    name: "Boss",
    description: "Complete all quizzes",
    icon: "trophy",
    color: "destructive",
    trigger: "all_quizzes_completed",
  },
  {
    id: "polyglot",
    name: "Polyglot",
    description: "Complete lessons in 3 different branches",
    icon: "globe",
    color: "success",
    trigger: "branches_completed:3",
  },
];

// Creates or updates every catalog row, so edits to a definition reach
// existing databases. Safe to re-run.
export async function seedAchievementDefinitions(
  prisma: PrismaClient | Prisma.TransactionClient,
): Promise<number> {
  for (const { id, ...fields } of ACHIEVEMENT_DEFINITIONS) {
    await prisma.achievement.upsert({
      where: { id },
      update: fields,
      create: { id, ...fields },
    });
  }
  return ACHIEVEMENT_DEFINITIONS.length;
}
