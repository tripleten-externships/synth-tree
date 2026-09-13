import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Local Admin (REAL ID)
  await prisma.userXp.upsert({
    where: { userId: "LydF47Dlk4Pt0SjgFmj5YSViN5w1" },
    update: {},
    create: {
      userId: "LydF47Dlk4Pt0SjgFmj5YSViN5w1",
      totalXp: 2500,
    },
  });

  // Demo Author (REAL ID)
  await prisma.userXp.upsert({
    where: { userId: "demo-author" },
    update: {},
    create: {
      userId: "demo-author",
      totalXp: 1800,
    },
  });

  // Local Learner (REAL ID)
  await prisma.userXp.upsert({
    where: { userId: "y4AO22M7BdOWCu7CpcDvyGnMN9q1" },
    update: {},
    create: {
      userId: "y4AO22M7BdOWCu7CpcDvyGnMN9q1",
      totalXp: 900,
    },
  });

  // Optional streak for Local Learner
  await prisma.userStreak.upsert({
    where: { userId: "y4AO22M7BdOWCu7CpcDvyGnMN9q1" },
    update: { currentDays: 5 },
    create: {
      userId: "y4AO22M7BdOWCu7CpcDvyGnMN9q1",
      currentDays: 5,
    },
  });
}

main()
  .then(() => {
    console.log("Seed complete");
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    return prisma.$disconnect();
  });
