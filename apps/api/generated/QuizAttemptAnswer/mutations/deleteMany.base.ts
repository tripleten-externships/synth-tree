import * as Inputs from '../../inputs';
import { BatchPayload } from '../../objects';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationObject } from '../../utils';

export const deleteManyQuizAttemptAnswerMutationArgs = builder.args((t) => ({ where: t.field({ type: Inputs.QuizAttemptAnswerWhereInput, required: true }) }))

export const deleteManyQuizAttemptAnswerMutationObject = defineMutationFunction((t) =>
  defineMutationObject({
    type: BatchPayload,
    nullable: true,
    args: deleteManyQuizAttemptAnswerMutationArgs,
    resolve: async (_root, args, _context, _info) =>
      await _context.prisma.quizAttemptAnswer.deleteMany({ where: args.where }),
  }),
);

export const deleteManyQuizAttemptAnswerMutation = defineMutation((t) => ({
  deleteManyQuizAttemptAnswer: t.field(deleteManyQuizAttemptAnswerMutationObject(t)),
}));
