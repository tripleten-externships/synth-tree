import { builder } from "@graphql/builder";
import { prisma } from "@lib/prisma";
import { LeaderboardEntry, LeaderboardEntryRef } from "@graphql/types/leaderboardEntry";

// Shown for users without a display name (null, or blank after clearing it on
// Profile). Deliberately not derived from their email, since every signed-in
// learner can see the leaderboard.
const FALLBACK_DISPLAY_NAME = "Learner";

function displayNameOf(name: string | null | undefined): string {
  return name?.trim() || FALLBACK_DISPLAY_NAME;
}

// Wrapper type: contains the list + the current user's global rank
export const LeaderboardPayloadRef = builder.objectRef<{
  entries: Array<LeaderboardEntry>;
  currentUserRank: number;
}>("LeaderboardPayload");

builder.objectType(LeaderboardPayloadRef, {
  fields: (t) => ({
    entries: t.field({
      type: [LeaderboardEntryRef],
      resolve: (parent) => parent.entries,
    }),
    currentUserRank: t.int({
      resolve: (parent) => parent.currentUserRank,
    }),
  }),
});

// Main leaderboard query
builder.queryField("leaderboard", (t) =>
  t.field({
    type: LeaderboardPayloadRef,
    args: {
      limit: t.arg.int({ defaultValue: 100 }),
    },

    resolve: async (_root, { limit }, ctx) => {
      const resultLimit = limit ?? 100;

      // 1. Get top N users. Secondary sort by userId keeps ordering stable and
      //    deterministic when several users are tied on totalXp.
      const topUsers = await prisma.userXp.findMany({
        orderBy: [{ totalXp: "desc" }, { userId: "asc" }],
        take: resultLimit,
        include: {
          user: {
            include: {
              streak: true,
            },
          },
        },
      });

      // 2. Get current user's Firebase UID
      const currentUserUid = ctx.auth.requireAuth();

      // 3. Fetch the current user with their XP. Loading the User row (not the
      //    UserXp row) keeps their name and avatar even before they earn XP.
      const currentUser = await prisma.user.findUnique({
        where: { id: currentUserUid },
        include: { xp: true, streak: true },
      });

      // If user has no XP yet, treat them as 0 XP
      const currentUserTotalXp = currentUser?.xp?.totalXp ?? 0;

      // 4. Calculate global rank
      const currentUserRank =
        (await prisma.userXp.count({
          where: { totalXp: { gt: currentUserTotalXp } },
        })) + 1;

      // 5. Build current user's leaderboard entry
      const currentUserEntry = {
        userId: currentUserUid,
        displayName: displayNameOf(currentUser?.name),
        avatar: currentUser?.photoUrl ?? null,
        totalXp: currentUserTotalXp,
        streak: currentUser?.streak?.currentDays ?? 0,
        rank: currentUserRank,
      };

      // 6. Convert top users into leaderboard entries using competition
      //    ranking (ties share a rank: 1, 2, 2, 4). Because the list is sorted
      //    by totalXp desc, the rank of the first row with a given totalXp is
      //    index + 1, which equals count(totalXp > x) + 1 — the same formula
      //    used above for currentUserRank. This guarantees a user's row rank
      //    matches what currentUserRank would compute.
      let previousXp: number | null = null;
      let previousRank = 0;
      const entries: LeaderboardEntry[] = topUsers.map((u, index) => {
        const rank = previousXp === null || u.totalXp !== previousXp ? index + 1 : previousRank;
        previousXp = u.totalXp;
        previousRank = rank;
        return {
          userId: u.userId,
          displayName: displayNameOf(u.user.name),
          avatar: u.user.photoUrl ?? null,
          totalXp: u.totalXp,
          streak: u.user.streak?.currentDays ?? 0,
          rank,
        };
      });

      // 7. Add current user if not already in top N
      const isInTop = entries.some((u) => u.userId === currentUserUid);

      if (!isInTop) {
        entries.push(currentUserEntry);
      }

      // 8. Return both the list + the current user's global rank
      return {
        entries,
        currentUserRank,
      };
    },
  }),
);
