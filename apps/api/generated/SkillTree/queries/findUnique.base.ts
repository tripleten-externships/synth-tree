import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineQuery, defineQueryFunction, defineQueryPrismaObject } from '../../utils';

export const findUniqueSkillTreeQueryArgs = builder.args((t) => ({ where: t.field({ type: Inputs.SkillTreeWhereUniqueInput, required: true }) }))

export const findUniqueSkillTreeQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: 'SkillTree',
    nullable: true,
    args: findUniqueSkillTreeQueryArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.skillTree.findUnique({ where: args.where, ...query }),
  }),
);

export const findUniqueSkillTreeQuery = defineQuery((t) => ({
  findUniqueSkillTree: t.prismaField(findUniqueSkillTreeQueryObject(t)),
}));
