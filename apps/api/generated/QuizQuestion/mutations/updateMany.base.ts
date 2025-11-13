import * as Inputs from '../../inputs';
import { BatchPayload } from '../../objects';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationObject } from '../../utils';

export const updateManyQuizQuestionMutationArgs = builder.args((t) => ({
      where: t.field({ type: Inputs.QuizQuestionWhereInput, required: false }),
      data: t.field({ type: Inputs.QuizQuestionUpdateManyMutationInput, required: true }),
    }))

export const updateManyQuizQuestionMutationObject = defineMutationFunction((t) =>
  defineMutationObject({
    type: BatchPayload,
    nullable: false,
    args: updateManyQuizQuestionMutationArgs,
    resolve: async (_root, args, _context, _info) =>
      await _context.prisma.quizQuestion.updateMany({ where: args.where || undefined, data: args.data }),
  }),
);

export const updateManyQuizQuestionMutation = defineMutation((t) => ({
  updateManyQuizQuestion: t.field(updateManyQuizQuestionMutationObject(t)),
}));
