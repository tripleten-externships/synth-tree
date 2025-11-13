import * as Inputs from '../../inputs';
import { BatchPayload } from '../../objects';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationObject } from '../../utils';

export const deleteManyQuizMutationArgs = builder.args((t) => ({ where: t.field({ type: Inputs.QuizWhereInput, required: true }) }))

export const deleteManyQuizMutationObject = defineMutationFunction((t) =>
  defineMutationObject({
    type: BatchPayload,
    nullable: true,
    args: deleteManyQuizMutationArgs,
    resolve: async (_root, args, _context, _info) =>
      await _context.prisma.quiz.deleteMany({ where: args.where }),
  }),
);

export const deleteManyQuizMutation = defineMutation((t) => ({
  deleteManyQuiz: t.field(deleteManyQuizMutationObject(t)),
}));
