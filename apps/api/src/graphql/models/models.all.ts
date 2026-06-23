// src/graphql/models.all.ts
import { builder } from "@graphql/builder";

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
import { XpEventObject } from "@graphql/__generated__/XpEvent";

// We are not using the auto crud from pothos. Utilize the prisma models. Inputs types and other types will still need to be manually created.
// Can break this file into multiple. Used one now for brevity.

builder.prismaObject("User", {
  ...UserObject,
  fields: (t) => ({
    ...UserObject.fields(t),

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
builder.prismaObject("SkillNode", SkillNodeObject);
builder.prismaObject("SkillNodePrerequisite", SkillNodePrerequisiteObject);
builder.prismaObject("LessonBlocks", LessonBlocksObject);
builder.prismaObject("Quiz", QuizObject);
builder.prismaObject("QuizQuestion", QuizQuestionObject);
builder.prismaObject("QuizOption", QuizOptionObject);
builder.prismaObject("QuizAttempt", QuizAttemptObject);
builder.prismaObject("QuizAttemptAnswer", QuizAttemptAnswerObject);
builder.prismaObject("UserNodeProgress", UserNodeProgressObject);
// XP / streak models (added in #75). The User object exposes relations to these,
// so the schema build requires them to be implemented here.
builder.prismaObject("UserXp", UserXpObject);
builder.prismaObject("UserStreak", UserStreakObject);
builder.prismaObject("XpEvent", XpEventObject);

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
