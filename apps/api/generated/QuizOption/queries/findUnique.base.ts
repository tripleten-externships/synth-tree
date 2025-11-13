import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineQuery, defineQueryFunction, defineQueryPrismaObject } from '../../utils';

export const findUniqueQuizOptionQueryArgs = builder.args((t) => ({ where: t.field({ type: Inputs.QuizOptionWhereUniqueInput, required: true }) }))

export const findUniqueQuizOptionQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: 'QuizOption',
    nullable: true,
    args: findUniqueQuizOptionQueryArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.quizOption.findUnique({ where: args.where, ...query }),
  }),
);

export const findUniqueQuizOptionQuery = defineQuery((t) => ({
  findUniqueQuizOption: t.prismaField(findUniqueQuizOptionQueryObject(t)),
}));
