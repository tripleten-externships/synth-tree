import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const createOneQuizAttemptMutationArgs = builder.args((t) => ({ data: t.field({ type: Inputs.QuizAttemptCreateInput, required: true }) }))

export const createOneQuizAttemptMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'QuizAttempt',
    nullable: false,
    args: createOneQuizAttemptMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.quizAttempt.create({ data: args.data, ...query }),
  }),
);

export const createOneQuizAttemptMutation = defineMutation((t) => ({
  createOneQuizAttempt: t.prismaField(createOneQuizAttemptMutationObject(t)),
}));
