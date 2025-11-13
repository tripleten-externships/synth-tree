import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineQuery, defineQueryFunction, defineQueryObject } from '../../utils';

export const countCourseQueryArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.CourseWhereInput, required: false }),
  orderBy: t.field({ type: [Inputs.CourseOrderByWithRelationInput], required: false }),
  cursor: t.field({ type: Inputs.CourseWhereUniqueInput, required: false }),
  take: t.field({ type: 'Int', required: false }),
  skip: t.field({ type: 'Int', required: false }),
  distinct: t.field({ type: [Inputs.CourseScalarFieldEnum], required: false }),
}))

export const countCourseQueryObject = defineQueryFunction((t) =>
  defineQueryObject({
    type: 'Int',
    nullable: false,
    args: countCourseQueryArgs,
    resolve: async (_root, args, _context, _info) =>
      await _context.prisma.course.count({
        where: args.where || undefined,
        cursor: args.cursor || undefined,
        take: args.take || undefined,
        skip: args.skip || undefined,
        orderBy: args.orderBy || undefined,
      }),
  }),
);

export const countCourseQuery = defineQuery((t) => ({
  countCourse: t.field(countCourseQueryObject(t)),
}));
