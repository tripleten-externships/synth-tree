import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const createOneQuizOptionMutationArgs = builder.args((t) => ({ data: t.field({ type: Inputs.QuizOptionCreateInput, required: true }) }))

export const createOneQuizOptionMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'QuizOption',
    nullable: false,
    args: createOneQuizOptionMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.quizOption.create({ data: args.data, ...query }),
  }),
);

export const createOneQuizOptionMutation = defineMutation((t) => ({
  createOneQuizOption: t.prismaField(createOneQuizOptionMutationObject(t)),
}));
