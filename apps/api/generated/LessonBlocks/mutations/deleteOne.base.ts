import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const deleteOneLessonBlocksMutationArgs = builder.args((t) => ({ where: t.field({ type: Inputs.LessonBlocksWhereUniqueInput, required: true }) }))

export const deleteOneLessonBlocksMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'LessonBlocks',
    nullable: true,
    args: deleteOneLessonBlocksMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.lessonBlocks.delete({ where: args.where, ...query }),
  }),
);

export const deleteOneLessonBlocksMutation = defineMutation((t) => ({
  deleteOneLessonBlocks: t.prismaField(deleteOneLessonBlocksMutationObject(t)),
}));
