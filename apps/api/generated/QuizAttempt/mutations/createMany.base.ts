import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const createManyQuizAttemptMutationArgs = builder.args((t) => ({ data: t.field({ type: [Inputs.QuizAttemptCreateInput], required: true }) }))

export const createManyQuizAttemptMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: ['QuizAttempt'],
    nullable: false,
    args: createManyQuizAttemptMutationArgs,
    resolve: async (_query, _root, args, _context, _info) =>
      await _context.prisma.$transaction(args.data.map((data) => _context.prisma.quizAttempt.create({ data }))),
  }),
);

export const createManyQuizAttemptMutation = defineMutation((t) => ({
  createManyQuizAttempt: t.prismaField(createManyQuizAttemptMutationObject(t)),
}));
