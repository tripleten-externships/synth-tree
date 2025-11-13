import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineQuery, defineQueryFunction, defineQueryPrismaObject } from '../../utils';

export const findUniqueSkillNodeQueryArgs = builder.args((t) => ({ where: t.field({ type: Inputs.SkillNodeWhereUniqueInput, required: true }) }))

export const findUniqueSkillNodeQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: 'SkillNode',
    nullable: true,
    args: findUniqueSkillNodeQueryArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.skillNode.findUnique({ where: args.where, ...query }),
  }),
);

export const findUniqueSkillNodeQuery = defineQuery((t) => ({
  findUniqueSkillNode: t.prismaField(findUniqueSkillNodeQueryObject(t)),
}));
