import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const updateOneQuizAttemptAnswerMutationArgs = builder.args((t) => ({
      where: t.field({ type: Inputs.QuizAttemptAnswerWhereUniqueInput, required: true }),
      data: t.field({ type: Inputs.QuizAttemptAnswerUpdateInput, required: true }),
    }))

export const updateOneQuizAttemptAnswerMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'QuizAttemptAnswer',
    nullable: true,
    args: updateOneQuizAttemptAnswerMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.quizAttemptAnswer.update({ where: args.where, data: args.data, ...query }),
  }),
);

export const updateOneQuizAttemptAnswerMutation = defineMutation((t) => ({
  updateOneQuizAttemptAnswer: t.prismaField(updateOneQuizAttemptAnswerMutationObject(t)),
}));
