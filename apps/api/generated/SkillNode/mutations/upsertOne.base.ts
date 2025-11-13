import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const upsertOneSkillNodeMutationArgs = builder.args((t) => ({
      where: t.field({ type: Inputs.SkillNodeWhereUniqueInput, required: true }),
      create: t.field({ type: Inputs.SkillNodeCreateInput, required: true }),
      update: t.field({ type: Inputs.SkillNodeUpdateInput, required: true }),
    }))

export const upsertOneSkillNodeMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'SkillNode',
    nullable: false,
    args: upsertOneSkillNodeMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.skillNode.upsert({
        where: args.where,
        create: args.create,
        update: args.update,
        ...query,
      }),
  }),
);

export const upsertOneSkillNodeMutation = defineMutation((t) => ({
  upsertOneSkillNode: t.prismaField(upsertOneSkillNodeMutationObject(t)),
}));
