import { builder } from "@graphql/builder";
import { QuestionType } from "../__generated__/inputs";

export const QuizAnswerInput = builder.inputType("QuizAnswerInput", {
  fields: (t) => ({
    questionId: t.id({ required: true }),
    selectedOptionIds: t.idList(),
    text: t.string(),
  }),
});

/**
 * Inputs for saveQuiz (SYN-72), the one call the admin lesson editor makes when
 * an author saves. Ids are optional: a row without one is new, and a row that
 * carries one is updated in place. Anything the author removed is simply left
 * out of the input.
 */

export const SaveQuizOptionInput = builder.inputType("SaveQuizOptionInput", {
  fields: (t) => ({
    id: t.id(),
    text: t.string({ required: true }),
    isCorrect: t.boolean({ required: true }),
  }),
});

export const SaveQuizQuestionInput = builder.inputType("SaveQuizQuestionInput", {
  fields: (t) => ({
    id: t.id(),
    type: t.field({ type: QuestionType, required: true }),
    prompt: t.string({ required: true }),
    explanation: t.string(),
    // FILL only; the answer key for the other types lives on the options.
    canonicalAnswer: t.string(),
    options: t.field({ type: [SaveQuizOptionInput], required: true }),
  }),
});

export const SaveQuizInput = builder.inputType("SaveQuizInput", {
  fields: (t) => ({
    required: t.boolean({ required: true }),
    questions: t.field({ type: [SaveQuizQuestionInput], required: true }),
  }),
});
