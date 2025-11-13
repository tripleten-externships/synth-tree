import * as Inputs from '../../inputs';
import { BatchPayload } from '../../objects';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationObject } from '../../utils';

export const deleteManyQuizQuestionMutationArgs = builder.args((t) => ({ where: t.field({ type: Inputs.QuizQuestionWhereInput, required: true }) }))

export const deleteManyQuizQuestionMutationObject = defineMutationFunction((t) =>
  defineMutationObject({
    type: BatchPayload,
    nullable: true,
    args: deleteManyQuizQuestionMutationArgs,
    resolve: async (_root, args, _context, _info) =>
      await _context.prisma.quizQuestion.deleteMany({ where: args.where }),
  }),
);

export const deleteManyQuizQuestionMutation = defineMutation((t) => ({
  deleteManyQuizQuestion: t.field(deleteManyQuizQuestionMutationObject(t)),
}));
