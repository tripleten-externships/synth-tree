import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const deleteOneCourseMutationArgs = builder.args((t) => ({ where: t.field({ type: Inputs.CourseWhereUniqueInput, required: true }) }))

export const deleteOneCourseMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'Course',
    nullable: true,
    args: deleteOneCourseMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.course.delete({ where: args.where, ...query }),
  }),
);

export const deleteOneCourseMutation = defineMutation((t) => ({
  deleteOneCourse: t.prismaField(deleteOneCourseMutationObject(t)),
}));
