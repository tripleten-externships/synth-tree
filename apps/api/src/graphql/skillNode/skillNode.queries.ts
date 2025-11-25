import { builder } from "@graphql/builder";
import { prisma } from "@lib/prisma";

builder.queryField("skillNode", (t) =>
  t.prismaField({
    type: "SkillNode",
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (_query, _parent, { id }) => {
      return prisma.skillNode.findUniqueOrThrow({
        where: { id },
      });
    },
  })
);

builder.queryField("skillNodes", (t) =>
  t.prismaField({
    type: ["SkillNode"],
    args: {
      limit: t.arg.int(),
      offset: t.arg.int(),
    },
    resolve: async (_query, _parent, args) => {
      return prisma.skillNode.findMany({
        take: args.limit ?? 50,
        skip: args.offset ?? 0,
        orderBy: { step: "asc" },
      });
    },
  })
);

builder.queryField("skillNodesByTree", (t) =>
  t.prismaField({
    type: ["SkillNode"],
    args: {
      treeId: t.arg.id({ required: true }),
    },
    resolve: async (_query, _parent, { treeId }) => {
      return prisma.skillNode.findMany({
        where: { treeId },
        orderBy: [{ step: "asc" }, { orderInStep: "asc" }],
      });
    },
  })
);
