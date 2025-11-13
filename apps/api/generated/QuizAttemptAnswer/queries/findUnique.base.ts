import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineQuery, defineQueryFunction, defineQueryPrismaObject } from '../../utils';

export const findUniqueQuizAttemptAnswerQueryArgs = builder.args((t) => ({ where: t.field({ type: Inputs.QuizAttemptAnswerWhereUniqueInput, required: true }) }))

export const findUniqueQuizAttemptAnswerQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: 'QuizAttemptAnswer',
    nullable: true,
    args: findUniqueQuizAttemptAnswerQueryArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.quizAttemptAnswer.findUnique({ where: args.where, ...query }),
  }),
);

export const findUniqueQuizAttemptAnswerQuery = defineQuery((t) => ({
  findUniqueQuizAttemptAnswer: t.prismaField(findUniqueQuizAttemptAnswerQueryObject(t)),
}));
