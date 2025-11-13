import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineQuery, defineQueryFunction, defineQueryPrismaObject } from '../../utils';

export const findFirstSkillNodeQueryArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.SkillNodeWhereInput, required: false }),
  orderBy: t.field({ type: [Inputs.SkillNodeOrderByWithRelationInput], required: false }),
  cursor: t.field({ type: Inputs.SkillNodeWhereUniqueInput, required: false }),
  take: t.field({ type: 'Int', required: false }),
  skip: t.field({ type: 'Int', required: false }),
  distinct: t.field({ type: [Inputs.SkillNodeScalarFieldEnum], required: false }),
}))

export const findFirstSkillNodeQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: 'SkillNode',
    nullable: true,
    args: findFirstSkillNodeQueryArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.skillNode.findFirst({
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

export const findFirstSkillNodeQuery = defineQuery((t) => ({
  findFirstSkillNode: t.prismaField(findFirstSkillNodeQueryObject(t)),
}));
