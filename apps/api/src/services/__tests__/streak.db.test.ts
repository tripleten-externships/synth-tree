import { PrismaClient } from "@prisma/client";
import { awardXp } from "../xp";

const prisma = new PrismaClient();
const USER_ID = "test-streak-user-id";

let rewardCounter = 0;

// Each call uses a fresh nodeId so the idempotency guard never short-circuits.
function award() {
  rewardCounter += 1;
  return awardXp(prisma, USER_ID, 10, "NODE_COMPLETED", {
    nodeId: `streak-test-node-${rewardCounter}`,
  });
}

function getStreak() {
  return prisma.userStreak.findUniqueOrThrow({ where: { userId: USER_ID } });
}

function seedStreak(lastActive: string, currentDays: number, longestDays: number) {
  return prisma.userStreak.create({
    data: {
      userId: USER_ID,
      lastActive: new Date(lastActive),
      currentDays,
      longestDays,
    },
  });
}

function setTimezone(timezone: string) {
  return prisma.user.update({ where: { id: USER_ID }, data: { timezone } });
}

// Pin only the clock; Prisma relies on real timers and microtasks.
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

afterAll(async () => {
  await prisma.user.deleteMany({ where: { id: USER_ID } });
  await prisma.$disconnect();
});

// Every test pins "now" to a fixed UTC instant, so results depend only on the
// user's timezone, never on the server's. Run with TZ=UTC (as on CI) to
// exercise the DST cases against a server-local-time regression.
describe("awardXp streak (DB)", () => {
  beforeEach(async () => {
    // Cascades to UserStreak, UserXp and XpEvent.
    await prisma.user.deleteMany({ where: { id: USER_ID } });
    await prisma.user.create({
      data: { id: USER_ID, email: "streak@test.com", name: "Streak User" },
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("starts a streak at 1 on the first ever award", async () => {
    setNow("2026-09-24T12:00:00Z");

    await award();

    const streak = await getStreak();
    expect(streak.currentDays).toBe(1);
    expect(streak.longestDays).toBe(1);
    expect(streak.lastActive).toEqual(new Date("2026-09-24T12:00:00Z"));
  });

  it("does not double-increment for multiple awards on the same day", async () => {
    setNow("2026-09-24T08:00:00Z");
    await award();

    setNow("2026-09-24T20:00:00Z");
    await award();
    await award();
    // Re-awarding an already-granted reward is a no-op.
    await awardXp(prisma, USER_ID, 10, "NODE_COMPLETED", {
      nodeId: `streak-test-node-${rewardCounter}`,
    });

    const streak = await getStreak();
    expect(streak.currentDays).toBe(1);
    expect(streak.longestDays).toBe(1);
  });

  it("increments when the last activity was yesterday and raises longestDays", async () => {
    await seedStreak("2026-09-23T12:00:00Z", 3, 3);
    setNow("2026-09-24T12:00:00Z");

    await award();

    const streak = await getStreak();
    expect(streak.currentDays).toBe(4);
    expect(streak.longestDays).toBe(4);
  });

  it("resets to 1 after skipping a day but keeps longestDays", async () => {
    await seedStreak("2026-09-22T12:00:00Z", 5, 7);
    setNow("2026-09-24T12:00:00Z");

    await award();

    const streak = await getStreak();
    expect(streak.currentDays).toBe(1);
    expect(streak.longestDays).toBe(7);
  });

  it("falls back to UTC instead of throwing on an invalid timezone", async () => {
    await setTimezone("Not/A_Zone");
    await seedStreak("2026-09-23T23:30:00Z", 2, 2);
    setNow("2026-09-24T00:30:00Z");

    await expect(award()).resolves.toBeDefined();

    // Consecutive UTC days -> incremented.
    expect((await getStreak()).currentDays).toBe(3);
  });

  it("uses the user's local day, not the UTC day", async () => {
    await setTimezone("America/New_York");
    // 2026-09-23 23:00 EDT, then 2026-09-24 08:00 EDT: same UTC date,
    // consecutive local dates.
    await seedStreak("2026-09-24T03:00:00Z", 2, 2);
    setNow("2026-09-24T12:00:00Z");

    await award();

    expect((await getStreak()).currentDays).toBe(3);
  });

  it("treats two activities on the same local day as a no-op across a UTC midnight", async () => {
    await setTimezone("America/New_York");
    // 2026-09-24 19:00 EDT, then 2026-09-24 21:00 EDT: different UTC dates,
    // same local date.
    await seedStreak("2026-09-24T23:00:00Z", 2, 2);
    setNow("2026-09-25T01:00:00Z");

    await award();

    expect((await getStreak()).currentDays).toBe(2);
  });

  it("counts a 25-hour DST fall-back day as one day", async () => {
    await setTimezone("America/New_York");
    // Last active 2026-10-31 12:00 EDT; now 2026-11-01 23:30 EST, the last
    // hour of the fall-back day.
    await seedStreak("2026-10-31T16:00:00Z", 5, 5);
    setNow("2026-11-02T04:30:00Z");

    await award();

    expect((await getStreak()).currentDays).toBe(6);
  });

  it("counts a 23-hour DST spring-forward day as one day", async () => {
    await setTimezone("America/New_York");
    // Last active 2026-03-08 12:00 EDT (spring-forward day); now
    // 2026-03-09 00:30 EDT, the first hour of the next day.
    await seedStreak("2026-03-08T16:00:00Z", 5, 5);
    setNow("2026-03-09T04:30:00Z");

    await award();

    expect((await getStreak()).currentDays).toBe(6);
  });
});
