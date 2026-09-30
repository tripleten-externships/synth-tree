import type { Prisma } from "@prisma/client";
import type { GraphQLContext } from "@graphql/context";

// Skill nodes a viewer may read through the generic content queries (nodes,
// lesson blocks, quizzes). Admins see every node. Anyone else only sees live
// (not deleted) nodes in live trees of live courses that are PUBLISHED, or that
// they authored, so draft and deleted course content isn't reachable by id.
export function visibleNodeWhere(ctx: GraphQLContext): Prisma.SkillNodeWhereInput {
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
