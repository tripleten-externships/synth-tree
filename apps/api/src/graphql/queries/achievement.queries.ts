import { builder } from "@graphql/builder";

builder.queryField("myAchievements", (t) =>
  t.prismaField({
    type: ["UserAchievement"],
    resolve: async (query, _root, _args, ctx) => {
      const userId = ctx.auth.requireAuth();

      return ctx.prisma.userAchievement.findMany({
        ...query,
        where: { userId },
        orderBy: { earnedAt: "desc" },
      });
    },
  }),
);
