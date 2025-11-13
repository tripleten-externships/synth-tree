import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const upsertOneQuizAttemptMutationArgs = builder.args((t) => ({
      where: t.field({ type: Inputs.QuizAttemptWhereUniqueInput, required: true }),
      create: t.field({ type: Inputs.QuizAttemptCreateInput, required: true }),
      update: t.field({ type: Inputs.QuizAttemptUpdateInput, required: true }),
    }))

export const upsertOneQuizAttemptMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'QuizAttempt',
    nullable: false,
    args: upsertOneQuizAttemptMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.quizAttempt.upsert({
        where: args.where,
        create: args.create,
        update: args.update,
        ...query,
      }),
  }),
);

export const upsertOneQuizAttemptMutation = defineMutation((t) => ({
  upsertOneQuizAttempt: t.prismaField(upsertOneQuizAttemptMutationObject(t)),
}));
