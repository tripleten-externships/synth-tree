import * as Inputs from '../../inputs';
import { BatchPayload } from '../../objects';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationObject } from '../../utils';

export const updateManyCourseMutationArgs = builder.args((t) => ({
      where: t.field({ type: Inputs.CourseWhereInput, required: false }),
      data: t.field({ type: Inputs.CourseUpdateManyMutationInput, required: true }),
    }))

export const updateManyCourseMutationObject = defineMutationFunction((t) =>
  defineMutationObject({
    type: BatchPayload,
    nullable: false,
    args: updateManyCourseMutationArgs,
    resolve: async (_root, args, _context, _info) =>
      await _context.prisma.course.updateMany({ where: args.where || undefined, data: args.data }),
  }),
);

export const updateManyCourseMutation = defineMutation((t) => ({
  updateManyCourse: t.field(updateManyCourseMutationObject(t)),
}));
