import { builder } from "@graphql/builder";
import { ensureDailyQuests, startOfToday } from "src/services/dailyQuests";

builder.queryFields((t) => ({
  myDailyQuests: t.prismaField({
    type: ["UserDailyQuest"],
    resolve: async (query, _root, _args, ctx) => {
      const userId = ctx.auth.requireAuth();
      const date = startOfToday();

      await ensureDailyQuests(ctx.prisma, userId, date);

      return ctx.prisma.userDailyQuest.findMany({
        ...query,
        where: { userId, date },
        orderBy: { questKey: "asc" },
      });
    },
  }),
}));
