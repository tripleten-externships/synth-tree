import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineQuery, defineQueryFunction, defineQueryPrismaObject } from '../../utils';

export const findManyQuizOptionQueryArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.QuizOptionWhereInput, required: false }),
  orderBy: t.field({ type: [Inputs.QuizOptionOrderByWithRelationInput], required: false }),
  cursor: t.field({ type: Inputs.QuizOptionWhereUniqueInput, required: false }),
  take: t.field({ type: 'Int', required: false }),
  skip: t.field({ type: 'Int', required: false }),
  distinct: t.field({ type: [Inputs.QuizOptionScalarFieldEnum], required: false }),
}))

export const findManyQuizOptionQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: ['QuizOption'],
    nullable: false,
    args: findManyQuizOptionQueryArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.quizOption.findMany({
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

export const findManyQuizOptionQuery = defineQuery((t) => ({
  findManyQuizOption: t.prismaField(findManyQuizOptionQueryObject(t)),
}));
