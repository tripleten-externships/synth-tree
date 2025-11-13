import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineQuery, defineQueryFunction, defineQueryObject } from '../../utils';

export const countUserNodeProgressQueryArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.UserNodeProgressWhereInput, required: false }),
  orderBy: t.field({ type: [Inputs.UserNodeProgressOrderByWithRelationInput], required: false }),
  cursor: t.field({ type: Inputs.UserNodeProgressWhereUniqueInput, required: false }),
  take: t.field({ type: 'Int', required: false }),
  skip: t.field({ type: 'Int', required: false }),
  distinct: t.field({ type: [Inputs.UserNodeProgressScalarFieldEnum], required: false }),
}))

export const countUserNodeProgressQueryObject = defineQueryFunction((t) =>
  defineQueryObject({
    type: 'Int',
    nullable: false,
    args: countUserNodeProgressQueryArgs,
    resolve: async (_root, args, _context, _info) =>
      await _context.prisma.userNodeProgress.count({
        where: args.where || undefined,
        cursor: args.cursor || undefined,
        take: args.take || undefined,
        skip: args.skip || undefined,
        orderBy: args.orderBy || undefined,
      }),
  }),
);

export const countUserNodeProgressQuery = defineQuery((t) => ({
  countUserNodeProgress: t.field(countUserNodeProgressQueryObject(t)),
}));
