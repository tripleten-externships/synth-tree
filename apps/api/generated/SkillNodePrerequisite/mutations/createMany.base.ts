import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const createManySkillNodePrerequisiteMutationArgs = builder.args((t) => ({ data: t.field({ type: [Inputs.SkillNodePrerequisiteCreateInput], required: true }) }))

export const createManySkillNodePrerequisiteMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: ['SkillNodePrerequisite'],
    nullable: false,
    args: createManySkillNodePrerequisiteMutationArgs,
    resolve: async (_query, _root, args, _context, _info) =>
      await _context.prisma.$transaction(args.data.map((data) => _context.prisma.skillNodePrerequisite.create({ data }))),
  }),
);

export const createManySkillNodePrerequisiteMutation = defineMutation((t) => ({
  createManySkillNodePrerequisite: t.prismaField(createManySkillNodePrerequisiteMutationObject(t)),
}));
