import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const deleteOneSkillNodePrerequisiteMutationArgs = builder.args((t) => ({ where: t.field({ type: Inputs.SkillNodePrerequisiteWhereUniqueInput, required: true }) }))

export const deleteOneSkillNodePrerequisiteMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'SkillNodePrerequisite',
    nullable: true,
    args: deleteOneSkillNodePrerequisiteMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.skillNodePrerequisite.delete({ where: args.where, ...query }),
  }),
);

export const deleteOneSkillNodePrerequisiteMutation = defineMutation((t) => ({
  deleteOneSkillNodePrerequisite: t.prismaField(deleteOneSkillNodePrerequisiteMutationObject(t)),
}));
