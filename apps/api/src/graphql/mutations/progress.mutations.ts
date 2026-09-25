import { GraphQLError } from "graphql";
import { builder } from "@graphql/builder";
import { awardXp } from "../../services/xp";
import { completeNodeForUser } from "src/services/progress";
import type { UserNodeProgress } from "@prisma/client";
// Ref handle for the UserNodeProgress prisma object (see models.all.ts). Needed
// because a plain objectRef field can't reference a Prisma model by string name.
import { UserNodeProgressRef } from "@graphql/models/models.all";

// SYN-61: the lesson-finish screen needs the amount of XP just awarded, but the
// bare UserNodeProgress row has no such field (the award happens as a side
// effect). This payload wraps the progress row alongside xpAwarded so the
// mutation can surface exactly what was granted on this call — including 0 when
// nothing was awarded (see the already-completed early return below).
// progress stays nested (rather than flattened) so Apollo normalizes it as a
// UserNodeProgress and auto-updates cached copies, e.g. from the myProgress query.
const CompleteNodeProgressPayloadRef = builder
  .objectRef<{ progress: UserNodeProgress; xpAwarded: number }>("CompleteNodeProgressPayload")
  .implement({
    fields: (t) => ({
      progress: t.field({
        type: UserNodeProgressRef,
        resolve: (parent) => parent.progress,
      }),
      xpAwarded: t.exposeInt("xpAwarded"),
    }),
  });

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

      const existingProgress = await ctx.prisma.userNodeProgress.findUnique({
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

  // Returns the CompleteNodeProgressPayload (progress + xpAwarded) instead of a
  // bare UserNodeProgress. Because the return type is a custom objectRef rather
  // than a Prisma model, this is a plain t.field, not a t.prismaField — so the
  // resolver signature has no leading `query` arg and we fetch the row directly.
  completeNodeProgress: t.field({
    type: CompleteNodeProgressPayloadRef,
    args: {
      nodeId: t.arg.id({ required: true }),
    },
    resolve: async (_root, { nodeId }, ctx) => {
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

      // Early return on already-completed: no duplicate work or XP. xpAwarded is
      // 0 because this call granted nothing — the finish screen must not show a
      // phantom "+XP" for a node the learner already finished.
      if (existingProgress?.status === "COMPLETED") {
        const progress = await ctx.prisma.userNodeProgress.findUniqueOrThrow({
          where: { userId_nodeId: { userId, nodeId } },
        });
        return { progress, xpAwarded: 0 };
      }

      // Atomic: shared completion policy (existence check + required-quiz gate +
      // idempotency + LESSON_COMPLETED daily-quest increment) AND the XP award
      // commit together, so a failing award can't leave a COMPLETED node with
      // no XP.

      // Capture the amount once so we pass the same value to awardXp and return
      // it in the payload — the number the finish screen shows is exactly what
      // was granted. Falls back to 50 when the node has no explicit xpReward.
      const xpAwarded = nodeExists.xpReward ?? 50;

      await ctx.prisma.$transaction(async (tx) => {
        await completeNodeForUser(tx, userId, nodeId);
        await awardXp(ctx.prisma, userId, xpAwarded, "node_completion", { nodeId }, tx);
      });

      const progress = await ctx.prisma.userNodeProgress.findUniqueOrThrow({
        where: {
          userId_nodeId: {
            userId,
            nodeId,
          },
        },
      });
      return { progress, xpAwarded };
    },
  }),
}));
