import * as Inputs from '../inputs';
import { builder } from '../../builder';
import {
  definePrismaObject,
  defineFieldObject,
  defineRelationFunction,
  defineRelationObject,
} from '../utils';

export const QuizOptionObject = definePrismaObject('QuizOption', {
  description: undefined,
  findUnique: ({ id }) => ({ id }),
  fields: (t) => ({
    id: t.field(QuizOptionIdFieldObject),
    questionId: t.field(QuizOptionQuestionIdFieldObject),
    text: t.field(QuizOptionTextFieldObject),
    isCorrect: t.field(QuizOptionIsCorrectFieldObject),
    createdAt: t.field(QuizOptionCreatedAtFieldObject),
    updatedAt: t.field(QuizOptionUpdatedAtFieldObject),
    question: t.relation('question', QuizOptionQuestionFieldObject),
  }),
});

export const QuizOptionIdFieldObject = defineFieldObject('QuizOption', {
  type: "ID",
  description: undefined,
  nullable: false,
  resolve: (parent) => String(parent.id),
});

export const QuizOptionQuestionIdFieldObject = defineFieldObject('QuizOption', {
  type: "String",
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.questionId,
});

export const QuizOptionTextFieldObject = defineFieldObject('QuizOption', {
  type: "String",
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.text,
});

export const QuizOptionIsCorrectFieldObject = defineFieldObject('QuizOption', {
  type: "Boolean",
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.isCorrect,
});

export const QuizOptionCreatedAtFieldObject = defineFieldObject('QuizOption', {
  type: Inputs.DateTime,
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.createdAt,
});

export const QuizOptionUpdatedAtFieldObject = defineFieldObject('QuizOption', {
  type: Inputs.DateTime,
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.updatedAt,
});

export const QuizOptionQuestionFieldObject = defineRelationObject('QuizOption', 'question', {
  description: undefined,
  nullable: false,
  args: undefined,
  query: undefined,
});
