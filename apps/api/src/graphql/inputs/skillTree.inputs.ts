import { builder } from "@graphql/builder";

export const CreateSkillTreeInput = builder.inputType("CreateSkillTreeInput", {
  fields: (t) => ({
    courseId: t.id({ required: true }),
    title: t.string({ required: true }),
    description: t.string(),
  }),
});

export const UpdateSkillTreeInput = builder.inputType("UpdateSkillTreeInput", {
  fields: (t) => ({
    title: t.string(),
    description: t.string(),
  }),
});
