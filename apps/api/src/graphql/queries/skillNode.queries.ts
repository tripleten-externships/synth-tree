import { builder } from "@graphql/builder";

// get all users for admin
// At least one root level query is required.

// Pagination included use limit and offset. They make to prisma skip and take.

builder.queryFields((t) => ({
  skillNode: t.prismaField({
    type: "SkillNode",
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: (_query, _parent, { id }, context) => {
      context.auth.requireAuth();
      return context.prisma.skillNode.findUniqueOrThrow({
        where: { id },
      });
    },
  }),
  skillNodes: t.prismaField({
    type: ["SkillNode"],
    args: {
      limit: t.arg.int({
        required: false,
        defaultValue: 25, // default page size
      }),
      offset: t.arg.int({
        required: false,
        defaultValue: 0, // default start
      }),
    },
    resolve: async (query, _parent, args, context) => {
      context.auth.requireAuth();

      const rawLimit = args.limit ?? 25;
      const rawOffset = args.offset ?? 0;

      // Prevent insane page sizes
      const limit = Math.min(Math.max(rawLimit, 1), 100); // 1–100
      const offset = Math.max(rawOffset, 0);

      return context.prisma.skillNode.findMany({
        ...query,
        skip: offset,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      });
    },
  }),
  skillNodesByTree: t.prismaField({
    type: ["SkillNode"],
    args: {
      treeId: t.arg.id({ required: true }),
    },
    resolve: async (_query, _parent, { treeId }, context) => {
      return context.prisma.skillNode.findMany({
        where: { treeId },
        orderBy: [{ step: "asc" }, { orderInStep: "asc" }],
      });
    },
  }),
}));
