import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const deleteOneQuizOptionMutationArgs = builder.args((t) => ({ where: t.field({ type: Inputs.QuizOptionWhereUniqueInput, required: true }) }))

export const deleteOneQuizOptionMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'QuizOption',
    nullable: true,
    args: deleteOneQuizOptionMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.quizOption.delete({ where: args.where, ...query }),
  }),
);

export const deleteOneQuizOptionMutation = defineMutation((t) => ({
  deleteOneQuizOption: t.prismaField(deleteOneQuizOptionMutationObject(t)),
}));
