import * as Inputs from '../inputs';
import { builder } from '../../builder';
import {
  definePrismaObject,
  defineFieldObject,
  defineRelationFunction,
  defineRelationObject,
} from '../utils';

export const QuizQuestionObject = definePrismaObject('QuizQuestion', {
  description: undefined,
  findUnique: ({ id }) => ({ id }),
  fields: (t) => ({
    id: t.field(QuizQuestionIdFieldObject),
    quizId: t.field(QuizQuestionQuizIdFieldObject),
    type: t.field(QuizQuestionTypeFieldObject),
    prompt: t.field(QuizQuestionPromptFieldObject),
    order: t.field(QuizQuestionOrderFieldObject),
    createdAt: t.field(QuizQuestionCreatedAtFieldObject),
    updatedAt: t.field(QuizQuestionUpdatedAtFieldObject),
    quiz: t.relation('quiz', QuizQuestionQuizFieldObject),
    options: t.relation('options', QuizQuestionOptionsFieldObject(t)),
    answers: t.relation('answers', QuizQuestionAnswersFieldObject(t)),
  }),
});

export const QuizQuestionIdFieldObject = defineFieldObject('QuizQuestion', {
  type: "ID",
  description: undefined,
  nullable: false,
  resolve: (parent) => String(parent.id),
});

export const QuizQuestionQuizIdFieldObject = defineFieldObject('QuizQuestion', {
  type: "String",
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.quizId,
});

export const QuizQuestionTypeFieldObject = defineFieldObject('QuizQuestion', {
  type: Inputs.QuestionType,
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.type,
});

export const QuizQuestionPromptFieldObject = defineFieldObject('QuizQuestion', {
  type: "String",
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.prompt,
});

export const QuizQuestionOrderFieldObject = defineFieldObject('QuizQuestion', {
  type: "Int",
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.order,
});

export const QuizQuestionCreatedAtFieldObject = defineFieldObject('QuizQuestion', {
  type: Inputs.DateTime,
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.createdAt,
});

export const QuizQuestionUpdatedAtFieldObject = defineFieldObject('QuizQuestion', {
  type: Inputs.DateTime,
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.updatedAt,
});

export const QuizQuestionQuizFieldObject = defineRelationObject('QuizQuestion', 'quiz', {
  description: undefined,
  nullable: false,
  args: undefined,
  query: undefined,
});

export const QuizQuestionOptionsFieldArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.QuizOptionWhereInput, required: false }),
  orderBy: t.field({ type: [Inputs.QuizOptionOrderByWithRelationInput], required: false }),
  cursor: t.field({ type: Inputs.QuizOptionWhereUniqueInput, required: false }),
  take: t.field({ type: 'Int', required: false }),
  skip: t.field({ type: 'Int', required: false }),
  distinct: t.field({ type: [Inputs.QuizOptionScalarFieldEnum], required: false }),
}))

export const QuizQuestionOptionsFieldObject = defineRelationFunction('QuizQuestion', (t) =>
  defineRelationObject('QuizQuestion', 'options', {
    description: undefined,
    nullable: false,
    args: QuizQuestionOptionsFieldArgs,
    query: (args) => ({
      where: args.where || undefined,
      cursor: args.cursor || undefined,
      take: args.take || undefined,
      distinct: args.distinct || undefined,
      skip: args.skip || undefined,
      orderBy: args.orderBy || undefined,
    }),
  }),
);

export const QuizQuestionAnswersFieldArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.QuizAttemptAnswerWhereInput, required: false }),
  orderBy: t.field({ type: [Inputs.QuizAttemptAnswerOrderByWithRelationInput], required: false }),
  cursor: t.field({ type: Inputs.QuizAttemptAnswerWhereUniqueInput, required: false }),
  take: t.field({ type: 'Int', required: false }),
  skip: t.field({ type: 'Int', required: false }),
  distinct: t.field({ type: [Inputs.QuizAttemptAnswerScalarFieldEnum], required: false }),
}))

export const QuizQuestionAnswersFieldObject = defineRelationFunction('QuizQuestion', (t) =>
  defineRelationObject('QuizQuestion', 'answers', {
    description: undefined,
    nullable: false,
    args: QuizQuestionAnswersFieldArgs,
    query: (args) => ({
      where: args.where || undefined,
      cursor: args.cursor || undefined,
      take: args.take || undefined,
      distinct: args.distinct || undefined,
      skip: args.skip || undefined,
      orderBy: args.orderBy || undefined,
    }),
  }),
);
