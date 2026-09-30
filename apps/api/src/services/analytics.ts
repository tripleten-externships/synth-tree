import type { Prisma, PrismaClient } from "@prisma/client";

export type AnalyticsRange = "7d" | "30d" | "90d" | "all";
export interface MetricStat {
  current: number | null;
  previous: number | null;
  percentChange: number | null;
}
export interface AnalyticsSummary {
  activeLearners: MetricStat;
  lessonsCompleted: MetricStat;
  avgSessionMinutes: MetricStat;
  courseCompletionRate: MetricStat;
}

type AnalyticsDatabase = Pick<Prisma.TransactionClient, "user" | "userNodeProgress">;
const DAY_MS = 24 * 60 * 60 * 1000;
const CACHE_TTL_MS = 60 * 1000;
const caches = new WeakMap<
  PrismaClient,
  Map<AnalyticsRange, { expiresAt: number; data: AnalyticsSummary }>
>();

function metric(current: number | null, previous: number | null): MetricStat {
  return {
    current,
    previous,
    percentChange:
      current === null || previous === null || previous === 0
        ? null
        : Number((((current - previous) / previous) * 100).toFixed(1)),
  };
}

async function countWindow(db: AnalyticsDatabase, start: Date | undefined, end: Date) {
  const window: Prisma.DateTimeFilter = { ...(start ? { gte: start } : {}), lt: end };
  const [activeLearners, lessonsCompleted] = await Promise.all([
    db.user.count({
      where: {
        role: "USER",
        OR: [
          {
            nodeProgress: {
              some: {
                status: { not: "NOT_STARTED" },
                OR: [{ createdAt: window }, { updatedAt: window }, { completedAt: window }],
              },
            },
          },
          { xpEvents: { some: { createdAt: window } } },
          { quizAttempts: { some: { takenAt: window } } },
        ],
      },
    }),
    db.userNodeProgress.count({
      where: { user: { role: "USER" }, status: "COMPLETED", completedAt: window },
    }),
  ]);
  return { activeLearners, lessonsCompleted };
}

export async function calculateAdminAnalytics(
  db: AnalyticsDatabase,
  range: AnalyticsRange,
  now: Date,
): Promise<AnalyticsSummary> {
  const days = { "7d": 7, "30d": 30, "90d": 90 };
  const start = range === "all" ? undefined : new Date(now.getTime() - days[range] * DAY_MS);
  const current = await countWindow(db, start, now);
  const previous =
    start && range !== "all"
      ? await countWindow(db, new Date(start.getTime() - days[range] * DAY_MS), start)
      : null;
  return {
    activeLearners: metric(current.activeLearners, previous?.activeLearners ?? null),
    lessonsCompleted: metric(current.lessonsCompleted, previous?.lessonsCompleted ?? null),
    avgSessionMinutes: metric(null, null),
    courseCompletionRate: metric(null, null),
  };
}

export async function getAdminAnalytics(
  db: PrismaClient,
  range: AnalyticsRange,
): Promise<AnalyticsSummary> {
  let cache = caches.get(db);
  if (!cache) {
    cache = new Map();
    caches.set(db, cache);
  }
  const cached = cache.get(range);
  if (cached && Date.now() < cached.expiresAt) return cached.data;
  const now = new Date(Date.now());
  const data = await db.$transaction((tx) => calculateAdminAnalytics(tx, range, now), {
    isolationLevel: "RepeatableRead",
  });
  cache.set(range, { expiresAt: Date.now() + CACHE_TTL_MS, data });
  return data;
}
