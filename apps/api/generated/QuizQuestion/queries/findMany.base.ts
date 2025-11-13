import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineQuery, defineQueryFunction, defineQueryPrismaObject } from '../../utils';

export const findManyQuizQuestionQueryArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.QuizQuestionWhereInput, required: false }),
  orderBy: t.field({ type: [Inputs.QuizQuestionOrderByWithRelationInput], required: false }),
  cursor: t.field({ type: Inputs.QuizQuestionWhereUniqueInput, required: false }),
  take: t.field({ type: 'Int', required: false }),
  skip: t.field({ type: 'Int', required: false }),
  distinct: t.field({ type: [Inputs.QuizQuestionScalarFieldEnum], required: false }),
}))

export const findManyQuizQuestionQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: ['QuizQuestion'],
    nullable: false,
    args: findManyQuizQuestionQueryArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.quizQuestion.findMany({
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

export const findManyQuizQuestionQuery = defineQuery((t) => ({
  findManyQuizQuestion: t.prismaField(findManyQuizQuestionQueryObject(t)),
}));
