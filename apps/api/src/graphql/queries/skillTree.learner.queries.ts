import { builder } from "@graphql/builder";

builder.queryFields((t) => ({
  courseForLearner: t.prismaField({
    type: "Course",
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, _parent, args, ctx) => {
      const userId = ctx.auth.requireAuth();

      return ctx.prisma.course.findUnique({
        where: { id: args.id },
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
