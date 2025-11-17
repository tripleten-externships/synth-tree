import { title } from "process";
import { builder } from "@graphql/builder";

export const CreateLessonInput = builder.inputType("CreateLessonInput", {
  fields: (t) => ({
    title: t.string({ required: true }),
    content: t.string({ required: true }),
  }),
});

export const UpdateLessonInput = builder.inputType('UpdateLessonInput', {
    fields: (t) => ({
        title: t.string (),
        content: t.string(),
    }),
});
  
