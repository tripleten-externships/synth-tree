import * as Inputs from '../../inputs';
import { BatchPayload } from '../../objects';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationObject } from '../../utils';

export const updateManySkillNodePrerequisiteMutationArgs = builder.args((t) => ({
      where: t.field({ type: Inputs.SkillNodePrerequisiteWhereInput, required: false }),
      data: t.field({ type: Inputs.SkillNodePrerequisiteUpdateManyMutationInput, required: true }),
    }))

export const updateManySkillNodePrerequisiteMutationObject = defineMutationFunction((t) =>
  defineMutationObject({
    type: BatchPayload,
    nullable: false,
    args: updateManySkillNodePrerequisiteMutationArgs,
    resolve: async (_root, args, _context, _info) =>
      await _context.prisma.skillNodePrerequisite.updateMany({ where: args.where || undefined, data: args.data }),
  }),
);

export const updateManySkillNodePrerequisiteMutation = defineMutation((t) => ({
  updateManySkillNodePrerequisite: t.field(updateManySkillNodePrerequisiteMutationObject(t)),
}));
