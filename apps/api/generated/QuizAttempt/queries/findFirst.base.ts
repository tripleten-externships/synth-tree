import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineQuery, defineQueryFunction, defineQueryPrismaObject } from '../../utils';

export const findFirstQuizAttemptQueryArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.QuizAttemptWhereInput, required: false }),
  orderBy: t.field({ type: [Inputs.QuizAttemptOrderByWithRelationInput], required: false }),
  cursor: t.field({ type: Inputs.QuizAttemptWhereUniqueInput, required: false }),
  take: t.field({ type: 'Int', required: false }),
  skip: t.field({ type: 'Int', required: false }),
  distinct: t.field({ type: [Inputs.QuizAttemptScalarFieldEnum], required: false }),
}))

export const findFirstQuizAttemptQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: 'QuizAttempt',
    nullable: true,
    args: findFirstQuizAttemptQueryArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.quizAttempt.findFirst({
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

export const findFirstQuizAttemptQuery = defineQuery((t) => ({
  findFirstQuizAttempt: t.prismaField(findFirstQuizAttemptQueryObject(t)),
}));
