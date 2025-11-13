import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const upsertOneUserNodeProgressMutationArgs = builder.args((t) => ({
      where: t.field({ type: Inputs.UserNodeProgressWhereUniqueInput, required: true }),
      create: t.field({ type: Inputs.UserNodeProgressCreateInput, required: true }),
      update: t.field({ type: Inputs.UserNodeProgressUpdateInput, required: true }),
    }))

export const upsertOneUserNodeProgressMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'UserNodeProgress',
    nullable: false,
    args: upsertOneUserNodeProgressMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.userNodeProgress.upsert({
        where: args.where,
        create: args.create,
        update: args.update,
        ...query,
      }),
  }),
);

export const upsertOneUserNodeProgressMutation = defineMutation((t) => ({
  upsertOneUserNodeProgress: t.prismaField(upsertOneUserNodeProgressMutationObject(t)),
}));
