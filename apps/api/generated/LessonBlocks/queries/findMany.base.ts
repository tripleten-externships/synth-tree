import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineQuery, defineQueryFunction, defineQueryPrismaObject } from '../../utils';

export const findManyLessonBlocksQueryArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.LessonBlocksWhereInput, required: false }),
  orderBy: t.field({ type: [Inputs.LessonBlocksOrderByWithRelationInput], required: false }),
  cursor: t.field({ type: Inputs.LessonBlocksWhereUniqueInput, required: false }),
  take: t.field({ type: 'Int', required: false }),
  skip: t.field({ type: 'Int', required: false }),
  distinct: t.field({ type: [Inputs.LessonBlocksScalarFieldEnum], required: false }),
}))

export const findManyLessonBlocksQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: ['LessonBlocks'],
    nullable: false,
    args: findManyLessonBlocksQueryArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.lessonBlocks.findMany({
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

export const findManyLessonBlocksQuery = defineQuery((t) => ({
  findManyLessonBlocks: t.prismaField(findManyLessonBlocksQueryObject(t)),
}));
