import * as Inputs from '../inputs';
import { builder } from '../../builder';
import {
  definePrismaObject,
  defineFieldObject,
  defineRelationFunction,
  defineRelationObject,
} from '../utils';

export const QuizAttemptAnswerObject = definePrismaObject('QuizAttemptAnswer', {
  description: undefined,
  findUnique: ({ id }) => ({ id }),
  fields: (t) => ({
    id: t.field(QuizAttemptAnswerIdFieldObject),
    attemptId: t.field(QuizAttemptAnswerAttemptIdFieldObject),
    questionId: t.field(QuizAttemptAnswerQuestionIdFieldObject),
    answer: t.field(QuizAttemptAnswerAnswerFieldObject),
    isCorrect: t.field(QuizAttemptAnswerIsCorrectFieldObject),
    attempt: t.relation('attempt', QuizAttemptAnswerAttemptFieldObject),
    question: t.relation('question', QuizAttemptAnswerQuestionFieldObject),
  }),
});

export const QuizAttemptAnswerIdFieldObject = defineFieldObject('QuizAttemptAnswer', {
  type: "ID",
  description: undefined,
  nullable: false,
  resolve: (parent) => String(parent.id),
});

export const QuizAttemptAnswerAttemptIdFieldObject = defineFieldObject('QuizAttemptAnswer', {
  type: "String",
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.attemptId,
});

export const QuizAttemptAnswerQuestionIdFieldObject = defineFieldObject('QuizAttemptAnswer', {
  type: "String",
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.questionId,
});

export const QuizAttemptAnswerAnswerFieldObject = defineFieldObject('QuizAttemptAnswer', {
  type: Inputs.Json,
  description: undefined,
  nullable: true,
  resolve: (parent) => parent.answer,
});

export const QuizAttemptAnswerIsCorrectFieldObject = defineFieldObject('QuizAttemptAnswer', {
  type: "Boolean",
  description: undefined,
  nullable: true,
  resolve: (parent) => parent.isCorrect,
});

export const QuizAttemptAnswerAttemptFieldObject = defineRelationObject('QuizAttemptAnswer', 'attempt', {
  description: undefined,
  nullable: false,
  args: undefined,
  query: undefined,
});

export const QuizAttemptAnswerQuestionFieldObject = defineRelationObject('QuizAttemptAnswer', 'question', {
  description: undefined,
  nullable: false,
  args: undefined,
  query: undefined,
});
