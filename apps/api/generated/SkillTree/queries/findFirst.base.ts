import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineQuery, defineQueryFunction, defineQueryPrismaObject } from '../../utils';

export const findFirstSkillTreeQueryArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.SkillTreeWhereInput, required: false }),
  orderBy: t.field({ type: [Inputs.SkillTreeOrderByWithRelationInput], required: false }),
  cursor: t.field({ type: Inputs.SkillTreeWhereUniqueInput, required: false }),
  take: t.field({ type: 'Int', required: false }),
  skip: t.field({ type: 'Int', required: false }),
  distinct: t.field({ type: [Inputs.SkillTreeScalarFieldEnum], required: false }),
}))

export const findFirstSkillTreeQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: 'SkillTree',
    nullable: true,
    args: findFirstSkillTreeQueryArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.skillTree.findFirst({
        where: args.where || undefined,
        cursor: args.cursor || undefined,
        take: args.take || undefined,
        distinct: args.distinct || undefined,
        skip: args.skip || undefined,
        orderBy: args.orderBy || undefined,
        ...query,
      }),
  }),
);

export const findFirstSkillTreeQuery = defineQuery((t) => ({
  findFirstSkillTree: t.prismaField(findFirstSkillTreeQueryObject(t)),
}));
