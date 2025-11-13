import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const createManyQuizOptionMutationArgs = builder.args((t) => ({ data: t.field({ type: [Inputs.QuizOptionCreateInput], required: true }) }))

export const createManyQuizOptionMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: ['QuizOption'],
    nullable: false,
    args: createManyQuizOptionMutationArgs,
    resolve: async (_query, _root, args, _context, _info) =>
      await _context.prisma.$transaction(args.data.map((data) => _context.prisma.quizOption.create({ data }))),
  }),
);

export const createManyQuizOptionMutation = defineMutation((t) => ({
  createManyQuizOption: t.prismaField(createManyQuizOptionMutationObject(t)),
}));
