import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const updateOneQuizAttemptMutationArgs = builder.args((t) => ({
      where: t.field({ type: Inputs.QuizAttemptWhereUniqueInput, required: true }),
      data: t.field({ type: Inputs.QuizAttemptUpdateInput, required: true }),
    }))

export const updateOneQuizAttemptMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'QuizAttempt',
    nullable: true,
    args: updateOneQuizAttemptMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.quizAttempt.update({ where: args.where, data: args.data, ...query }),
  }),
);

export const updateOneQuizAttemptMutation = defineMutation((t) => ({
  updateOneQuizAttempt: t.prismaField(updateOneQuizAttemptMutationObject(t)),
}));
