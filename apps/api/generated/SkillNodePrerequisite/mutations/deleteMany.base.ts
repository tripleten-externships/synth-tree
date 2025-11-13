import * as Inputs from '../../inputs';
import { BatchPayload } from '../../objects';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationObject } from '../../utils';

export const deleteManySkillNodePrerequisiteMutationArgs = builder.args((t) => ({ where: t.field({ type: Inputs.SkillNodePrerequisiteWhereInput, required: true }) }))

export const deleteManySkillNodePrerequisiteMutationObject = defineMutationFunction((t) =>
  defineMutationObject({
    type: BatchPayload,
    nullable: true,
    args: deleteManySkillNodePrerequisiteMutationArgs,
    resolve: async (_root, args, _context, _info) =>
      await _context.prisma.skillNodePrerequisite.deleteMany({ where: args.where }),
  }),
);

export const deleteManySkillNodePrerequisiteMutation = defineMutation((t) => ({
  deleteManySkillNodePrerequisite: t.field(deleteManySkillNodePrerequisiteMutationObject(t)),
}));
