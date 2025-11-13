import * as Inputs from '../../inputs';
import { BatchPayload } from '../../objects';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationObject } from '../../utils';

export const deleteManyLessonBlocksMutationArgs = builder.args((t) => ({ where: t.field({ type: Inputs.LessonBlocksWhereInput, required: true }) }))

export const deleteManyLessonBlocksMutationObject = defineMutationFunction((t) =>
  defineMutationObject({
    type: BatchPayload,
    nullable: true,
    args: deleteManyLessonBlocksMutationArgs,
    resolve: async (_root, args, _context, _info) =>
      await _context.prisma.lessonBlocks.deleteMany({ where: args.where }),
  }),
);

export const deleteManyLessonBlocksMutation = defineMutation((t) => ({
  deleteManyLessonBlocks: t.field(deleteManyLessonBlocksMutationObject(t)),
}));
