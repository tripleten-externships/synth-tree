import * as Inputs from '../../inputs';
import { BatchPayload } from '../../objects';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationObject } from '../../utils';

export const updateManyQuizAttemptMutationArgs = builder.args((t) => ({
      where: t.field({ type: Inputs.QuizAttemptWhereInput, required: false }),
      data: t.field({ type: Inputs.QuizAttemptUpdateManyMutationInput, required: true }),
    }))

export const updateManyQuizAttemptMutationObject = defineMutationFunction((t) =>
  defineMutationObject({
    type: BatchPayload,
    nullable: false,
    args: updateManyQuizAttemptMutationArgs,
    resolve: async (_root, args, _context, _info) =>
      await _context.prisma.quizAttempt.updateMany({ where: args.where || undefined, data: args.data }),
  }),
);

export const updateManyQuizAttemptMutation = defineMutation((t) => ({
  updateManyQuizAttempt: t.field(updateManyQuizAttemptMutationObject(t)),
}));
