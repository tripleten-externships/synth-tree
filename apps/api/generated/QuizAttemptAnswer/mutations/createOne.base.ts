import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const createOneQuizAttemptAnswerMutationArgs = builder.args((t) => ({ data: t.field({ type: Inputs.QuizAttemptAnswerCreateInput, required: true }) }))

export const createOneQuizAttemptAnswerMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'QuizAttemptAnswer',
    nullable: false,
    args: createOneQuizAttemptAnswerMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.quizAttemptAnswer.create({ data: args.data, ...query }),
  }),
);

export const createOneQuizAttemptAnswerMutation = defineMutation((t) => ({
  createOneQuizAttemptAnswer: t.prismaField(createOneQuizAttemptAnswerMutationObject(t)),
}));
