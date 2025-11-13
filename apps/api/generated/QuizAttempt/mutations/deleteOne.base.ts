import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const deleteOneQuizAttemptMutationArgs = builder.args((t) => ({ where: t.field({ type: Inputs.QuizAttemptWhereUniqueInput, required: true }) }))

export const deleteOneQuizAttemptMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'QuizAttempt',
    nullable: true,
    args: deleteOneQuizAttemptMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.quizAttempt.delete({ where: args.where, ...query }),
  }),
);

export const deleteOneQuizAttemptMutation = defineMutation((t) => ({
  deleteOneQuizAttempt: t.prismaField(deleteOneQuizAttemptMutationObject(t)),
}));
