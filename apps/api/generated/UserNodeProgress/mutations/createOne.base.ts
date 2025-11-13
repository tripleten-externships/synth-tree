import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const createOneUserNodeProgressMutationArgs = builder.args((t) => ({ data: t.field({ type: Inputs.UserNodeProgressCreateInput, required: true }) }))

export const createOneUserNodeProgressMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'UserNodeProgress',
    nullable: false,
    args: createOneUserNodeProgressMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.userNodeProgress.create({ data: args.data, ...query }),
  }),
);

export const createOneUserNodeProgressMutation = defineMutation((t) => ({
  createOneUserNodeProgress: t.prismaField(createOneUserNodeProgressMutationObject(t)),
}));
