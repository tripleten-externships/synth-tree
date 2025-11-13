import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineQuery, defineQueryFunction, defineQueryObject } from '../../utils';

export const countSkillNodePrerequisiteQueryArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.SkillNodePrerequisiteWhereInput, required: false }),
  orderBy: t.field({ type: [Inputs.SkillNodePrerequisiteOrderByWithRelationInput], required: false }),
  cursor: t.field({ type: Inputs.SkillNodePrerequisiteWhereUniqueInput, required: false }),
  take: t.field({ type: 'Int', required: false }),
  skip: t.field({ type: 'Int', required: false }),
  distinct: t.field({ type: [Inputs.SkillNodePrerequisiteScalarFieldEnum], required: false }),
}))

export const countSkillNodePrerequisiteQueryObject = defineQueryFunction((t) =>
  defineQueryObject({
    type: 'Int',
    nullable: false,
    args: countSkillNodePrerequisiteQueryArgs,
    resolve: async (_root, args, _context, _info) =>
      await _context.prisma.skillNodePrerequisite.count({
        where: args.where || undefined,
        cursor: args.cursor || undefined,
        take: args.take || undefined,
        skip: args.skip || undefined,
        orderBy: args.orderBy || undefined,
      }),
  }),
);

export const countSkillNodePrerequisiteQuery = defineQuery((t) => ({
  countSkillNodePrerequisite: t.field(countSkillNodePrerequisiteQueryObject(t)),
}));
