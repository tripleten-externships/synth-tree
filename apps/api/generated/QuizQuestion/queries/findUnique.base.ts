import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineQuery, defineQueryFunction, defineQueryPrismaObject } from '../../utils';

export const findUniqueQuizQuestionQueryArgs = builder.args((t) => ({ where: t.field({ type: Inputs.QuizQuestionWhereUniqueInput, required: true }) }))

export const findUniqueQuizQuestionQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: 'QuizQuestion',
    nullable: true,
    args: findUniqueQuizQuestionQueryArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.quizQuestion.findUnique({ where: args.where, ...query }),
  }),
);

export const findUniqueQuizQuestionQuery = defineQuery((t) => ({
  findUniqueQuizQuestion: t.prismaField(findUniqueQuizQuestionQueryObject(t)),
}));
