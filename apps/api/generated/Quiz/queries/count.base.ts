import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineQuery, defineQueryFunction, defineQueryObject } from '../../utils';

export const countQuizQueryArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.QuizWhereInput, required: false }),
  orderBy: t.field({ type: [Inputs.QuizOrderByWithRelationInput], required: false }),
  cursor: t.field({ type: Inputs.QuizWhereUniqueInput, required: false }),
  take: t.field({ type: 'Int', required: false }),
  skip: t.field({ type: 'Int', required: false }),
  distinct: t.field({ type: [Inputs.QuizScalarFieldEnum], required: false }),
}))

export const countQuizQueryObject = defineQueryFunction((t) =>
  defineQueryObject({
    type: 'Int',
    nullable: false,
    args: countQuizQueryArgs,
    resolve: async (_root, args, _context, _info) =>
      await _context.prisma.quiz.count({
        where: args.where || undefined,
        cursor: args.cursor || undefined,
        take: args.take || undefined,
        skip: args.skip || undefined,
        orderBy: args.orderBy || undefined,
      }),
  }),
);

export const countQuizQuery = defineQuery((t) => ({
  countQuiz: t.field(countQuizQueryObject(t)),
}));
