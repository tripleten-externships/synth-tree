import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const upsertOneSkillTreeMutationArgs = builder.args((t) => ({
      where: t.field({ type: Inputs.SkillTreeWhereUniqueInput, required: true }),
      create: t.field({ type: Inputs.SkillTreeCreateInput, required: true }),
      update: t.field({ type: Inputs.SkillTreeUpdateInput, required: true }),
    }))

export const upsertOneSkillTreeMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'SkillTree',
    nullable: false,
    args: upsertOneSkillTreeMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.skillTree.upsert({
        where: args.where,
        create: args.create,
        update: args.update,
        ...query,
      }),
  }),
);

export const upsertOneSkillTreeMutation = defineMutation((t) => ({
  upsertOneSkillTree: t.prismaField(upsertOneSkillTreeMutationObject(t)),
}));
