import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const updateOneQuizQuestionMutationArgs = builder.args((t) => ({
      where: t.field({ type: Inputs.QuizQuestionWhereUniqueInput, required: true }),
      data: t.field({ type: Inputs.QuizQuestionUpdateInput, required: true }),
    }))

export const updateOneQuizQuestionMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'QuizQuestion',
    nullable: true,
    args: updateOneQuizQuestionMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.quizQuestion.update({ where: args.where, data: args.data, ...query }),
  }),
);

export const updateOneQuizQuestionMutation = defineMutation((t) => ({
  updateOneQuizQuestion: t.prismaField(updateOneQuizQuestionMutationObject(t)),
}));
