import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const updateOneCourseMutationArgs = builder.args((t) => ({
      where: t.field({ type: Inputs.CourseWhereUniqueInput, required: true }),
      data: t.field({ type: Inputs.CourseUpdateInput, required: true }),
    }))

export const updateOneCourseMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'Course',
    nullable: true,
    args: updateOneCourseMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.course.update({ where: args.where, data: args.data, ...query }),
  }),
);

export const updateOneCourseMutation = defineMutation((t) => ({
  updateOneCourse: t.prismaField(updateOneCourseMutationObject(t)),
}));
