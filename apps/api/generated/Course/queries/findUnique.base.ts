import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineQuery, defineQueryFunction, defineQueryPrismaObject } from '../../utils';

export const findUniqueCourseQueryArgs = builder.args((t) => ({ where: t.field({ type: Inputs.CourseWhereUniqueInput, required: true }) }))

export const findUniqueCourseQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: 'Course',
    nullable: true,
    args: findUniqueCourseQueryArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.course.findUnique({ where: args.where, ...query }),
  }),
);

export const findUniqueCourseQuery = defineQuery((t) => ({
  findUniqueCourse: t.prismaField(findUniqueCourseQueryObject(t)),
}));
