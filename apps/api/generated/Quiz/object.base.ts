import * as Inputs from '../inputs';
import { builder } from '../../builder';
import {
  definePrismaObject,
  defineFieldObject,
  defineRelationFunction,
  defineRelationObject,
} from '../utils';

export const QuizObject = definePrismaObject('Quiz', {
  description: undefined,
  findUnique: ({ id }) => ({ id }),
  fields: (t) => ({
    id: t.field(QuizIdFieldObject),
    nodeId: t.field(QuizNodeIdFieldObject),
    title: t.field(QuizTitleFieldObject),
    required: t.field(QuizRequiredFieldObject),
    createdAt: t.field(QuizCreatedAtFieldObject),
    updatedAt: t.field(QuizUpdatedAtFieldObject),
    deletedAt: t.field(QuizDeletedAtFieldObject),
    node: t.relation('node', QuizNodeFieldObject),
    questions: t.relation('questions', QuizQuestionsFieldObject(t)),
    attempts: t.relation('attempts', QuizAttemptsFieldObject(t)),
  }),
});

export const QuizIdFieldObject = defineFieldObject('Quiz', {
  type: "ID",
  description: undefined,
  nullable: false,
  resolve: (parent) => String(parent.id),
});

export const QuizNodeIdFieldObject = defineFieldObject('Quiz', {
  type: "String",
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.nodeId,
});

export const QuizTitleFieldObject = defineFieldObject('Quiz', {
  type: "String",
  description: undefined,
  nullable: true,
  resolve: (parent) => parent.title,
});

export const QuizRequiredFieldObject = defineFieldObject('Quiz', {
  type: "Boolean",
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.required,
});

export const QuizCreatedAtFieldObject = defineFieldObject('Quiz', {
  type: Inputs.DateTime,
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.createdAt,
});

export const QuizUpdatedAtFieldObject = defineFieldObject('Quiz', {
  type: Inputs.DateTime,
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.updatedAt,
});

export const QuizDeletedAtFieldObject = defineFieldObject('Quiz', {
  type: Inputs.DateTime,
  description: undefined,
  nullable: true,
  resolve: (parent) => parent.deletedAt,
});

export const QuizNodeFieldObject = defineRelationObject('Quiz', 'node', {
  description: undefined,
  nullable: false,
  args: undefined,
  query: undefined,
});

export const QuizQuestionsFieldArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.QuizQuestionWhereInput, required: false }),
  orderBy: t.field({ type: [Inputs.QuizQuestionOrderByWithRelationInput], required: false }),
  cursor: t.field({ type: Inputs.QuizQuestionWhereUniqueInput, required: false }),
  take: t.field({ type: 'Int', required: false }),
  skip: t.field({ type: 'Int', required: false }),
  distinct: t.field({ type: [Inputs.QuizQuestionScalarFieldEnum], required: false }),
}))

export const QuizQuestionsFieldObject = defineRelationFunction('Quiz', (t) =>
  defineRelationObject('Quiz', 'questions', {
    description: undefined,
    nullable: false,
    args: QuizQuestionsFieldArgs,
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

export const QuizAttemptsFieldArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.QuizAttemptWhereInput, required: false }),
  orderBy: t.field({ type: [Inputs.QuizAttemptOrderByWithRelationInput], required: false }),
  cursor: t.field({ type: Inputs.QuizAttemptWhereUniqueInput, required: false }),
  take: t.field({ type: 'Int', required: false }),
  skip: t.field({ type: 'Int', required: false }),
  distinct: t.field({ type: [Inputs.QuizAttemptScalarFieldEnum], required: false }),
}))

export const QuizAttemptsFieldObject = defineRelationFunction('Quiz', (t) =>
  defineRelationObject('Quiz', 'attempts', {
    description: undefined,
    nullable: false,
    args: QuizAttemptsFieldArgs,
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
