import * as Inputs from '../../inputs';
import { BatchPayload } from '../../objects';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationObject } from '../../utils';

export const updateManyUserNodeProgressMutationArgs = builder.args((t) => ({
      where: t.field({ type: Inputs.UserNodeProgressWhereInput, required: false }),
      data: t.field({ type: Inputs.UserNodeProgressUpdateManyMutationInput, required: true }),
    }))

export const updateManyUserNodeProgressMutationObject = defineMutationFunction((t) =>
  defineMutationObject({
    type: BatchPayload,
    nullable: false,
    args: updateManyUserNodeProgressMutationArgs,
    resolve: async (_root, args, _context, _info) =>
      await _context.prisma.userNodeProgress.updateMany({ where: args.where || undefined, data: args.data }),
  }),
);

export const updateManyUserNodeProgressMutation = defineMutation((t) => ({
  updateManyUserNodeProgress: t.field(updateManyUserNodeProgressMutationObject(t)),
}));
