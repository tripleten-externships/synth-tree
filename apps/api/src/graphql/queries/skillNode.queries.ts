import type { Prisma } from "@prisma/client";
import { builder } from "@graphql/builder";
import type { GraphQLContext } from "@graphql/context";
import { isUuid } from "@lib/uuid";

// get all users for admin
// At least one root level query is required.

// Pagination included use limit and offset. They make to prisma skip and take.

// Nodes a viewer may read through these queries. Admins see every node. Anyone
// else only sees live (not deleted) nodes in live trees of live courses that
// are PUBLISHED, or that they authored, so draft and deleted course content
// (lessons, quizzes) isn't reachable by id.
function visibleNodesFilter(ctx: GraphQLContext): Prisma.SkillNodeWhereInput {
  if (ctx.auth.isAdmin()) return {};

  const userId = ctx.auth.getUserId();
  return {
    deletedAt: null,
    tree: {
      deletedAt: null,
      course: {
        deletedAt: null,
        OR: [{ status: "PUBLISHED" }, ...(userId ? [{ authorId: userId }] : [])],
      },
    },
  };
}

builder.queryFields((t) => ({
  skillNode: t.prismaField({
    type: "SkillNode",
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: (query, _parent, { id }, context) => {
      context.auth.requireAuth();
      // A malformed id can't match any node; don't let Postgres reject it.
      if (!isUuid(id)) return null;

      return context.prisma.skillNode.findFirst({
        ...query,
        where: { id, ...visibleNodesFilter(context) },
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
        where: visibleNodesFilter(context),
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
    resolve: async (query, _parent, { treeId }, context) => {
      if (!isUuid(treeId)) return [];

      return context.prisma.skillNode.findMany({
        ...query,
        where: { treeId, ...visibleNodesFilter(context) },
        orderBy: [{ step: "asc" }, { orderInStep: "asc" }],
      });
    },
  }),
}));
