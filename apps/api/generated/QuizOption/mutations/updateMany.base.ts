import * as Inputs from '../../inputs';
import { BatchPayload } from '../../objects';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationObject } from '../../utils';

export const updateManyQuizOptionMutationArgs = builder.args((t) => ({
      where: t.field({ type: Inputs.QuizOptionWhereInput, required: false }),
      data: t.field({ type: Inputs.QuizOptionUpdateManyMutationInput, required: true }),
    }))

export const updateManyQuizOptionMutationObject = defineMutationFunction((t) =>
  defineMutationObject({
    type: BatchPayload,
    nullable: false,
    args: updateManyQuizOptionMutationArgs,
    resolve: async (_root, args, _context, _info) =>
      await _context.prisma.quizOption.updateMany({ where: args.where || undefined, data: args.data }),
  }),
);

export const updateManyQuizOptionMutation = defineMutation((t) => ({
  updateManyQuizOption: t.field(updateManyQuizOptionMutationObject(t)),
}));
