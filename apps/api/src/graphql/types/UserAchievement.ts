import { builder } from "@graphql/builder";

builder.prismaObject("UserAchievement", {
  fields: (t) => ({
    userId: t.exposeID("userId"),
    earnedAt: t.expose("earnedAt", { type: "DateTime" }),

    achievement: t.relation("achievement"),
  }),
});
