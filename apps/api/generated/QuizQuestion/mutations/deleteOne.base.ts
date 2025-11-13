import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const deleteOneQuizQuestionMutationArgs = builder.args((t) => ({ where: t.field({ type: Inputs.QuizQuestionWhereUniqueInput, required: true }) }))

export const deleteOneQuizQuestionMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'QuizQuestion',
    nullable: true,
    args: deleteOneQuizQuestionMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.quizQuestion.delete({ where: args.where, ...query }),
  }),
);

export const deleteOneQuizQuestionMutation = defineMutation((t) => ({
  deleteOneQuizQuestion: t.prismaField(deleteOneQuizQuestionMutationObject(t)),
}));
