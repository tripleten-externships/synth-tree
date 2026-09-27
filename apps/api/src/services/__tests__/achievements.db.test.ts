import { PrismaClient } from "@prisma/client";
import { checkAndAwardAchievements } from "../achievements";
import { getUserStreakDays } from "../streak";
import { awardXp } from "../xp";

const prisma = new PrismaClient();
const USER_ID = "syn42-achievement-test-user";

function setNow(iso: string) {
  jest.useFakeTimers({
    now: new Date(iso),
    doNotFake: [
      "nextTick",
      "setImmediate",
      "clearImmediate",
      "setTimeout",
      "clearTimeout",
      "setInterval",
      "clearInterval",
      "queueMicrotask",
    ],
  });
}

beforeAll(async () => {
  await prisma.achievement.upsert({
    where: { id: "first-step" },
    update: {},
    create: {
      id: "first-step",
      name: "First Step",
      description: "Complete your first lesson",
      icon: "footsteps",
      color: "primary",
      trigger: "lesson_completed_count:1",
    },
  });
  await prisma.achievement.upsert({
    where: { id: "week-streak" },
    update: {},
    create: {
      id: "week-streak",
      name: "Week Streak",
      description: "Maintain a 7-day learning streak",
      icon: "calendar",
      color: "success",
      trigger: "streak_days:7",
    },
  });
});

beforeEach(async () => {
  await prisma.user.deleteMany({ where: { id: USER_ID } });
  await prisma.user.create({
    data: { id: USER_ID, email: "syn42-achievements@test.com" },
  });
});

afterEach(() => {
  jest.useRealTimers();
});

afterAll(async () => {
  await prisma.user.deleteMany({ where: { id: USER_ID } });
  await prisma.$disconnect();
});

describe("achievement awarding (DB)", () => {
  it("persists first-step when the first lesson is completed", async () => {
    const awarded = await prisma.$transaction((tx) =>
      checkAndAwardAchievements({
        userId: USER_ID,
        lessonCompletedCount: 1,
        streakDays: 1,
        tx,
      }),
    );

    expect(awarded.map(({ id }) => id)).toContain("first-step");
    await expect(
      prisma.userAchievement.findUniqueOrThrow({
        where: {
          userId_achievementId: { userId: USER_ID, achievementId: "first-step" },
        },
      }),
    ).resolves.toBeDefined();
  });

  it("persists week-streak when XP advances the user's streak to seven days", async () => {
    setNow("2026-09-27T12:00:00.000Z");
    await prisma.userStreak.create({
      data: {
        userId: USER_ID,
        currentDays: 6,
        longestDays: 6,
        lastActive: new Date("2026-09-26T12:00:00.000Z"),
      },
    });

    const awarded = await prisma.$transaction(async (tx) => {
      await awardXp(
        prisma,
        USER_ID,
        10,
        "NODE_COMPLETED",
        { nodeId: "syn42-week-streak-node" },
        tx,
      );
      const streakDays = await getUserStreakDays(USER_ID, tx);

      return checkAndAwardAchievements({ userId: USER_ID, streakDays, tx });
    });

    expect(awarded.map(({ id }) => id)).toContain("week-streak");
    await expect(
      prisma.userAchievement.findUniqueOrThrow({
        where: {
          userId_achievementId: { userId: USER_ID, achievementId: "week-streak" },
        },
      }),
    ).resolves.toBeDefined();
  });
});
