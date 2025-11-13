import * as Inputs from '../../inputs';
import { BatchPayload } from '../../objects';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationObject } from '../../utils';

export const updateManySkillNodeMutationArgs = builder.args((t) => ({
      where: t.field({ type: Inputs.SkillNodeWhereInput, required: false }),
      data: t.field({ type: Inputs.SkillNodeUpdateManyMutationInput, required: true }),
    }))

export const updateManySkillNodeMutationObject = defineMutationFunction((t) =>
  defineMutationObject({
    type: BatchPayload,
    nullable: false,
    args: updateManySkillNodeMutationArgs,
    resolve: async (_root, args, _context, _info) =>
      await _context.prisma.skillNode.updateMany({ where: args.where || undefined, data: args.data }),
  }),
);

export const updateManySkillNodeMutation = defineMutation((t) => ({
  updateManySkillNode: t.field(updateManySkillNodeMutationObject(t)),
}));
