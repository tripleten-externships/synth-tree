import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const createManySkillTreeMutationArgs = builder.args((t) => ({ data: t.field({ type: [Inputs.SkillTreeCreateInput], required: true }) }))

export const createManySkillTreeMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: ['SkillTree'],
    nullable: false,
    args: createManySkillTreeMutationArgs,
    resolve: async (_query, _root, args, _context, _info) =>
      await _context.prisma.$transaction(args.data.map((data) => _context.prisma.skillTree.create({ data }))),
  }),
);

export const createManySkillTreeMutation = defineMutation((t) => ({
  createManySkillTree: t.prismaField(createManySkillTreeMutationObject(t)),
}));
