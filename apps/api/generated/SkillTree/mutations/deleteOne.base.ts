import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const deleteOneSkillTreeMutationArgs = builder.args((t) => ({ where: t.field({ type: Inputs.SkillTreeWhereUniqueInput, required: true }) }))

export const deleteOneSkillTreeMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'SkillTree',
    nullable: true,
    args: deleteOneSkillTreeMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.skillTree.delete({ where: args.where, ...query }),
  }),
);

export const deleteOneSkillTreeMutation = defineMutation((t) => ({
  deleteOneSkillTree: t.prismaField(deleteOneSkillTreeMutationObject(t)),
}));
