import { builder } from "../builder";
import { prisma } from "../../../prisma";

builder.queryField("leaderboard", (t) =>
  t.field({
    type: ["LeaderboardEntry"],
    args: {
      limit: t.arg.int({ defaultValue: 100 }),
    },
    resolve: async (_root, args, ctx) => {
      const currentUserId = ctx.currentUser?.id;

      // 1. Fetch top-N users
      const topUsers = await prisma.userXp.findMany({
        orderBy: { totalXp: "desc" },
        take: args.limit,
        include: {
          user: {
            include: {
              streak: true,
            },
          },
        },
      });

      // 2. Map top-N into leaderboard entries
      const leaderboard = topUsers.map((u, index) => ({
        userId: u.userId,
        name: u.user.name ?? "Anonymous",
        avatar: u.user.photoUrl ?? null,
        score: u.totalXp,
        streak: u.user.streak?.currentDays ?? 0,
        rank: index + 1,
      }));

      // 3. If no logged-in user, return top-N only
      if (!currentUserId) return leaderboard;

      // 4. Check if current user is already in top-N
      const alreadyInTop = leaderboard.find((entry) => entry.userId === currentUserId);
      if (alreadyInTop) return leaderboard;

      // 5. Compute current user's global rank
      const globalRank =
        (await prisma.userXp.count({
          where: {
            totalXp: { gt: leaderboard[leaderboard.length - 1].score },
          },
        })) + 1;

      // 6. Fetch current user's XP + profile + streak
      const currentUserXp = await prisma.userXp.findUnique({
        where: { userId: currentUserId },
        include: {
          user: {
            include: {
              streak: true,
            },
          },
        },
      });

      if (!currentUserXp) return leaderboard;

      // 7. Append current user at the bottom
      leaderboard.push({
        userId: currentUserXp.userId,
        name: currentUserXp.user.name ?? "Anonymous",
        avatar: currentUserXp.user.photoUrl ?? null,
        score: currentUserXp.totalXp,
        streak: currentUserXp.user.streak?.currentDays ?? 0,
        rank: globalRank,
      });

      return leaderboard;
    },
  }),
);
