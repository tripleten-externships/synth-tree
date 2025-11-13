import * as Inputs from '../../inputs';
import { BatchPayload } from '../../objects';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationObject } from '../../utils';

export const deleteManyUserNodeProgressMutationArgs = builder.args((t) => ({ where: t.field({ type: Inputs.UserNodeProgressWhereInput, required: true }) }))

export const deleteManyUserNodeProgressMutationObject = defineMutationFunction((t) =>
  defineMutationObject({
    type: BatchPayload,
    nullable: true,
    args: deleteManyUserNodeProgressMutationArgs,
    resolve: async (_root, args, _context, _info) =>
      await _context.prisma.userNodeProgress.deleteMany({ where: args.where }),
  }),
);

export const deleteManyUserNodeProgressMutation = defineMutation((t) => ({
  deleteManyUserNodeProgress: t.field(deleteManyUserNodeProgressMutationObject(t)),
}));
