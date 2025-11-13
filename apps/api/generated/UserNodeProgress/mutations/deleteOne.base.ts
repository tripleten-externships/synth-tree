import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const deleteOneUserNodeProgressMutationArgs = builder.args((t) => ({ where: t.field({ type: Inputs.UserNodeProgressWhereUniqueInput, required: true }) }))

export const deleteOneUserNodeProgressMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'UserNodeProgress',
    nullable: true,
    args: deleteOneUserNodeProgressMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.userNodeProgress.delete({ where: args.where, ...query }),
  }),
);

export const deleteOneUserNodeProgressMutation = defineMutation((t) => ({
  deleteOneUserNodeProgress: t.prismaField(deleteOneUserNodeProgressMutationObject(t)),
}));
