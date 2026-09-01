import { builder } from "@graphql/builder";
import { ensureDailyQuests } from "src/services/dailyQuests";

builder.queryFields((t) => ({
  myDailyQuests: t.prismaField({
    type: ["UserDailyQuest"],
    resolve: async (query, _root, _args, ctx) => {
      const userId = ctx.auth.requireAuth();

      await ensureDailyQuests(ctx.prisma, userId);

      return ctx.prisma.userDailyQuest.findMany({
        ...query,
        where: { userId },
        orderBy: { questKey: "asc" },
      });
    },
  }),
}));
