import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const createOneSkillNodePrerequisiteMutationArgs = builder.args((t) => ({ data: t.field({ type: Inputs.SkillNodePrerequisiteCreateInput, required: true }) }))

export const createOneSkillNodePrerequisiteMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'SkillNodePrerequisite',
    nullable: false,
    args: createOneSkillNodePrerequisiteMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.skillNodePrerequisite.create({ data: args.data, ...query }),
  }),
);

export const createOneSkillNodePrerequisiteMutation = defineMutation((t) => ({
  createOneSkillNodePrerequisite: t.prismaField(createOneSkillNodePrerequisiteMutationObject(t)),
}));
