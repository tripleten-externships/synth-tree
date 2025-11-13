import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineQuery, defineQueryFunction, defineQueryPrismaObject } from '../../utils';

export const findFirstQuizQueryArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.QuizWhereInput, required: false }),
  orderBy: t.field({ type: [Inputs.QuizOrderByWithRelationInput], required: false }),
  cursor: t.field({ type: Inputs.QuizWhereUniqueInput, required: false }),
  take: t.field({ type: 'Int', required: false }),
  skip: t.field({ type: 'Int', required: false }),
  distinct: t.field({ type: [Inputs.QuizScalarFieldEnum], required: false }),
}))

export const findFirstQuizQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: 'Quiz',
    nullable: true,
    args: findFirstQuizQueryArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.quiz.findFirst({
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

export const findFirstQuizQuery = defineQuery((t) => ({
  findFirstQuiz: t.prismaField(findFirstQuizQueryObject(t)),
}));
