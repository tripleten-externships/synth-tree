import { builder } from "@graphql/builder";

export const QuizAnswerInput = builder.inputType("QuizAnswerInput", {
  fields: (t) => ({
    questionId: t.id({ required: true }),
    selectedOptionIds: t.idList(),
    text: t.string(),
  }),
});
