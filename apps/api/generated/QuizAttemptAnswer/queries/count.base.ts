import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineQuery, defineQueryFunction, defineQueryObject } from '../../utils';

export const countQuizAttemptAnswerQueryArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.QuizAttemptAnswerWhereInput, required: false }),
  orderBy: t.field({ type: [Inputs.QuizAttemptAnswerOrderByWithRelationInput], required: false }),
  cursor: t.field({ type: Inputs.QuizAttemptAnswerWhereUniqueInput, required: false }),
  take: t.field({ type: 'Int', required: false }),
  skip: t.field({ type: 'Int', required: false }),
  distinct: t.field({ type: [Inputs.QuizAttemptAnswerScalarFieldEnum], required: false }),
}))

export const countQuizAttemptAnswerQueryObject = defineQueryFunction((t) =>
  defineQueryObject({
    type: 'Int',
    nullable: false,
    args: countQuizAttemptAnswerQueryArgs,
    resolve: async (_root, args, _context, _info) =>
      await _context.prisma.quizAttemptAnswer.count({
        where: args.where || undefined,
        cursor: args.cursor || undefined,
        take: args.take || undefined,
        skip: args.skip || undefined,
        orderBy: args.orderBy || undefined,
      }),
  }),
);

export const countQuizAttemptAnswerQuery = defineQuery((t) => ({
  countQuizAttemptAnswer: t.field(countQuizAttemptAnswerQueryObject(t)),
}));
