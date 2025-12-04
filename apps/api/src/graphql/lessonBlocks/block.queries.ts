import { builder } from "@graphql/builder";

builder.queryField("lessonBlock", (t) =>
  t.prismaField({
    type: "LessonBlocks",
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (_query, _parent, { id }, ctx) => {
      ctx.auth.requireAuth();

      return ctx.prisma.lessonBlocks.findUniqueOrThrow({
        where: { id },
      });
    },
  })
);

builder.queryField("lessonBlocksByNode", (t) =>
  t.prismaField({
    type: ["LessonBlocks"],
    args: {
      nodeId: t.arg.id({ required: true }),
    },
    resolve: async (_query, _parent, { nodeId }, ctx) => {
      ctx.auth.requireAuth();

      return ctx.prisma.lessonBlocks.findMany({
        where: { nodeId },
        orderBy: [{ order: "asc" }],
      });
    },
  })
);

builder.queryField("lessonBlocks", (t) =>
  t.prismaField({
    type: ["LessonBlocks"],
    args: {
      limit: t.arg.int(),
      offset: t.arg.int(),
    },
    resolve: async (_query, _parent, args, ctx) => {
      ctx.auth.requireAuth();

      return ctx.prisma.lessonBlocks.findMany({
        take: args.limit ?? 20,
        skip: args.offset ?? 0,
        orderBy: [{ createdAt: "desc" }],
      });
    },
  })
);
