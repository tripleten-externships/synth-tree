import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineQuery, defineQueryFunction, defineQueryPrismaObject } from '../../utils';

export const findFirstCourseQueryArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.CourseWhereInput, required: false }),
  orderBy: t.field({ type: [Inputs.CourseOrderByWithRelationInput], required: false }),
  cursor: t.field({ type: Inputs.CourseWhereUniqueInput, required: false }),
  take: t.field({ type: 'Int', required: false }),
  skip: t.field({ type: 'Int', required: false }),
  distinct: t.field({ type: [Inputs.CourseScalarFieldEnum], required: false }),
}))

export const findFirstCourseQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: 'Course',
    nullable: true,
    args: findFirstCourseQueryArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.course.findFirst({
        where: args.where || undefined,
        cursor: args.cursor || undefined,
        take: args.take || undefined,
        distinct: args.distinct || undefined,
        skip: args.skip || undefined,
        orderBy: args.orderBy || undefined,
        ...query,
      }),
  }),
);

export const findFirstCourseQuery = defineQuery((t) => ({
  findFirstCourse: t.prismaField(findFirstCourseQueryObject(t)),
}));
