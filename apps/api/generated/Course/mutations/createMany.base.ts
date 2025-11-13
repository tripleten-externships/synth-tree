import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const createManyCourseMutationArgs = builder.args((t) => ({ data: t.field({ type: [Inputs.CourseCreateInput], required: true }) }))

export const createManyCourseMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: ['Course'],
    nullable: false,
    args: createManyCourseMutationArgs,
    resolve: async (_query, _root, args, _context, _info) =>
      await _context.prisma.$transaction(args.data.map((data) => _context.prisma.course.create({ data }))),
  }),
);

export const createManyCourseMutation = defineMutation((t) => ({
  createManyCourse: t.prismaField(createManyCourseMutationObject(t)),
}));
