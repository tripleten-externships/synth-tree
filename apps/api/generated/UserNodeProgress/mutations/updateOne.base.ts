import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const updateOneUserNodeProgressMutationArgs = builder.args((t) => ({
      where: t.field({ type: Inputs.UserNodeProgressWhereUniqueInput, required: true }),
      data: t.field({ type: Inputs.UserNodeProgressUpdateInput, required: true }),
    }))

export const updateOneUserNodeProgressMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'UserNodeProgress',
    nullable: true,
    args: updateOneUserNodeProgressMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.userNodeProgress.update({ where: args.where, data: args.data, ...query }),
  }),
);

export const updateOneUserNodeProgressMutation = defineMutation((t) => ({
  updateOneUserNodeProgress: t.prismaField(updateOneUserNodeProgressMutationObject(t)),
}));
