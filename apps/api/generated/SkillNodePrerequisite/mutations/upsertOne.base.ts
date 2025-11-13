import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const upsertOneSkillNodePrerequisiteMutationArgs = builder.args((t) => ({
      where: t.field({ type: Inputs.SkillNodePrerequisiteWhereUniqueInput, required: true }),
      create: t.field({ type: Inputs.SkillNodePrerequisiteCreateInput, required: true }),
      update: t.field({ type: Inputs.SkillNodePrerequisiteUpdateInput, required: true }),
    }))

export const upsertOneSkillNodePrerequisiteMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'SkillNodePrerequisite',
    nullable: false,
    args: upsertOneSkillNodePrerequisiteMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.skillNodePrerequisite.upsert({
        where: args.where,
        create: args.create,
        update: args.update,
        ...query,
      }),
  }),
);

export const upsertOneSkillNodePrerequisiteMutation = defineMutation((t) => ({
  upsertOneSkillNodePrerequisite: t.prismaField(upsertOneSkillNodePrerequisiteMutationObject(t)),
}));
