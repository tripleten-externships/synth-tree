import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineQuery, defineQueryFunction, defineQueryPrismaObject } from '../../utils';

export const findUniqueQuizAttemptQueryArgs = builder.args((t) => ({ where: t.field({ type: Inputs.QuizAttemptWhereUniqueInput, required: true }) }))

export const findUniqueQuizAttemptQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: 'QuizAttempt',
    nullable: true,
    args: findUniqueQuizAttemptQueryArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.quizAttempt.findUnique({ where: args.where, ...query }),
  }),
);

export const findUniqueQuizAttemptQuery = defineQuery((t) => ({
  findUniqueQuizAttempt: t.prismaField(findUniqueQuizAttemptQueryObject(t)),
}));
