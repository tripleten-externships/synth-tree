import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const deleteOneQuizAttemptAnswerMutationArgs = builder.args((t) => ({ where: t.field({ type: Inputs.QuizAttemptAnswerWhereUniqueInput, required: true }) }))

export const deleteOneQuizAttemptAnswerMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'QuizAttemptAnswer',
    nullable: true,
    args: deleteOneQuizAttemptAnswerMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.quizAttemptAnswer.delete({ where: args.where, ...query }),
  }),
);

export const deleteOneQuizAttemptAnswerMutation = defineMutation((t) => ({
  deleteOneQuizAttemptAnswer: t.prismaField(deleteOneQuizAttemptAnswerMutationObject(t)),
}));
