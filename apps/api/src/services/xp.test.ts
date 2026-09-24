import type { PrismaClient, Prisma } from "@prisma/client";
import { awardXp } from "./xp";
import { incrementDailyQuestProgress } from "./dailyQuests";

jest.mock("./dailyQuests", () => ({
  incrementDailyQuestProgress: jest.fn().mockResolvedValue(undefined),
}));

const incrementQuest = jest.mocked(incrementDailyQuestProgress);

function setup() {
  const event = { id: "event-1", amount: 25 };

  const client = {
    xpEvent: {
      findFirst: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue(event),
    },
    userXp: {
      upsert: jest.fn().mockResolvedValue({
        todayAsOf: new Date(),
        todayXp: 0,
        weeklyXp: {},
      }),
      update: jest.fn().mockResolvedValue({}),
    },
    user: {
      findUnique: jest.fn().mockResolvedValue({ timezone: "UTC" }),
    },
    userStreak: {
      findUnique: jest.fn().mockResolvedValue(null),
      upsert: jest.fn().mockResolvedValue({}),
    },
  };

  const tx = client as unknown as Prisma.TransactionClient;
  const transaction = jest.fn(async (run) => run(tx));
  const prisma = {
    $transaction: transaction,
  } as unknown as PrismaClient;

  return { client, tx, prisma, transaction, event };
}

describe("awardXp daily quest progress", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("advances the quest by the awarded XP in the same transaction", async () => {
    const { prisma, tx } = setup();

    await awardXp(prisma, "user-1", 25, "LESSON_COMPLETED", {
      nodeId: "node-1",
    });

    expect(incrementQuest).toHaveBeenCalledTimes(1);
    expect(incrementQuest).toHaveBeenCalledWith(tx, "user-1", "XP_EARNED", 25);
  });

  it("does not advance the quest for an existing reward", async () => {
    const { prisma, client, event } = setup();
    client.xpEvent.findFirst.mockResolvedValue(event);

    await awardXp(prisma, "user-1", 25, "LESSON_COMPLETED", {
      nodeId: "node-1",
    });

    expect(client.xpEvent.create).not.toHaveBeenCalled();
    expect(incrementQuest).not.toHaveBeenCalled();
  });

  it("reuses a supplied transaction for the quest update", async () => {
    const { prisma, tx, transaction } = setup();

    await awardXp(prisma, "user-1", 25, "LESSON_COMPLETED", { nodeId: "node-1" }, tx);

    expect(transaction).not.toHaveBeenCalled();
    expect(incrementQuest).toHaveBeenCalledWith(tx, "user-1", "XP_EARNED", 25);
  });
});
