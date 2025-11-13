import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const createOneQuizMutationArgs = builder.args((t) => ({ data: t.field({ type: Inputs.QuizCreateInput, required: true }) }))

export const createOneQuizMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'Quiz',
    nullable: false,
    args: createOneQuizMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.quiz.create({ data: args.data, ...query }),
  }),
);

export const createOneQuizMutation = defineMutation((t) => ({
  createOneQuiz: t.prismaField(createOneQuizMutationObject(t)),
}));
