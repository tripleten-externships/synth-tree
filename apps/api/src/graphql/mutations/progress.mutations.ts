import { GraphQLError } from "graphql";
import { builder } from "@graphql/builder";
import { awardXp } from "../../services/xp";
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

      // Look up existence + XP reward up front so we can award XP alongside
      // the shared completion policy.
      const nodeExists = await ctx.prisma.skillNode.findFirst({
        where: {
          id: nodeId,
          deletedAt: null,
        },
        select: {
          id: true,
          xpReward: true,
        },
      });

      if (!nodeExists) {
        throw new GraphQLError("Node not found");
      }

      const existingProgress = await ctx.prisma.userNodeProgress.findUnique({
        where: {
          userId_nodeId: {
            userId,
            nodeId,
          },
        },
        select: { status: true },
      });

      // Early return on already-completed: no duplicate work or XP.
      if (existingProgress?.status === "COMPLETED") {
        return ctx.prisma.userNodeProgress.findUniqueOrThrow({
          ...query,
          where: {
            userId_nodeId: {
              userId,
              nodeId,
            },
          },
        });
      }

      // Atomic: shared completion policy (existence check + required-quiz gate +
      // idempotency + LESSON_COMPLETED daily-quest increment) AND the XP award
      // commit together, so a failing award can't leave a COMPLETED node with
      // no XP.
      await ctx.prisma.$transaction(async (tx) => {
        await completeNodeForUser(tx, userId, nodeId);

        await awardXp(
          ctx.prisma,
          userId,
          nodeExists.xpReward ?? 50,
          "node_completion",
          { nodeId },
          tx,
        );
      });

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
