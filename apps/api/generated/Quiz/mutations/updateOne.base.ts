import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const updateOneQuizMutationArgs = builder.args((t) => ({
      where: t.field({ type: Inputs.QuizWhereUniqueInput, required: true }),
      data: t.field({ type: Inputs.QuizUpdateInput, required: true }),
    }))

export const updateOneQuizMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'Quiz',
    nullable: true,
    args: updateOneQuizMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.quiz.update({ where: args.where, data: args.data, ...query }),
  }),
);

export const updateOneQuizMutation = defineMutation((t) => ({
  updateOneQuiz: t.prismaField(updateOneQuizMutationObject(t)),
}));
