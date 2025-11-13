import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineQuery, defineQueryFunction, defineQueryPrismaObject } from '../../utils';

export const findUniqueSkillNodePrerequisiteQueryArgs = builder.args((t) => ({ where: t.field({ type: Inputs.SkillNodePrerequisiteWhereUniqueInput, required: true }) }))

export const findUniqueSkillNodePrerequisiteQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: 'SkillNodePrerequisite',
    nullable: true,
    args: findUniqueSkillNodePrerequisiteQueryArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.skillNodePrerequisite.findUnique({ where: args.where, ...query }),
  }),
);

export const findUniqueSkillNodePrerequisiteQuery = defineQuery((t) => ({
  findUniqueSkillNodePrerequisite: t.prismaField(findUniqueSkillNodePrerequisiteQueryObject(t)),
}));
