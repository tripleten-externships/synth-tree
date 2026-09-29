// src/graphql/models.all.ts
import { builder } from "@graphql/builder";
import type { GraphQLContext } from "@graphql/context";

import { UserObject } from "@graphql/__generated__/User";
import { CourseObject } from "@graphql/__generated__/Course";
import { SkillTreeObject } from "@graphql/__generated__/SkillTree";
import { SkillNodeObject } from "@graphql/__generated__/SkillNode";
import { SkillNodePrerequisiteObject } from "@graphql/__generated__/SkillNodePrerequisite";
import { LessonBlocksObject } from "@graphql/__generated__/LessonBlocks";
import { QuizObject } from "@graphql/__generated__/Quiz";
import { QuizQuestionObject } from "@graphql/__generated__/QuizQuestion";
import { QuizOptionObject } from "@graphql/__generated__/QuizOption";
import { QuizAttemptObject } from "@graphql/__generated__/QuizAttempt";
import { QuizAttemptAnswerObject } from "@graphql/__generated__/QuizAttemptAnswer";
import { UserNodeProgressObject } from "@graphql/__generated__/UserNodeProgress";
import { UserXpObject } from "@graphql/__generated__/UserXp";
import { UserStreakObject } from "@graphql/__generated__/UserStreak";
import { UserHeartsObject } from "@graphql/__generated__/UserHearts";
import { XpEventObject } from "@graphql/__generated__/XpEvent";
import { UserDailyQuestObject } from "@graphql/__generated__/UserDailyQuest";
import {
  AchievementIdFieldObject,
  AchievementNameFieldObject,
  AchievementDescriptionFieldObject,
  AchievementIconFieldObject,
  AchievementColorFieldObject,
} from "@graphql/__generated__/Achievement";
import {
  UserAchievementEarnedAtFieldObject,
  UserAchievementAchievementFieldObject,
} from "@graphql/__generated__/UserAchievement";

// We are not using the auto crud from pothos. Utilize the prisma models. Inputs types and other types will still need to be manually created.
// Can break this file into multiple. Used one now for brevity.

// User.userAchievements is not exposed: User objects are reachable for other
// people (e.g. Course.author), and the raw rows lead back to their earners.
// Earned achievements are read via User.achievements (self/admin only) or the
// viewer-scoped myAchievements query.
const withoutUserAchievements = <T extends { userAchievements: unknown }>({
  userAchievements: _userAchievements,
  ...fields
}: T) => fields;

builder.prismaObject("User", {
  ...UserObject,
  fields: (t) => ({
    ...withoutUserAchievements(UserObject.fields(t)),

    achievements: t.prismaField({
      type: ["Achievement"],
      resolve: async (_query, parent, _args, ctx) => {
        if (parent.id !== ctx.auth.getUserId() && !ctx.auth.isAdmin()) return [];

        const rows = await ctx.prisma.userAchievement.findMany({
          where: { userId: parent.id },
          include: { achievement: true },
        });

        return rows.map((row) => row.achievement);
      },
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
builder.prismaObject("Quiz", QuizObject);
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
// Achievements use explicit field lists instead of the generated spreads:
// `trigger` is internal award logic, and the Achievement.userAchievements /
// UserAchievement.user back-relations would let any learner walk from their
// own achievements to every other earner's User (email included).
builder.prismaObject("Achievement", {
  fields: (t) => ({
    id: t.field(AchievementIdFieldObject),
    name: t.field(AchievementNameFieldObject),
    description: t.field(AchievementDescriptionFieldObject),
    icon: t.field(AchievementIconFieldObject),
    color: t.field(AchievementColorFieldObject),
  }),
});
builder.prismaObject("UserAchievement", {
  fields: (t) => ({
    earnedAt: t.field(UserAchievementEarnedAtFieldObject),
    achievement: t.relation("achievement", UserAchievementAchievementFieldObject),
  }),
});
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
