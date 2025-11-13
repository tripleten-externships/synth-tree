import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const updateOneLessonBlocksMutationArgs = builder.args((t) => ({
      where: t.field({ type: Inputs.LessonBlocksWhereUniqueInput, required: true }),
      data: t.field({ type: Inputs.LessonBlocksUpdateInput, required: true }),
    }))

export const updateOneLessonBlocksMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'LessonBlocks',
    nullable: true,
    args: updateOneLessonBlocksMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.lessonBlocks.update({ where: args.where, data: args.data, ...query }),
  }),
);

export const updateOneLessonBlocksMutation = defineMutation((t) => ({
  updateOneLessonBlocks: t.prismaField(updateOneLessonBlocksMutationObject(t)),
}));
