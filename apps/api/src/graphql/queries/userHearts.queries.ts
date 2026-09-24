import { builder } from "@graphql/builder";
import { getOrRefillHearts } from "src/services/hearts/heartsService";

builder.queryFields((t) => ({
  myHearts: t.prismaField({
    type: "UserHearts",
    resolve: async (_query, _parent, _args, ctx) => {
      const userId = ctx.auth.requireAuth();

      return ctx.prisma.$transaction((tx) => getOrRefillHearts(tx, userId));
    },
  }),
}));
