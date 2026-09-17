import { PrismaClient } from "@prisma/client";
import {
  getOrRefillHearts,
  decrementHeartOnFailure,
  MAX_HEARTS,
  REFILL_INTERVAL_MS,
} from "../heartsService";

const prisma = new PrismaClient();
const USER_ID = "test-hearts-user-id";

beforeAll(async () => {
  await prisma.user.upsert({
    where: { id: USER_ID },
    update: {},
    create: { id: USER_ID, email: "hearts@test.com", name: "Hearts User", role: "USER" },
  });
});

afterEach(async () => {
  await prisma.userHearts.deleteMany({ where: { userId: USER_ID } });
});

afterAll(async () => {
  await prisma.userHearts.deleteMany({ where: { userId: USER_ID } });
  await prisma.user.deleteMany({ where: { id: USER_ID } });
  await prisma.$disconnect();
});

describe("getOrRefillHearts (DB)", () => {
  it("lazily creates a full hearts row on first read", async () => {
    const row = await getOrRefillHearts(prisma, USER_ID);
    expect(row.currentHearts).toBe(MAX_HEARTS);
  });

  it("persists an applied refill when enough time has elapsed", async () => {
    await prisma.userHearts.create({
      data: {
        userId: USER_ID,
        currentHearts: 2,
        lastRefilledAt: new Date(Date.now() - 60 * 60 * 1000), // 60 min ago
      },
    });

    const row = await getOrRefillHearts(prisma, USER_ID);
    expect(row.currentHearts).toBe(4); // +2 hearts for 2 elapsed intervals

    const stored = await prisma.userHearts.findUniqueOrThrow({ where: { userId: USER_ID } });
    expect(stored.currentHearts).toBe(4);
  });
});

describe("decrementHeartOnFailure (DB)", () => {
  it("spending from a full account restarts the refill clock, so the heart is not instantly refilled", async () => {
    // Full account with an old timestamp (as a full row legitimately has).
    await prisma.userHearts.create({
      data: {
        userId: USER_ID,
        currentHearts: MAX_HEARTS,
        lastRefilledAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5h ago
      },
    });

    const afterSpend = await decrementHeartOnFailure(prisma, USER_ID);
    expect(afterSpend.currentHearts).toBe(MAX_HEARTS - 1);
    // Clock reset to ~now, not left in the past.
    expect(Date.now() - afterSpend.lastRefilledAt.getTime()).toBeLessThan(REFILL_INTERVAL_MS);

    // An immediate re-read must NOT refill the heart that was just spent.
    const reread = await getOrRefillHearts(prisma, USER_ID);
    expect(reread.currentHearts).toBe(MAX_HEARTS - 1);
  });

  it("spending below max preserves the existing refill clock", async () => {
    const tenMinAgo = new Date(Date.now() - 10 * 60 * 1000);
    await prisma.userHearts.create({
      data: { userId: USER_ID, currentHearts: 3, lastRefilledAt: tenMinAgo },
    });

    const afterSpend = await decrementHeartOnFailure(prisma, USER_ID);
    expect(afterSpend.currentHearts).toBe(2);
    // Not full before spending, so the in-progress timer is untouched.
    expect(afterSpend.lastRefilledAt.getTime()).toBe(tenMinAgo.getTime());
  });

  it("never drops below zero", async () => {
    await prisma.userHearts.create({
      data: { userId: USER_ID, currentHearts: 0, lastRefilledAt: new Date() },
    });

    const afterSpend = await decrementHeartOnFailure(prisma, USER_ID);
    expect(afterSpend.currentHearts).toBe(0);
  });
});
