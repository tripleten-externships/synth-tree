import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const createManyQuizQuestionMutationArgs = builder.args((t) => ({ data: t.field({ type: [Inputs.QuizQuestionCreateInput], required: true }) }))

export const createManyQuizQuestionMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: ['QuizQuestion'],
    nullable: false,
    args: createManyQuizQuestionMutationArgs,
    resolve: async (_query, _root, args, _context, _info) =>
      await _context.prisma.$transaction(args.data.map((data) => _context.prisma.quizQuestion.create({ data }))),
  }),
);

export const createManyQuizQuestionMutation = defineMutation((t) => ({
  createManyQuizQuestion: t.prismaField(createManyQuizQuestionMutationObject(t)),
}));
