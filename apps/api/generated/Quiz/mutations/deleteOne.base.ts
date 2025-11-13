import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const deleteOneQuizMutationArgs = builder.args((t) => ({ where: t.field({ type: Inputs.QuizWhereUniqueInput, required: true }) }))

export const deleteOneQuizMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'Quiz',
    nullable: true,
    args: deleteOneQuizMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.quiz.delete({ where: args.where, ...query }),
  }),
);

export const deleteOneQuizMutation = defineMutation((t) => ({
  deleteOneQuiz: t.prismaField(deleteOneQuizMutationObject(t)),
}));
