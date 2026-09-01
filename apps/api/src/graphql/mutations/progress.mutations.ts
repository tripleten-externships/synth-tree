import { GraphQLError } from "graphql";
import { builder } from "@graphql/builder";
import { incrementDailyQuestProgress } from "src/services/dailyQuests";

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

      const progress = await ctx.prisma.userNodeProgress.upsert({
        ...query,
        where: {
          userId_nodeId: {
            userId,
            nodeId,
          },
        },
        update: {
          status: "COMPLETED",
          completedAt: new Date(),
        },
        create: {
          userId,
          nodeId,
          status: "COMPLETED",
          completedAt: new Date(),
        },
      });

      await incrementDailyQuestProgress(ctx.prisma, userId, "LESSON_COMPLETED");

      return progress;
    },
  }),
}));
