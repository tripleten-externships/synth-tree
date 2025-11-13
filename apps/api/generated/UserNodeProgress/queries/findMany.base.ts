import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineQuery, defineQueryFunction, defineQueryPrismaObject } from '../../utils';

export const findManyUserNodeProgressQueryArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.UserNodeProgressWhereInput, required: false }),
  orderBy: t.field({ type: [Inputs.UserNodeProgressOrderByWithRelationInput], required: false }),
  cursor: t.field({ type: Inputs.UserNodeProgressWhereUniqueInput, required: false }),
  take: t.field({ type: 'Int', required: false }),
  skip: t.field({ type: 'Int', required: false }),
  distinct: t.field({ type: [Inputs.UserNodeProgressScalarFieldEnum], required: false }),
}))

export const findManyUserNodeProgressQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: ['UserNodeProgress'],
    nullable: false,
    args: findManyUserNodeProgressQueryArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.userNodeProgress.findMany({
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

export const findManyUserNodeProgressQuery = defineQuery((t) => ({
  findManyUserNodeProgress: t.prismaField(findManyUserNodeProgressQueryObject(t)),
}));
