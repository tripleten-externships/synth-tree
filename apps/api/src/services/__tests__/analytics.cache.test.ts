import type { PrismaClient } from "@prisma/client";
import { calculateAdminAnalytics, getAdminAnalytics } from "../analytics";

const now = Date.parse("2026-09-25T12:00:00Z");
afterEach(() => jest.restoreAllMocks());

it("caches separately per range and expires exactly after 60 seconds", async () => {
  const clock = jest.spyOn(Date, "now").mockReturnValue(now);
  const user = { count: jest.fn().mockResolvedValue(4) };
  const userNodeProgress = { count: jest.fn().mockResolvedValue(2) };
  const transaction = jest.fn(async (run) => run({ user, userNodeProgress }));
  const db = { $transaction: transaction } as unknown as PrismaClient;
  await getAdminAnalytics(db, "7d");
  await getAdminAnalytics(db, "30d");
  expect(transaction).toHaveBeenCalledTimes(2);
  await getAdminAnalytics(db, "7d");
  expect(transaction).toHaveBeenCalledTimes(2);
  clock.mockReturnValue(now + 59999);
  await getAdminAnalytics(db, "7d");
  expect(transaction).toHaveBeenCalledTimes(2);
  clock.mockReturnValue(now + 60000);
  await getAdminAnalytics(db, "7d");
  expect(transaction).toHaveBeenCalledTimes(3);
});

it("does not share cached data between database clients", async () => {
  const makeClient = (count: number) =>
    ({
      $transaction: jest.fn(async (run) =>
        run({
          user: { count: jest.fn().mockResolvedValue(count) },
          userNodeProgress: { count: jest.fn().mockResolvedValue(0) },
        }),
      ),
    }) as unknown as PrismaClient;
  expect((await getAdminAnalytics(makeClient(2), "7d")).activeLearners.current).toBe(2);
  expect((await getAdminAnalytics(makeClient(8), "7d")).activeLearners.current).toBe(8);
});

it("calculates a negative percentage and leaves a zero denominator undefined", async () => {
  const db = {
    user: { count: jest.fn().mockResolvedValueOnce(1).mockResolvedValueOnce(3) },
    userNodeProgress: { count: jest.fn().mockResolvedValueOnce(5).mockResolvedValueOnce(0) },
  } as unknown as PrismaClient;
  const result = await calculateAdminAnalytics(db, "7d", new Date(now));
  expect(result.activeLearners).toEqual({ current: 1, previous: 3, percentChange: -66.7 });
  expect(result.lessonsCompleted).toEqual({ current: 5, previous: 0, percentChange: null });
});
