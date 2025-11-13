import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const createOneCourseMutationArgs = builder.args((t) => ({ data: t.field({ type: Inputs.CourseCreateInput, required: true }) }))

export const createOneCourseMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'Course',
    nullable: false,
    args: createOneCourseMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.course.create({ data: args.data, ...query }),
  }),
);

export const createOneCourseMutation = defineMutation((t) => ({
  createOneCourse: t.prismaField(createOneCourseMutationObject(t)),
}));
