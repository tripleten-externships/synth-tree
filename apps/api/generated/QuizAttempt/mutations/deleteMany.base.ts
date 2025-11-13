import * as Inputs from '../../inputs';
import { BatchPayload } from '../../objects';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationObject } from '../../utils';

export const deleteManyQuizAttemptMutationArgs = builder.args((t) => ({ where: t.field({ type: Inputs.QuizAttemptWhereInput, required: true }) }))

export const deleteManyQuizAttemptMutationObject = defineMutationFunction((t) =>
  defineMutationObject({
    type: BatchPayload,
    nullable: true,
    args: deleteManyQuizAttemptMutationArgs,
    resolve: async (_root, args, _context, _info) =>
      await _context.prisma.quizAttempt.deleteMany({ where: args.where }),
  }),
);

export const deleteManyQuizAttemptMutation = defineMutation((t) => ({
  deleteManyQuizAttempt: t.field(deleteManyQuizAttemptMutationObject(t)),
}));
