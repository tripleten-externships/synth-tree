import { builder } from "@graphql/builder";

builder.queryField("leaderboard", (t) =>
  t.field({
    type: ["LeaderboardEntry"], // whatever your model is named
    args: {
      limit: t.arg.int({ defaultValue: 100 }),
    },
    resolve: async (_root, { limit }, ctx) => {
      return ctx.db.leaderboard.getTop(limit); // or your real data source
    },
  }),
);
