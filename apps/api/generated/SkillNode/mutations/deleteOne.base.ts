import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const deleteOneSkillNodeMutationArgs = builder.args((t) => ({ where: t.field({ type: Inputs.SkillNodeWhereUniqueInput, required: true }) }))

export const deleteOneSkillNodeMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'SkillNode',
    nullable: true,
    args: deleteOneSkillNodeMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.skillNode.delete({ where: args.where, ...query }),
  }),
);

export const deleteOneSkillNodeMutation = defineMutation((t) => ({
  deleteOneSkillNode: t.prismaField(deleteOneSkillNodeMutationObject(t)),
}));
