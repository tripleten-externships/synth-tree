import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const upsertOneCourseMutationArgs = builder.args((t) => ({
      where: t.field({ type: Inputs.CourseWhereUniqueInput, required: true }),
      create: t.field({ type: Inputs.CourseCreateInput, required: true }),
      update: t.field({ type: Inputs.CourseUpdateInput, required: true }),
    }))

export const upsertOneCourseMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'Course',
    nullable: false,
    args: upsertOneCourseMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.course.upsert({
        where: args.where,
        create: args.create,
        update: args.update,
        ...query,
      }),
  }),
);

export const upsertOneCourseMutation = defineMutation((t) => ({
  upsertOneCourse: t.prismaField(upsertOneCourseMutationObject(t)),
}));
