import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineQuery, defineQueryFunction, defineQueryPrismaObject } from '../../utils';

export const findManyQuizQueryArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.QuizWhereInput, required: false }),
  orderBy: t.field({ type: [Inputs.QuizOrderByWithRelationInput], required: false }),
  cursor: t.field({ type: Inputs.QuizWhereUniqueInput, required: false }),
  take: t.field({ type: 'Int', required: false }),
  skip: t.field({ type: 'Int', required: false }),
  distinct: t.field({ type: [Inputs.QuizScalarFieldEnum], required: false }),
}))

export const findManyQuizQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: ['Quiz'],
    nullable: false,
    args: findManyQuizQueryArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.quiz.findMany({
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

export const findManyQuizQuery = defineQuery((t) => ({
  findManyQuiz: t.prismaField(findManyQuizQueryObject(t)),
}));
