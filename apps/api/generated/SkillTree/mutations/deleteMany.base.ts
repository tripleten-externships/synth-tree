import * as Inputs from '../../inputs';
import { BatchPayload } from '../../objects';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationObject } from '../../utils';

export const deleteManySkillTreeMutationArgs = builder.args((t) => ({ where: t.field({ type: Inputs.SkillTreeWhereInput, required: true }) }))

export const deleteManySkillTreeMutationObject = defineMutationFunction((t) =>
  defineMutationObject({
    type: BatchPayload,
    nullable: true,
    args: deleteManySkillTreeMutationArgs,
    resolve: async (_root, args, _context, _info) =>
      await _context.prisma.skillTree.deleteMany({ where: args.where }),
  }),
);

export const deleteManySkillTreeMutation = defineMutation((t) => ({
  deleteManySkillTree: t.field(deleteManySkillTreeMutationObject(t)),
}));
