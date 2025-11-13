import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineQuery, defineQueryFunction, defineQueryPrismaObject } from '../../utils';

export const findUniqueQuizQueryArgs = builder.args((t) => ({ where: t.field({ type: Inputs.QuizWhereUniqueInput, required: true }) }))

export const findUniqueQuizQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: 'Quiz',
    nullable: true,
    args: findUniqueQuizQueryArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.quiz.findUnique({ where: args.where, ...query }),
  }),
);

export const findUniqueQuizQuery = defineQuery((t) => ({
  findUniqueQuiz: t.prismaField(findUniqueQuizQueryObject(t)),
}));
