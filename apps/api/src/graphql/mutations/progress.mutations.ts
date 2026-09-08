import { GraphQLError } from "graphql";
import { builder } from "@graphql/builder";
import { completeNodeForUser } from "src/services/progress";

builder.mutationFields((t) => ({
  startNodeProgress: t.prismaField({
    type: "UserNodeProgress",
    args: {
      nodeId: t.arg.id({ required: true }),
    },

    resolve: async (query, _root, { nodeId }, ctx) => {
      const userId = ctx.auth.requireAuth();

      const nodeExists = await ctx.prisma.skillNode.findFirst({
        where: {
          id: nodeId,
          deletedAt: null,
        },
        select: { id: true },
      });

      if (!nodeExists) {
        throw new GraphQLError("Node not found");
      }

      const existingProgress =
        await ctx.prisma.userNodeProgress.findUnique({
          ...query,
          where: {
            userId_nodeId: {
              userId,
              nodeId,
            },
          },
        });

      if (existingProgress) {
        return existingProgress;
      }

      return ctx.prisma.userNodeProgress.create({
        ...query,
        data: {
          userId,
          nodeId,
          status: "IN_PROGRESS",
        },
      });
    },
  }),

  completeNodeProgress: t.prismaField({
    type: "UserNodeProgress",
    args: {
      nodeId: t.arg.id({ required: true }),
    },
    resolve: async (query, _root, { nodeId }, ctx) => {
      const userId = ctx.auth.requireAuth();

      // Shared completion policy: existence check + required-quiz gate +
      // idempotency + LESSON_COMPLETED daily-quest increment.
      await completeNodeForUser(ctx.prisma, userId, nodeId);

      return ctx.prisma.userNodeProgress.findUniqueOrThrow({
        ...query,
        where: {
          userId_nodeId: {
            userId,
            nodeId,
          },
        },
      });
    },
  }),
}));
