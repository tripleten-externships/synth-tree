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

// We are not using the auto crud from pothos. Utilize the prisma models. Inputs types and other types will still need to be manually created.
// Can break this file into multiple. Used one now for brevity.

builder.prismaObject("User", UserObject);
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


export type CourseProgressShape = {
 courseId: string;
 totalNodes: number;
 inProgressNodes: number;
 completedNodes: number;
 notStartedNodes: number;
 completionPercentage: number;
};


export const CourseProgress = builder
 .objectRef<CourseProgressShape>("CourseProgress")
 .implement({
   fields: (t) => ({
     courseId: t.exposeID("courseId"),
     totalNodes: t.exposeInt("totalNodes"),
     inProgressNodes: t.exposeInt("inProgressNodes"),
     completedNodes: t.exposeInt("completedNodes"),
     notStartedNodes: t.exposeInt("notStartedNodes"),
     completionPercentage: t.exposeInt("completionPercentage"),
   }),
 });