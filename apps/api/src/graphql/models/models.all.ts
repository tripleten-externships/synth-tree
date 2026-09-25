// src/graphql/models.all.ts
import type { Prisma } from "@prisma/client";
import { builder } from "@graphql/builder";
import type { GraphQLContext } from "@graphql/context";

import { UserObject, UserQuizAttemptsFieldObject } from "@graphql/__generated__/User";
import { CourseObject } from "@graphql/__generated__/Course";
import { SkillTreeObject } from "@graphql/__generated__/SkillTree";
import { SkillNodeObject } from "@graphql/__generated__/SkillNode";
import { SkillNodePrerequisiteObject } from "@graphql/__generated__/SkillNodePrerequisite";
import { LessonBlocksObject } from "@graphql/__generated__/LessonBlocks";
import {
  QuizObject,
  QuizAttemptsFieldObject,
  QuizQuestionsFieldObject,
} from "@graphql/__generated__/Quiz";
import { QuizQuestionsFieldArgs } from "@graphql/__generated__/Quiz/object.base";
import {
  QuizQuestionObject,
  QuizQuestionAnswersFieldObject,
  QuizQuestionOptionsFieldObject,
} from "@graphql/__generated__/QuizQuestion";
import { QuizQuestionOptionsFieldArgs } from "@graphql/__generated__/QuizQuestion/object.base";
import { QuizOptionObject } from "@graphql/__generated__/QuizOption";
import { QuizAttemptObject } from "@graphql/__generated__/QuizAttempt";
import { QuizAttemptAnswerObject } from "@graphql/__generated__/QuizAttemptAnswer";
import { UserNodeProgressObject } from "@graphql/__generated__/UserNodeProgress";
import { UserXpObject } from "@graphql/__generated__/UserXp";
import { UserStreakObject } from "@graphql/__generated__/UserStreak";
import { UserHeartsObject } from "@graphql/__generated__/UserHearts";
import { XpEventObject } from "@graphql/__generated__/XpEvent";
import { UserDailyQuestObject } from "@graphql/__generated__/UserDailyQuest";

// We are not using the auto crud from pothos. Utilize the prisma models. Inputs types and other types will still need to be manually created.
// Can break this file into multiple. Used one now for brevity.

// Quiz attempts, and the answers in them, belong to the learner who took them.
// Admins see every attempt, a learner only their own, and a signed-out viewer
// none (publicCourse needs no sign-in). Used by every relation that lists
// attempts or answers, so another learner's answers can't be read (SYN-125).
function viewerAttemptsFilter(ctx: GraphQLContext): Prisma.QuizAttemptWhereInput {
  if (ctx.auth.isAdmin()) return {};

  const userId = ctx.auth.getUserId();
  return { userId: { in: userId ? [userId] : [] } };
}

// Answer-key guard: `distinct` is not offered on quiz questions or options.
// options(distinct: [isCorrect]) returns one option per value, so the correct
// option is always in the result, and @Pothos.omit can't reach distinct.
const { distinct: _questionsDistinct, ...quizQuestionsArgs } = QuizQuestionsFieldArgs;
const { distinct: _optionsDistinct, ...questionOptionsArgs } = QuizQuestionOptionsFieldArgs;

builder.prismaObject("User", {
  ...UserObject,
  fields: (t) => ({
    ...UserObject.fields(t),

    // Another user's attempts come back empty unless the viewer is an admin.
    quizAttempts: t.relation("quizAttempts", {
      ...UserQuizAttemptsFieldObject(t),
      query: (args, ctx) => ({
        where: { AND: [args.where || {}, viewerAttemptsFilter(ctx)] },
        cursor: args.cursor || undefined,
        take: args.take || undefined,
        distinct: args.distinct || undefined,
        skip: args.skip || undefined,
        orderBy: args.orderBy || undefined,
      }),
    }),

    recommendedNext: t.prismaField({
      type: ["SkillNode"],
      args: {
        limit: t.arg.int({
          required: false,
          defaultValue: 6,
        }),
      },
      resolve: async (query, parent, args, context) => {
        const rawLimit = args.limit ?? 6;
        const limit = Math.min(Math.max(rawLimit, 1), 6);

        const completedProgress = await context.prisma.userNodeProgress.findMany({
          where: {
            userId: parent.id,
            status: "COMPLETED",
          },
          select: {
            nodeId: true,
          },
        });

        const completedNodeIds = completedProgress.map((progress) => progress.nodeId);

        return context.prisma.skillNode.findMany({
          ...query,
          where: {
            progresses: {
              none: {
                userId: parent.id,
                status: {
                  in: ["COMPLETED", "IN_PROGRESS"],
                },
              },
            },
            prerequisites: {
              every: {
                dependsOnNodeId: {
                  in: completedNodeIds,
                },
              },
            },
          },
          take: limit,
          orderBy: {
            step: "asc",
          },
        });
      },
    }),
  }),
});
builder.prismaObject("Course", CourseObject);
builder.prismaObject("SkillTree", SkillTreeObject);
builder.prismaObject("SkillNode", {
  ...SkillNodeObject,
  fields: (t) => ({
    ...SkillNodeObject.fields(t),

    // The authenticated viewer's progress row for this node, or null if they
    // have no progress record yet. Lets the learner tree query surface per-node
    // status (NOT_STARTED / IN_PROGRESS / COMPLETED) without a second round-trip.
    progressForViewer: t.prismaField({
      type: "UserNodeProgress",
      nullable: true,
      resolve: async (query, parent, _args, ctx) => {
        const userId = ctx.auth.requireAuth();

        return ctx.prisma.userNodeProgress.findUnique({
          ...query,
          where: {
            userId_nodeId: {
              userId,
              nodeId: parent.id,
            },
          },
        });
      },
    }),
  }),
});
builder.prismaObject("SkillNodePrerequisite", SkillNodePrerequisiteObject);
builder.prismaObject("LessonBlocks", LessonBlocksObject);
builder.prismaObject("Quiz", {
  ...QuizObject,
  fields: (t) => ({
    ...QuizObject.fields(t),

    questions: t.relation("questions", {
      ...QuizQuestionsFieldObject(t),
      args: quizQuestionsArgs,
    }),

    // Only the viewer's own attempts, unless they're an admin.
    attempts: t.relation("attempts", {
      ...QuizAttemptsFieldObject(t),
      query: (args, ctx) => ({
        where: { AND: [args.where || {}, viewerAttemptsFilter(ctx)] },
        cursor: args.cursor || undefined,
        take: args.take || undefined,
        distinct: args.distinct || undefined,
        skip: args.skip || undefined,
        orderBy: args.orderBy || undefined,
      }),
    }),
  }),
});
// Answer keys (FILL canonicalAnswer, explanations) are only visible to admins
// or to a learner who has already submitted an attempt for the quiz.
async function canSeeQuizAnswers(quizId: string, ctx: GraphQLContext): Promise<boolean> {
  if (ctx.auth.isAdmin()) return true;

  const userId = ctx.auth.getUserId();
  if (!userId) return false;

  const attempt = await ctx.prisma.quizAttempt.findFirst({
    where: { quizId, userId },
    select: { id: true },
  });
  return attempt !== null;
}

builder.prismaObject("QuizQuestion", {
  ...QuizQuestionObject,
  fields: (t) => ({
    ...QuizQuestionObject.fields(t),

    // Answer-key guard for FILL questions. canonicalAnswer is only revealed to
    // admins, or to a learner who has already submitted an attempt for this
    // question's quiz. Otherwise it resolves to null, so a hand-crafted query
    // can't read the expected answer before submitting. The results screen
    // reads it post-submit (allowed).
    canonicalAnswer: t.string({
      nullable: true,
      resolve: async (parent, _args, ctx) =>
        (await canSeeQuizAnswers(parent.quizId, ctx)) ? parent.canonicalAnswer : null,
    }),

    // Same guard for explanations: they usually give the answer away.
    explanation: t.string({
      nullable: true,
      resolve: async (parent, _args, ctx) =>
        (await canSeeQuizAnswers(parent.quizId, ctx)) ? parent.explanation : null,
    }),

    options: t.relation("options", {
      ...QuizQuestionOptionsFieldObject(t),
      args: questionOptionsArgs,
    }),

    // Only answers from the viewer's own attempts, unless they're an admin.
    answers: t.relation("answers", {
      ...QuizQuestionAnswersFieldObject(t),
      query: (args, ctx) => ({
        where: { AND: [args.where || {}, { attempt: viewerAttemptsFilter(ctx) }] },
        cursor: args.cursor || undefined,
        take: args.take || undefined,
        distinct: args.distinct || undefined,
        skip: args.skip || undefined,
        orderBy: args.orderBy || undefined,
      }),
    }),
  }),
});
builder.prismaObject("QuizOption", {
  ...QuizOptionObject,
  fields: (t) => ({
    ...QuizOptionObject.fields(t),

    // Answer-key guard. isCorrect is only revealed to admins, or to a learner
    // who has already submitted an attempt for this option's quiz. Otherwise it
    // resolves to null, so a hand-crafted query can't read correct answers
    // before submitting. The results screen reads it post-submit (allowed).
    isCorrect: t.boolean({
      nullable: true,
      resolve: async (parent, _args, ctx) => {
        if (ctx.auth.isAdmin()) return parent.isCorrect;

        const userId = ctx.auth.getUserId();
        if (!userId) return null;

        const question = await ctx.prisma.quizQuestion.findUnique({
          where: { id: parent.questionId },
          select: { quizId: true },
        });
        if (!question) return null;

        const attempt = await ctx.prisma.quizAttempt.findFirst({
          where: { quizId: question.quizId, userId },
          select: { id: true },
        });

        return attempt ? parent.isCorrect : null;
      },
    }),
  }),
});
builder.prismaObject("QuizAttempt", QuizAttemptObject);
builder.prismaObject("QuizAttemptAnswer", QuizAttemptAnswerObject);
builder.prismaObject("UserNodeProgress", UserNodeProgressObject);
// XP / streak models (added in #75). The User object exposes relations to these,
// so the schema build requires them to be implemented here.
builder.prismaObject("UserXp", UserXpObject);
builder.prismaObject("UserStreak", UserStreakObject);
builder.prismaObject("UserHearts", UserHeartsObject);
builder.prismaObject("XpEvent", XpEventObject);
builder.prismaObject("UserDailyQuest", UserDailyQuestObject);
export type CourseProgressShape = {
  courseId: string;
  totalNodes: number;
  inProgressNodes: number;
  completedNodes: number;
  notStartedNodes: number;
  completionPercentage: number;
};

export const CourseProgress = builder.objectRef<CourseProgressShape>("CourseProgress").implement({
  fields: (t) => ({
    courseId: t.exposeID("courseId"),
    totalNodes: t.exposeInt("totalNodes"),
    inProgressNodes: t.exposeInt("inProgressNodes"),
    completedNodes: t.exposeInt("completedNodes"),
    notStartedNodes: t.exposeInt("notStartedNodes"),
    completionPercentage: t.exposeInt("completionPercentage"),
  }),
});
