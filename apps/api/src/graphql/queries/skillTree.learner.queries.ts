import { builder } from "@graphql/builder";
import { isUuid } from "@lib/uuid";

builder.queryFields((t) => ({
  courseForLearner: t.prismaField({
    type: "Course",
    // findFirst returns null when the course is missing, soft-deleted, or not
    // yet published, so the field must be nullable (cf. adminCourse).
    nullable: true,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (_query, _parent, args, ctx) => {
      ctx.auth.requireAuth();

      // A malformed id can't match any course; don't let Postgres reject it.
      if (!isUuid(args.id)) return null;

      // Manual include (rather than spreading `query`) so we can filter out
      // soft-deleted trees and nodes; per-node viewer status is resolved by the
      // SkillNode.progressForViewer field.
      return ctx.prisma.course.findFirst({
        where: {
          id: args.id,
          status: "PUBLISHED",
          deletedAt: null,
        },
        include: {
          trees: {
            where: { deletedAt: null },
            include: {
              nodes: {
                where: { deletedAt: null },
                include: {
                  prerequisites: true,
                },
              },
            },
          },
        },
      });
    },
  }),
}));
