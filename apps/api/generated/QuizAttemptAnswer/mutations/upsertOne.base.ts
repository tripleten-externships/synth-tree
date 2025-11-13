import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const upsertOneQuizAttemptAnswerMutationArgs = builder.args((t) => ({
      where: t.field({ type: Inputs.QuizAttemptAnswerWhereUniqueInput, required: true }),
      create: t.field({ type: Inputs.QuizAttemptAnswerCreateInput, required: true }),
      update: t.field({ type: Inputs.QuizAttemptAnswerUpdateInput, required: true }),
    }))

export const upsertOneQuizAttemptAnswerMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'QuizAttemptAnswer',
    nullable: false,
    args: upsertOneQuizAttemptAnswerMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.quizAttemptAnswer.upsert({
        where: args.where,
        create: args.create,
        update: args.update,
        ...query,
      }),
  }),
);

export const upsertOneQuizAttemptAnswerMutation = defineMutation((t) => ({
  upsertOneQuizAttemptAnswer: t.prismaField(upsertOneQuizAttemptAnswerMutationObject(t)),
}));
