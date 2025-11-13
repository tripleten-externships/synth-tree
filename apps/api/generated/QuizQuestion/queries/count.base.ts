import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineQuery, defineQueryFunction, defineQueryObject } from '../../utils';

export const countQuizQuestionQueryArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.QuizQuestionWhereInput, required: false }),
  orderBy: t.field({ type: [Inputs.QuizQuestionOrderByWithRelationInput], required: false }),
  cursor: t.field({ type: Inputs.QuizQuestionWhereUniqueInput, required: false }),
  take: t.field({ type: 'Int', required: false }),
  skip: t.field({ type: 'Int', required: false }),
  distinct: t.field({ type: [Inputs.QuizQuestionScalarFieldEnum], required: false }),
}))

export const countQuizQuestionQueryObject = defineQueryFunction((t) =>
  defineQueryObject({
    type: 'Int',
    nullable: false,
    args: countQuizQuestionQueryArgs,
    resolve: async (_root, args, _context, _info) =>
      await _context.prisma.quizQuestion.count({
        where: args.where || undefined,
        cursor: args.cursor || undefined,
        take: args.take || undefined,
        skip: args.skip || undefined,
        orderBy: args.orderBy || undefined,
      }),
  }),
);

export const countQuizQuestionQuery = defineQuery((t) => ({
  countQuizQuestion: t.field(countQuizQuestionQueryObject(t)),
}));
