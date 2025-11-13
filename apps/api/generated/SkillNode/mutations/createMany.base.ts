import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const createManySkillNodeMutationArgs = builder.args((t) => ({ data: t.field({ type: [Inputs.SkillNodeCreateInput], required: true }) }))

export const createManySkillNodeMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: ['SkillNode'],
    nullable: false,
    args: createManySkillNodeMutationArgs,
    resolve: async (_query, _root, args, _context, _info) =>
      await _context.prisma.$transaction(args.data.map((data) => _context.prisma.skillNode.create({ data }))),
  }),
);

export const createManySkillNodeMutation = defineMutation((t) => ({
  createManySkillNode: t.prismaField(createManySkillNodeMutationObject(t)),
}));
