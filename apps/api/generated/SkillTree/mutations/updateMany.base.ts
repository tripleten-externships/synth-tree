import * as Inputs from '../../inputs';
import { BatchPayload } from '../../objects';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationObject } from '../../utils';

export const updateManySkillTreeMutationArgs = builder.args((t) => ({
      where: t.field({ type: Inputs.SkillTreeWhereInput, required: false }),
      data: t.field({ type: Inputs.SkillTreeUpdateManyMutationInput, required: true }),
    }))

export const updateManySkillTreeMutationObject = defineMutationFunction((t) =>
  defineMutationObject({
    type: BatchPayload,
    nullable: false,
    args: updateManySkillTreeMutationArgs,
    resolve: async (_root, args, _context, _info) =>
      await _context.prisma.skillTree.updateMany({ where: args.where || undefined, data: args.data }),
  }),
);

export const updateManySkillTreeMutation = defineMutation((t) => ({
  updateManySkillTree: t.field(updateManySkillTreeMutationObject(t)),
}));
