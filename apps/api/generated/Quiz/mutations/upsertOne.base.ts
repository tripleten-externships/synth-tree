import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const upsertOneQuizMutationArgs = builder.args((t) => ({
      where: t.field({ type: Inputs.QuizWhereUniqueInput, required: true }),
      create: t.field({ type: Inputs.QuizCreateInput, required: true }),
      update: t.field({ type: Inputs.QuizUpdateInput, required: true }),
    }))

export const upsertOneQuizMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'Quiz',
    nullable: false,
    args: upsertOneQuizMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.quiz.upsert({
        where: args.where,
        create: args.create,
        update: args.update,
        ...query,
      }),
  }),
);

export const upsertOneQuizMutation = defineMutation((t) => ({
  upsertOneQuiz: t.prismaField(upsertOneQuizMutationObject(t)),
}));
