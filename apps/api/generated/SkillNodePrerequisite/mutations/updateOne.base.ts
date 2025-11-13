import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const updateOneSkillNodePrerequisiteMutationArgs = builder.args((t) => ({
      where: t.field({ type: Inputs.SkillNodePrerequisiteWhereUniqueInput, required: true }),
      data: t.field({ type: Inputs.SkillNodePrerequisiteUpdateInput, required: true }),
    }))

export const updateOneSkillNodePrerequisiteMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'SkillNodePrerequisite',
    nullable: true,
    args: updateOneSkillNodePrerequisiteMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.skillNodePrerequisite.update({ where: args.where, data: args.data, ...query }),
  }),
);

export const updateOneSkillNodePrerequisiteMutation = defineMutation((t) => ({
  updateOneSkillNodePrerequisite: t.prismaField(updateOneSkillNodePrerequisiteMutationObject(t)),
}));
