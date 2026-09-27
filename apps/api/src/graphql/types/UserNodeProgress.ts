import { builder } from "@graphql/builder";

builder.prismaObject("UserNodeProgress", {
  fields: (t) => ({
    userId: t.exposeID("userId"),
    nodeId: t.exposeID("nodeId"),
    status: t.exposeString("status"),
    completedAt: t.expose("completedAt", { type: "DateTime", nullable: true }),

    // This is the new field for SYN‑42
    awardedAchievements: t.field({
      type: ["Achievement"] as any,
      nullable: false,
      resolve: (parent: any) => parent.awardedAchievements ?? [],
    }),
  }),
});
