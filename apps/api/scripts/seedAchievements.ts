import { prisma } from "../src/lib/prisma";
import { seedAchievementDefinitions } from "../src/services/achievementDefinitions";

seedAchievementDefinitions(prisma)
  .then((count) => {
    console.log(`Achievements seeded (${count} definitions)`);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
