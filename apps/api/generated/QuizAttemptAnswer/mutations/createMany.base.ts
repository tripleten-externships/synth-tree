import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const createManyQuizAttemptAnswerMutationArgs = builder.args((t) => ({ data: t.field({ type: [Inputs.QuizAttemptAnswerCreateInput], required: true }) }))

export const createManyQuizAttemptAnswerMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: ['QuizAttemptAnswer'],
    nullable: false,
    args: createManyQuizAttemptAnswerMutationArgs,
    resolve: async (_query, _root, args, _context, _info) =>
      await _context.prisma.$transaction(args.data.map((data) => _context.prisma.quizAttemptAnswer.create({ data }))),
  }),
);

export const createManyQuizAttemptAnswerMutation = defineMutation((t) => ({
  createManyQuizAttemptAnswer: t.prismaField(createManyQuizAttemptAnswerMutationObject(t)),
}));
