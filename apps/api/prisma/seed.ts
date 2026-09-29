import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Leaderboard demo seed. Idempotent — safe to re-run.
 *
 * The two "local" ids below are the real Firebase UIDs created by
 * `pnpm db:seed:local-users` (admin@local.dev / learner@local.dev), so the XP
 * seeded here lines up with the accounts you actually log in as locally.
 *
 * Run with: pnpm --filter @synth-tree/api db:seed:leaderboard
 */
const users: Array<{
  id: string;
  email: string;
  name: string;
  role?: Role;
  totalXp: number;
  streakDays?: number;
}> = [
  {
    id: "LydF47Dlk4Pt0SjgFmj5YSViN5w1",
    email: "admin@local.dev",
    name: "Local Admin",
    role: "ADMIN",
    totalXp: 2500,
  },
  {
    id: "demo-author",
    email: "demo-author@local.dev",
    name: "Demo Author",
    totalXp: 1800,
  },
  {
    id: "y4AO22M7BdOWCu7CpcDvyGnMN9q1",
    email: "learner@local.dev",
    name: "Local Learner",
    totalXp: 900,
    streakDays: 5,
  },
];

async function main() {
  for (const u of users) {
    // The parent User row must exist before UserXp/UserStreak, otherwise the
    // foreign keys violate on a fresh database.
    await prisma.user.upsert({
      where: { id: u.id },
      update: {},
      create: {
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role ?? "USER",
      },
    });

    await prisma.userXp.upsert({
      where: { userId: u.id },
      update: {},
      create: {
        userId: u.id,
        totalXp: u.totalXp,
      },
    });

    if (u.streakDays !== undefined) {
      await prisma.userStreak.upsert({
        where: { userId: u.id },
        update: { currentDays: u.streakDays },
        create: {
          userId: u.id,
          currentDays: u.streakDays,
        },
      });
    }
  }
}

main()
  .then(() => {
    console.log("✅ Leaderboard seed complete");
  })
  .catch((e) => {
    console.error("❌ Leaderboard seed failed:", e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
