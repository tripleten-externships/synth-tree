import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const createManyQuizMutationArgs = builder.args((t) => ({ data: t.field({ type: [Inputs.QuizCreateInput], required: true }) }))

export const createManyQuizMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: ['Quiz'],
    nullable: false,
    args: createManyQuizMutationArgs,
    resolve: async (_query, _root, args, _context, _info) =>
      await _context.prisma.$transaction(args.data.map((data) => _context.prisma.quiz.create({ data }))),
  }),
);

export const createManyQuizMutation = defineMutation((t) => ({
  createManyQuiz: t.prismaField(createManyQuizMutationObject(t)),
}));
