import * as Inputs from '../../inputs';
import { BatchPayload } from '../../objects';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationObject } from '../../utils';

export const updateManyQuizAttemptAnswerMutationArgs = builder.args((t) => ({
      where: t.field({ type: Inputs.QuizAttemptAnswerWhereInput, required: false }),
      data: t.field({ type: Inputs.QuizAttemptAnswerUpdateManyMutationInput, required: true }),
    }))

export const updateManyQuizAttemptAnswerMutationObject = defineMutationFunction((t) =>
  defineMutationObject({
    type: BatchPayload,
    nullable: false,
    args: updateManyQuizAttemptAnswerMutationArgs,
    resolve: async (_root, args, _context, _info) =>
      await _context.prisma.quizAttemptAnswer.updateMany({ where: args.where || undefined, data: args.data }),
  }),
);

export const updateManyQuizAttemptAnswerMutation = defineMutation((t) => ({
  updateManyQuizAttemptAnswer: t.field(updateManyQuizAttemptAnswerMutationObject(t)),
}));
