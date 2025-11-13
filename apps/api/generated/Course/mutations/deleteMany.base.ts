import * as Inputs from '../../inputs';
import { BatchPayload } from '../../objects';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationObject } from '../../utils';

export const deleteManyCourseMutationArgs = builder.args((t) => ({ where: t.field({ type: Inputs.CourseWhereInput, required: true }) }))

export const deleteManyCourseMutationObject = defineMutationFunction((t) =>
  defineMutationObject({
    type: BatchPayload,
    nullable: true,
    args: deleteManyCourseMutationArgs,
    resolve: async (_root, args, _context, _info) =>
      await _context.prisma.course.deleteMany({ where: args.where }),
  }),
);

export const deleteManyCourseMutation = defineMutation((t) => ({
  deleteManyCourse: t.field(deleteManyCourseMutationObject(t)),
}));
