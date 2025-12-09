import { builder } from "@graphql/builder";
import { CourseStatus } from "@graphql/__generated__/inputs";

export const CreateCourseInput = builder.inputType("CreateCourseInput", {
  fields: (t) => ({
    title: t.string({ required: true }),
    description: t.string(), // optional
    // Optional override for the auto-created default SkillTree
    defaultTreeTitle: t.string(),
  }),
});

export const UpdateCourseInput = builder.inputType("UpdateCourseInput", {
  fields: (t) => ({
    title: t.string(),
    description: t.string(),
    status: t.field({ type: CourseStatus }), // optional
  }),
});
