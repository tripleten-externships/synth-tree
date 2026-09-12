import type { Prisma } from "@prisma/client";
import { GraphQLError } from "graphql";
import { incrementDailyQuestProgress } from "src/services/dailyQuests";

/**
 * Mark a node COMPLETED for a user, enforcing one consistent completion policy
 * everywhere a node can be completed (the `completeNodeProgress` mutation and
 * passing a quiz):
 *
 *  - the node must exist and not be soft-deleted;
 *  - if the node has a `required` quiz, the user must have a passing attempt
 *    before it can be completed;
 *  - completion is idempotent — `completedAt` is preserved on repeat calls;
 *  - the LESSON_COMPLETED daily quest is incremented only on the first
 *    completion, so repeat calls can't inflate quest progress.
 */
export async function completeNodeForUser(
  prisma: Prisma.TransactionClient,
  userId: string,
  nodeId: string,
) {
  const nodeExists = await prisma.skillNode.findFirst({
    where: { id: nodeId, deletedAt: null },
    select: { id: true },
  });
  if (!nodeExists) {
    throw new GraphQLError("Node not found");
  }

  const existing = await prisma.userNodeProgress.findUnique({
    where: { userId_nodeId: { userId, nodeId } },
    select: { status: true },
  });
  const alreadyCompleted = existing?.status === "COMPLETED";

  if (!alreadyCompleted) {
    const requiredQuiz = await prisma.quiz.findFirst({
      where: { nodeId, required: true, deletedAt: null },
      select: { id: true },
    });

    if (requiredQuiz) {
      const passedAttempt = await prisma.quizAttempt.findFirst({
        where: { quizId: requiredQuiz.id, userId, passed: true },
        select: { id: true },
      });

      if (!passedAttempt) {
        throw new GraphQLError(
          "Cannot complete node: its required quiz has not been passed",
        );
      }
    }
  }

  await prisma.userNodeProgress.upsert({
    where: { userId_nodeId: { userId, nodeId } },
    update: alreadyCompleted
      ? {}
      : { status: "COMPLETED", completedAt: new Date() },
    create: { userId, nodeId, status: "COMPLETED", completedAt: new Date() },
  });

  if (!alreadyCompleted) {
    await incrementDailyQuestProgress(prisma, userId, "LESSON_COMPLETED");
  }
}
