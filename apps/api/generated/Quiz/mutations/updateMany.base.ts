import * as Inputs from '../../inputs';
import { BatchPayload } from '../../objects';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationObject } from '../../utils';

export const updateManyQuizMutationArgs = builder.args((t) => ({
      where: t.field({ type: Inputs.QuizWhereInput, required: false }),
      data: t.field({ type: Inputs.QuizUpdateManyMutationInput, required: true }),
    }))

export const updateManyQuizMutationObject = defineMutationFunction((t) =>
  defineMutationObject({
    type: BatchPayload,
    nullable: false,
    args: updateManyQuizMutationArgs,
    resolve: async (_root, args, _context, _info) =>
      await _context.prisma.quiz.updateMany({ where: args.where || undefined, data: args.data }),
  }),
);

export const updateManyQuizMutation = defineMutation((t) => ({
  updateManyQuiz: t.field(updateManyQuizMutationObject(t)),
}));
