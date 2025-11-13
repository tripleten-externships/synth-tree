import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const createOneSkillTreeMutationArgs = builder.args((t) => ({ data: t.field({ type: Inputs.SkillTreeCreateInput, required: true }) }))

export const createOneSkillTreeMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'SkillTree',
    nullable: false,
    args: createOneSkillTreeMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.skillTree.create({ data: args.data, ...query }),
  }),
);

export const createOneSkillTreeMutation = defineMutation((t) => ({
  createOneSkillTree: t.prismaField(createOneSkillTreeMutationObject(t)),
}));
