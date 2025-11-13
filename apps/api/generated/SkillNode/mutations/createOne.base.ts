import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const createOneSkillNodeMutationArgs = builder.args((t) => ({ data: t.field({ type: Inputs.SkillNodeCreateInput, required: true }) }))

export const createOneSkillNodeMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'SkillNode',
    nullable: false,
    args: createOneSkillNodeMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.skillNode.create({ data: args.data, ...query }),
  }),
);

export const createOneSkillNodeMutation = defineMutation((t) => ({
  createOneSkillNode: t.prismaField(createOneSkillNodeMutationObject(t)),
}));
