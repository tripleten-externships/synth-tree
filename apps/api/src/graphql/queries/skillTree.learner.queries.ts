import { builder } from "@graphql/builder";

builder.queryFields((t) => ({
  courseForLearner: t.prismaField({
    type: "Course",
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, _parent, args, ctx) => {
      const userId = ctx.auth.requireAuth();

      return ctx.prisma.course.findFirst({
        where: {
          id: args.id,
          status: "PUBLISHED",
          deletedAt: null,
         },
        include: {
          trees: {
            where: { deletedAt: null},
            include: {
              nodes: {
                where: { deletedAt: null},
                include: {
                  prerequisites: true,
                }
              }
            }
          }
        }
      })
    },
  }),
}));
