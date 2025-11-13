import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const deleteOneUserMutationArgs = builder.args((t) => ({ where: t.field({ type: Inputs.UserWhereUniqueInput, required: true }) }))

export const deleteOneUserMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'User',
    nullable: true,
    args: deleteOneUserMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.user.delete({ where: args.where, ...query }),
  }),
);

export const deleteOneUserMutation = defineMutation((t) => ({
  deleteOneUser: t.prismaField(deleteOneUserMutationObject(t)),
}));
