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

      const existing = await ctx.prisma.userNodeProgress.findUnique({
        where: {
          userId_nodeId: {
            userId,
            nodeId,
          },
        },
        select: { status: true },
      });
      const alreadyCompleted = existing?.status === "COMPLETED";

      // Gate completion on a passed required quiz. A node can have at most one
      // quiz (nodeId is unique); if that quiz is `required`, the learner must
      // have a passing attempt before the node can be marked complete. Only
      // enforced on the transition into COMPLETED so repeat calls stay
      // idempotent.
      if (!alreadyCompleted) {
        const requiredQuiz = await ctx.prisma.quiz.findFirst({
          where: {
            nodeId,
            required: true,
            deletedAt: null,
          },
          select: { id: true },
        });

        if (requiredQuiz) {
          const passedAttempt = await ctx.prisma.quizAttempt.findFirst({
            where: {
              quizId: requiredQuiz.id,
              userId,
              passed: true,
            },
            select: { id: true },
          });

          if (!passedAttempt) {
            throw new GraphQLError(
              "Cannot complete node: its required quiz has not been passed",
            );
          }
        }
      }

      const progress = await ctx.prisma.userNodeProgress.upsert({
        ...query,
        where: {
          userId_nodeId: {
            userId,
            nodeId,
          },
        },
        // Preserve the original completedAt when the node is already complete
        // so repeat calls stay idempotent.
        update: alreadyCompleted
          ? {}
          : {
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

      // Only count the lesson toward daily quests on the first completion,
      // otherwise repeated calls on the same node would inflate progress.
      if (!alreadyCompleted) {
        await incrementDailyQuestProgress(ctx.prisma, userId, "LESSON_COMPLETED");
      }

      return progress;
    },
  }),

  completeNode: t.prismaField({
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

      return ctx.prisma.userNodeProgress.upsert({
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
          userId: userId,
          nodeId: nodeId,
          status: "COMPLETED",
          completedAt: new Date(),
        },
      });
    },
  }),
}));
