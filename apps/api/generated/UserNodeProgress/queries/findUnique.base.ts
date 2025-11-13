import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineQuery, defineQueryFunction, defineQueryPrismaObject } from '../../utils';

export const findUniqueUserNodeProgressQueryArgs = builder.args((t) => ({ where: t.field({ type: Inputs.UserNodeProgressWhereUniqueInput, required: true }) }))

export const findUniqueUserNodeProgressQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: 'UserNodeProgress',
    nullable: true,
    args: findUniqueUserNodeProgressQueryArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.userNodeProgress.findUnique({ where: args.where, ...query }),
  }),
);

export const findUniqueUserNodeProgressQuery = defineQuery((t) => ({
  findUniqueUserNodeProgress: t.prismaField(findUniqueUserNodeProgressQueryObject(t)),
}));
