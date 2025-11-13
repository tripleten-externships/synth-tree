import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineQuery, defineQueryFunction, defineQueryObject } from '../../utils';

export const countLessonBlocksQueryArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.LessonBlocksWhereInput, required: false }),
  orderBy: t.field({ type: [Inputs.LessonBlocksOrderByWithRelationInput], required: false }),
  cursor: t.field({ type: Inputs.LessonBlocksWhereUniqueInput, required: false }),
  take: t.field({ type: 'Int', required: false }),
  skip: t.field({ type: 'Int', required: false }),
  distinct: t.field({ type: [Inputs.LessonBlocksScalarFieldEnum], required: false }),
}))

export const countLessonBlocksQueryObject = defineQueryFunction((t) =>
  defineQueryObject({
    type: 'Int',
    nullable: false,
    args: countLessonBlocksQueryArgs,
    resolve: async (_root, args, _context, _info) =>
      await _context.prisma.lessonBlocks.count({
        where: args.where || undefined,
        cursor: args.cursor || undefined,
        take: args.take || undefined,
        skip: args.skip || undefined,
        orderBy: args.orderBy || undefined,
      }),
  }),
);

export const countLessonBlocksQuery = defineQuery((t) => ({
  countLessonBlocks: t.field(countLessonBlocksQueryObject(t)),
}));
