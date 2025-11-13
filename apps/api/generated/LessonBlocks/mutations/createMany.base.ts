import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const createManyLessonBlocksMutationArgs = builder.args((t) => ({ data: t.field({ type: [Inputs.LessonBlocksCreateInput], required: true }) }))

export const createManyLessonBlocksMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: ['LessonBlocks'],
    nullable: false,
    args: createManyLessonBlocksMutationArgs,
    resolve: async (_query, _root, args, _context, _info) =>
      await _context.prisma.$transaction(args.data.map((data) => _context.prisma.lessonBlocks.create({ data }))),
  }),
);

export const createManyLessonBlocksMutation = defineMutation((t) => ({
  createManyLessonBlocks: t.prismaField(createManyLessonBlocksMutationObject(t)),
}));
