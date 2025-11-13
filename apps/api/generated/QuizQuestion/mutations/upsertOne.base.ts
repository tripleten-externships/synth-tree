import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const upsertOneQuizQuestionMutationArgs = builder.args((t) => ({
      where: t.field({ type: Inputs.QuizQuestionWhereUniqueInput, required: true }),
      create: t.field({ type: Inputs.QuizQuestionCreateInput, required: true }),
      update: t.field({ type: Inputs.QuizQuestionUpdateInput, required: true }),
    }))

export const upsertOneQuizQuestionMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'QuizQuestion',
    nullable: false,
    args: upsertOneQuizQuestionMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.quizQuestion.upsert({
        where: args.where,
        create: args.create,
        update: args.update,
        ...query,
      }),
  }),
);

export const upsertOneQuizQuestionMutation = defineMutation((t) => ({
  upsertOneQuizQuestion: t.prismaField(upsertOneQuizQuestionMutationObject(t)),
}));
