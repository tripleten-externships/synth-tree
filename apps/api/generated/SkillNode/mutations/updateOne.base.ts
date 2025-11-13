import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const updateOneSkillNodeMutationArgs = builder.args((t) => ({
      where: t.field({ type: Inputs.SkillNodeWhereUniqueInput, required: true }),
      data: t.field({ type: Inputs.SkillNodeUpdateInput, required: true }),
    }))

export const updateOneSkillNodeMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'SkillNode',
    nullable: true,
    args: updateOneSkillNodeMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.skillNode.update({ where: args.where, data: args.data, ...query }),
  }),
);

export const updateOneSkillNodeMutation = defineMutation((t) => ({
  updateOneSkillNode: t.prismaField(updateOneSkillNodeMutationObject(t)),
}));
