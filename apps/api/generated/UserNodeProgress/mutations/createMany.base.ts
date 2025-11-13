import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const createManyUserNodeProgressMutationArgs = builder.args((t) => ({ data: t.field({ type: [Inputs.UserNodeProgressCreateInput], required: true }) }))

export const createManyUserNodeProgressMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: ['UserNodeProgress'],
    nullable: false,
    args: createManyUserNodeProgressMutationArgs,
    resolve: async (_query, _root, args, _context, _info) =>
      await _context.prisma.$transaction(args.data.map((data) => _context.prisma.userNodeProgress.create({ data }))),
  }),
);

export const createManyUserNodeProgressMutation = defineMutation((t) => ({
  createManyUserNodeProgress: t.prismaField(createManyUserNodeProgressMutationObject(t)),
}));
