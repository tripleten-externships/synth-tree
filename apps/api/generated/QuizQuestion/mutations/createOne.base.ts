import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const createOneQuizQuestionMutationArgs = builder.args((t) => ({ data: t.field({ type: Inputs.QuizQuestionCreateInput, required: true }) }))

export const createOneQuizQuestionMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'QuizQuestion',
    nullable: false,
    args: createOneQuizQuestionMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.quizQuestion.create({ data: args.data, ...query }),
  }),
);

export const createOneQuizQuestionMutation = defineMutation((t) => ({
  createOneQuizQuestion: t.prismaField(createOneQuizQuestionMutationObject(t)),
}));
