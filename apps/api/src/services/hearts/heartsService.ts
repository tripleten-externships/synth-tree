import type { Prisma } from "@prisma/client";

const MAX_HEARTS = 5;
const REFILL_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes

export interface HeartsState {
  currentHearts: number;
  lastRefilledAt: Date;
}

/**
 * Computes how many hearts a user should have right now, given how much
 * time has passed since their last refill timestamp. Pure calculation —
 * no database access — so it can be unit tested without mocking Prisma.
 */
export function computeRefill(state: HeartsState, now: Date = new Date()): HeartsState {
  if (state.currentHearts >= MAX_HEARTS) {
    return state;
  }

  const elapsedMs = now.getTime() - state.lastRefilledAt.getTime();
  const heartsToAdd = Math.floor(elapsedMs / REFILL_INTERVAL_MS);

  if (heartsToAdd <= 0) {
    return state;
  }

  const newHearts = Math.min(MAX_HEARTS, state.currentHearts + heartsToAdd);

  const consumedMs = heartsToAdd * REFILL_INTERVAL_MS;
  const newLastRefilledAt = new Date(state.lastRefilledAt.getTime() + consumedMs);

  return {
    currentHearts: newHearts,
    lastRefilledAt: newLastRefilledAt,
  };
}

/**
 * Fetches (or lazily creates) a user's hearts record, applying any pending
 * refill before returning it. This is the "refill on read" strategy named
 * in the ticket as the simplest option, rather than a scheduled background
 * job (pg_cron / periodic ECS task).
 */
export async function getOrRefillHearts(tx: Prisma.TransactionClient, userId: string) {
  const existing = await tx.userHearts.findUnique({ where: { userId } });

  if (!existing) {
    return tx.userHearts.create({
      data: { userId, currentHearts: MAX_HEARTS, lastRefilledAt: new Date() },
    });
  }

  const refilled = computeRefill(existing, new Date());

  const changed =
    refilled.currentHearts !== existing.currentHearts ||
    refilled.lastRefilledAt.getTime() !== existing.lastRefilledAt.getTime();

  if (!changed) {
    return existing;
  }

  return tx.userHearts.update({
    where: { userId },
    data: refilled,
  });
}

/**
 * Decrements a user's hearts by 1, applying any pending refill first so a
 * user who's been away long enough to regenerate hearts isn't penalized
 * against a stale count. Never goes below 0.
 *
 * NOT YET WIRED into gradeQuizAttempt.ts as of this PR — see the PR
 * description for why.
 */
export async function decrementHeartOnFailure(tx: Prisma.TransactionClient, userId: string) {
  const current = await getOrRefillHearts(tx, userId);
  const newHearts = Math.max(0, current.currentHearts - 1);

  return tx.userHearts.update({
    where: { userId },
    data: { currentHearts: newHearts },
  });
}

export { MAX_HEARTS, REFILL_INTERVAL_MS };
