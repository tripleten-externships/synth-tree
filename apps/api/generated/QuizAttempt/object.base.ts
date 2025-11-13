import * as Inputs from '../inputs';
import { builder } from '../../builder';
import {
  definePrismaObject,
  defineFieldObject,
  defineRelationFunction,
  defineRelationObject,
} from '../utils';

export const QuizAttemptObject = definePrismaObject('QuizAttempt', {
  description: undefined,
  findUnique: ({ id }) => ({ id }),
  fields: (t) => ({
    id: t.field(QuizAttemptIdFieldObject),
    quizId: t.field(QuizAttemptQuizIdFieldObject),
    userId: t.field(QuizAttemptUserIdFieldObject),
    passed: t.field(QuizAttemptPassedFieldObject),
    takenAt: t.field(QuizAttemptTakenAtFieldObject),
    quiz: t.relation('quiz', QuizAttemptQuizFieldObject),
    user: t.relation('user', QuizAttemptUserFieldObject),
    answers: t.relation('answers', QuizAttemptAnswersFieldObject(t)),
  }),
});

export const QuizAttemptIdFieldObject = defineFieldObject('QuizAttempt', {
  type: "ID",
  description: undefined,
  nullable: false,
  resolve: (parent) => String(parent.id),
});

export const QuizAttemptQuizIdFieldObject = defineFieldObject('QuizAttempt', {
  type: "String",
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.quizId,
});

export const QuizAttemptUserIdFieldObject = defineFieldObject('QuizAttempt', {
  type: "String",
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.userId,
});

export const QuizAttemptPassedFieldObject = defineFieldObject('QuizAttempt', {
  type: "Boolean",
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.passed,
});

export const QuizAttemptTakenAtFieldObject = defineFieldObject('QuizAttempt', {
  type: Inputs.DateTime,
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.takenAt,
});

export const QuizAttemptQuizFieldObject = defineRelationObject('QuizAttempt', 'quiz', {
  description: undefined,
  nullable: false,
  args: undefined,
  query: undefined,
});

export const QuizAttemptUserFieldObject = defineRelationObject('QuizAttempt', 'user', {
  description: undefined,
  nullable: false,
  args: undefined,
  query: undefined,
});

export const QuizAttemptAnswersFieldArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.QuizAttemptAnswerWhereInput, required: false }),
  orderBy: t.field({ type: [Inputs.QuizAttemptAnswerOrderByWithRelationInput], required: false }),
  cursor: t.field({ type: Inputs.QuizAttemptAnswerWhereUniqueInput, required: false }),
  take: t.field({ type: 'Int', required: false }),
  skip: t.field({ type: 'Int', required: false }),
  distinct: t.field({ type: [Inputs.QuizAttemptAnswerScalarFieldEnum], required: false }),
}))

export const QuizAttemptAnswersFieldObject = defineRelationFunction('QuizAttempt', (t) =>
  defineRelationObject('QuizAttempt', 'answers', {
    description: undefined,
    nullable: false,
    args: QuizAttemptAnswersFieldArgs,
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
