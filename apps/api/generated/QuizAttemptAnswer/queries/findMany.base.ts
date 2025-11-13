import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineQuery, defineQueryFunction, defineQueryPrismaObject } from '../../utils';

export const findManyQuizAttemptAnswerQueryArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.QuizAttemptAnswerWhereInput, required: false }),
  orderBy: t.field({ type: [Inputs.QuizAttemptAnswerOrderByWithRelationInput], required: false }),
  cursor: t.field({ type: Inputs.QuizAttemptAnswerWhereUniqueInput, required: false }),
  take: t.field({ type: 'Int', required: false }),
  skip: t.field({ type: 'Int', required: false }),
  distinct: t.field({ type: [Inputs.QuizAttemptAnswerScalarFieldEnum], required: false }),
}))

export const findManyQuizAttemptAnswerQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: ['QuizAttemptAnswer'],
    nullable: false,
    args: findManyQuizAttemptAnswerQueryArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.quizAttemptAnswer.findMany({
        where: args.where || undefined,
        cursor: args.cursor || undefined,
        take: args.take || undefined,
        distinct: args.distinct || undefined,
        skip: args.skip || undefined,
        orderBy: args.orderBy || undefined,
        ...query,
      }),
  }),
);

export const findManyQuizAttemptAnswerQuery = defineQuery((t) => ({
  findManyQuizAttemptAnswer: t.prismaField(findManyQuizAttemptAnswerQueryObject(t)),
}));
