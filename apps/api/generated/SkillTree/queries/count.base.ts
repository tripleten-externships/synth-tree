import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineQuery, defineQueryFunction, defineQueryObject } from '../../utils';

export const countSkillTreeQueryArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.SkillTreeWhereInput, required: false }),
  orderBy: t.field({ type: [Inputs.SkillTreeOrderByWithRelationInput], required: false }),
  cursor: t.field({ type: Inputs.SkillTreeWhereUniqueInput, required: false }),
  take: t.field({ type: 'Int', required: false }),
  skip: t.field({ type: 'Int', required: false }),
  distinct: t.field({ type: [Inputs.SkillTreeScalarFieldEnum], required: false }),
}))

export const countSkillTreeQueryObject = defineQueryFunction((t) =>
  defineQueryObject({
    type: 'Int',
    nullable: false,
    args: countSkillTreeQueryArgs,
    resolve: async (_root, args, _context, _info) =>
      await _context.prisma.skillTree.count({
        where: args.where || undefined,
        cursor: args.cursor || undefined,
        take: args.take || undefined,
        skip: args.skip || undefined,
        orderBy: args.orderBy || undefined,
      }),
  }),
);

export const countSkillTreeQuery = defineQuery((t) => ({
  countSkillTree: t.field(countSkillTreeQueryObject(t)),
}));
