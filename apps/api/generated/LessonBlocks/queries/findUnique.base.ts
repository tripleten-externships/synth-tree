import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineQuery, defineQueryFunction, defineQueryPrismaObject } from '../../utils';

export const findUniqueLessonBlocksQueryArgs = builder.args((t) => ({ where: t.field({ type: Inputs.LessonBlocksWhereUniqueInput, required: true }) }))

export const findUniqueLessonBlocksQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: 'LessonBlocks',
    nullable: true,
    args: findUniqueLessonBlocksQueryArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.lessonBlocks.findUnique({ where: args.where, ...query }),
  }),
);

export const findUniqueLessonBlocksQuery = defineQuery((t) => ({
  findUniqueLessonBlocks: t.prismaField(findUniqueLessonBlocksQueryObject(t)),
}));
