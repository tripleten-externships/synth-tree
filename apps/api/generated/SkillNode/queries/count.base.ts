import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineQuery, defineQueryFunction, defineQueryObject } from '../../utils';

export const countSkillNodeQueryArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.SkillNodeWhereInput, required: false }),
  orderBy: t.field({ type: [Inputs.SkillNodeOrderByWithRelationInput], required: false }),
  cursor: t.field({ type: Inputs.SkillNodeWhereUniqueInput, required: false }),
  take: t.field({ type: 'Int', required: false }),
  skip: t.field({ type: 'Int', required: false }),
  distinct: t.field({ type: [Inputs.SkillNodeScalarFieldEnum], required: false }),
}))

export const countSkillNodeQueryObject = defineQueryFunction((t) =>
  defineQueryObject({
    type: 'Int',
    nullable: false,
    args: countSkillNodeQueryArgs,
    resolve: async (_root, args, _context, _info) =>
      await _context.prisma.skillNode.count({
        where: args.where || undefined,
        cursor: args.cursor || undefined,
        take: args.take || undefined,
        skip: args.skip || undefined,
        orderBy: args.orderBy || undefined,
      }),
  }),
);

export const countSkillNodeQuery = defineQuery((t) => ({
  countSkillNode: t.field(countSkillNodeQueryObject(t)),
}));
