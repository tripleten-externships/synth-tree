import { builder } from "@graphql/builder";

export const CreateLessonBlockInput = builder.inputType(
  "CreateLessonBlockInput",
  {
    fields: (t) => ({
      nodeId: t.id({ required: true }),
      type: t.string({ required: true }),
      url: t.string(),
      html: t.string(),
      caption: t.string(),
      order: t.int({ required: true }),
    }),
  }
);

export const UpdateLessonBlockInput = builder.inputType(
  "UpdateLessonBlockInput",
  {
    fields: (t) => ({
      type: t.string(),
      url: t.string(),
      html: t.string(),
      caption: t.string(),
      order: t.int(),
    }),
  }
);
