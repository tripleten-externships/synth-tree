import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const updateOneQuizOptionMutationArgs = builder.args((t) => ({
      where: t.field({ type: Inputs.QuizOptionWhereUniqueInput, required: true }),
      data: t.field({ type: Inputs.QuizOptionUpdateInput, required: true }),
    }))

export const updateOneQuizOptionMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'QuizOption',
    nullable: true,
    args: updateOneQuizOptionMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.quizOption.update({ where: args.where, data: args.data, ...query }),
  }),
);

export const updateOneQuizOptionMutation = defineMutation((t) => ({
  updateOneQuizOption: t.prismaField(updateOneQuizOptionMutationObject(t)),
}));
