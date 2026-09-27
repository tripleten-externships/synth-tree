import { prisma } from "../src/lib/prisma";

const ACHIEVEMENTS = [
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
