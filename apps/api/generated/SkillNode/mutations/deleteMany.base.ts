import * as Inputs from '../../inputs';
import { BatchPayload } from '../../objects';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationObject } from '../../utils';

export const deleteManySkillNodeMutationArgs = builder.args((t) => ({ where: t.field({ type: Inputs.SkillNodeWhereInput, required: true }) }))

export const deleteManySkillNodeMutationObject = defineMutationFunction((t) =>
  defineMutationObject({
    type: BatchPayload,
    nullable: true,
    args: deleteManySkillNodeMutationArgs,
    resolve: async (_root, args, _context, _info) =>
      await _context.prisma.skillNode.deleteMany({ where: args.where }),
  }),
);

export const deleteManySkillNodeMutation = defineMutation((t) => ({
  deleteManySkillNode: t.field(deleteManySkillNodeMutationObject(t)),
}));
