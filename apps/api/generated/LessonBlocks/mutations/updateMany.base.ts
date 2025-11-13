import * as Inputs from '../../inputs';
import { BatchPayload } from '../../objects';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationObject } from '../../utils';

export const updateManyLessonBlocksMutationArgs = builder.args((t) => ({
      where: t.field({ type: Inputs.LessonBlocksWhereInput, required: false }),
      data: t.field({ type: Inputs.LessonBlocksUpdateManyMutationInput, required: true }),
    }))

export const updateManyLessonBlocksMutationObject = defineMutationFunction((t) =>
  defineMutationObject({
    type: BatchPayload,
    nullable: false,
    args: updateManyLessonBlocksMutationArgs,
    resolve: async (_root, args, _context, _info) =>
      await _context.prisma.lessonBlocks.updateMany({ where: args.where || undefined, data: args.data }),
  }),
);

export const updateManyLessonBlocksMutation = defineMutation((t) => ({
  updateManyLessonBlocks: t.field(updateManyLessonBlocksMutationObject(t)),
}));
