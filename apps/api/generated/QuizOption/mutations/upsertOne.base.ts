import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const upsertOneQuizOptionMutationArgs = builder.args((t) => ({
      where: t.field({ type: Inputs.QuizOptionWhereUniqueInput, required: true }),
      create: t.field({ type: Inputs.QuizOptionCreateInput, required: true }),
      update: t.field({ type: Inputs.QuizOptionUpdateInput, required: true }),
    }))

export const upsertOneQuizOptionMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'QuizOption',
    nullable: false,
    args: upsertOneQuizOptionMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.quizOption.upsert({
        where: args.where,
        create: args.create,
        update: args.update,
        ...query,
      }),
  }),
);

export const upsertOneQuizOptionMutation = defineMutation((t) => ({
  upsertOneQuizOption: t.prismaField(upsertOneQuizOptionMutationObject(t)),
}));
