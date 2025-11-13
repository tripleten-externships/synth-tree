import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const updateOneSkillTreeMutationArgs = builder.args((t) => ({
      where: t.field({ type: Inputs.SkillTreeWhereUniqueInput, required: true }),
      data: t.field({ type: Inputs.SkillTreeUpdateInput, required: true }),
    }))

export const updateOneSkillTreeMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'SkillTree',
    nullable: true,
    args: updateOneSkillTreeMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.skillTree.update({ where: args.where, data: args.data, ...query }),
  }),
);

export const updateOneSkillTreeMutation = defineMutation((t) => ({
  updateOneSkillTree: t.prismaField(updateOneSkillTreeMutationObject(t)),
}));
