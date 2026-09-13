import { builder } from "@graphql/builder";
import { prisma } from "@lib/prisma";
import { LeaderboardEntry, LeaderboardEntryRef } from "@graphql/types/leaderboardEntry";

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

      // 1. Get top N users
      const topUsers = await prisma.userXp.findMany({
        orderBy: { totalXp: "desc" },
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

      // 3. Fetch current user's XP record
      const currentUserXp = await prisma.userXp.findUnique({
        where: { userId: currentUserUid },
        include: {
          user: {
            include: { streak: true },
          },
        },
      });

      // If user has no XP yet, treat them as 0 XP
      const currentUserTotalXp = currentUserXp?.totalXp ?? 0;

      // 4. Calculate global rank
      const currentUserRank =
        (await prisma.userXp.count({
          where: { totalXp: { gt: currentUserTotalXp } },
        })) + 1;

      // 5. Build current user's leaderboard entry
      const currentUserEntry = {
        userId: currentUserUid,
        displayName: currentUserXp?.user.name ?? "Anonymous",
        avatar: currentUserXp?.user.photoUrl ?? null,
        totalXp: currentUserTotalXp,
        streak: currentUserXp?.user.streak?.currentDays ?? 0,
        rank: currentUserRank,
      };

      // 6. Convert top users into leaderboard entries
      const entries = topUsers.map((u, index) => ({
        userId: u.userId,
        displayName: u.user.name ?? "Anonymous",
        avatar: u.user.photoUrl ?? null,
        totalXp: u.totalXp,
        streak: u.user.streak?.currentDays ?? 0,
        rank: index + 1,
      }));

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
