import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineQuery, defineQueryFunction, defineQueryObject } from '../../utils';

export const countQuizOptionQueryArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.QuizOptionWhereInput, required: false }),
  orderBy: t.field({ type: [Inputs.QuizOptionOrderByWithRelationInput], required: false }),
  cursor: t.field({ type: Inputs.QuizOptionWhereUniqueInput, required: false }),
  take: t.field({ type: 'Int', required: false }),
  skip: t.field({ type: 'Int', required: false }),
  distinct: t.field({ type: [Inputs.QuizOptionScalarFieldEnum], required: false }),
}))

export const countQuizOptionQueryObject = defineQueryFunction((t) =>
  defineQueryObject({
    type: 'Int',
    nullable: false,
    args: countQuizOptionQueryArgs,
    resolve: async (_root, args, _context, _info) =>
      await _context.prisma.quizOption.count({
        where: args.where || undefined,
        cursor: args.cursor || undefined,
        take: args.take || undefined,
        skip: args.skip || undefined,
        orderBy: args.orderBy || undefined,
      }),
  }),
);

export const countQuizOptionQuery = defineQuery((t) => ({
  countQuizOption: t.field(countQuizOptionQueryObject(t)),
}));
