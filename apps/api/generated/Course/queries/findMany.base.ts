import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineQuery, defineQueryFunction, defineQueryPrismaObject } from '../../utils';

export const findManyCourseQueryArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.CourseWhereInput, required: false }),
  orderBy: t.field({ type: [Inputs.CourseOrderByWithRelationInput], required: false }),
  cursor: t.field({ type: Inputs.CourseWhereUniqueInput, required: false }),
  take: t.field({ type: 'Int', required: false }),
  skip: t.field({ type: 'Int', required: false }),
  distinct: t.field({ type: [Inputs.CourseScalarFieldEnum], required: false }),
}))

export const findManyCourseQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: ['Course'],
    nullable: false,
    args: findManyCourseQueryArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.course.findMany({
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

export const findManyCourseQuery = defineQuery((t) => ({
  findManyCourse: t.prismaField(findManyCourseQueryObject(t)),
}));
