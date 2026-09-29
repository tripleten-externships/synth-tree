import type { Prisma } from "@prisma/client";
import { builder } from "@graphql/builder";
import type { GraphQLContext } from "@graphql/context";
import { visibleNodeWhere } from "@graphql/auth/visibility";
import { isUuid } from "@lib/uuid";

// get all users for admin
// At least one root level query is required.

// Pagination included use limit and offset. They make to prisma skip and take.

// Blocks a viewer may read: admins see all of them; anyone else only sees
// live blocks whose node is visible to them (see visibleNodeWhere). Block
// `status` is not checked: the admin editor saves blocks as DRAFT and never
// publishes them, so the course's status is what gates learner access.
function visibleBlocksFilter(ctx: GraphQLContext): Prisma.LessonBlocksWhereInput {
  if (ctx.auth.isAdmin()) return {};
  return { deletedAt: null, node: visibleNodeWhere(ctx) };
}

builder.queryFields((t) => ({
  lessonBlock: t.prismaField({
    type: "LessonBlocks",
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: (_query, _parent, { id }, context) => {
      context.auth.requireAuth();
      // A malformed id can't match any block; don't let Postgres reject it.
      if (!isUuid(id)) return null;

      return context.prisma.lessonBlocks.findFirst({
        where: { id, ...visibleBlocksFilter(context) },
      });
    },
  }),
  lessonBlocks: t.prismaField({
    type: ["LessonBlocks"],
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

      return context.prisma.lessonBlocks.findMany({
        ...query,
        where: visibleBlocksFilter(context),
        skip: offset,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      });
    },
  }),
  lessonBlocksByNode: t.prismaField({
    type: ["LessonBlocks"],
    args: {
      nodeId: t.arg.id({ required: true }),
    },
    resolve: async (_query, _parent, { nodeId }, context) => {
      context.auth.requireAuth();
      if (!isUuid(nodeId)) return [];
      return context.prisma.lessonBlocks.findMany({
        where: { nodeId, ...visibleBlocksFilter(context) },
        orderBy: [{ order: "asc" }],
      });
    },
  }),
}));
