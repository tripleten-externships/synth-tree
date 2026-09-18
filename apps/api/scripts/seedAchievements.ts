import { prisma } from "../src/lib/prisma";

const ACHIEVEMENTS = [
  {
    id: "first-step",
    name: "First Step",
    description: "Completed your first lesson",
    icon: "footsteps",
    color: "primary",
    trigger: "lesson_completed_count:1",
  },
  {
    id: "week-streak",
    name: "Week Streak",
    description: "Maintained a 7-day learning streak",
    icon: "calendar",
    color: "success",
    trigger: "streak_days:7",
  },
  {
    id: "perfect-quiz",
    name: "Perfect Quiz",
    description: "Scored 100% on a quiz",
    icon: "star",
    color: "warning",
    trigger: "quiz_perfect",
  },
  {
    id: "branch-master",
    name: "Branch Master",
    description: "Completed all lessons in a branch",
    icon: "git-branch",
    color: "brand",
    trigger: "branch_completed",
  },
  {
    id: "deep-dive",
    name: "Deep Dive",
    description: "Completed 10 lessons",
    icon: "layers",
    color: "primary",
    trigger: "lesson_completed_count:10",
  },
  {
    id: "boss",
    name: "Boss",
    description: "Completed all quizzes",
    icon: "trophy",
    color: "destructive",
    trigger: "all_quizzes_completed",
  },
  {
    id: "polyglot",
    name: "Polyglot",
    description: "Completed lessons in 3 different branches",
    icon: "globe",
    color: "success",
    trigger: "branches_completed:3",
  },
  {
    id: "month-streak",
    name: "Month Streak",
    description: "Maintained a 30-day learning streak",
    icon: "calendar-check",
    color: "brand",
    trigger: "streak_days:30",
  },
];

async function main() {
  for (const a of ACHIEVEMENTS) {
    await prisma.achievement.upsert({
      where: { id: a.id },
      update: {},
      create: a,
    });
  }
}

main()
  .then(() => {
    console.log("Achievements seeded");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
