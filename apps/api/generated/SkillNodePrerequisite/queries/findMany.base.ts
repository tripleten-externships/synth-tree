import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineQuery, defineQueryFunction, defineQueryPrismaObject } from '../../utils';

export const findManySkillNodePrerequisiteQueryArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.SkillNodePrerequisiteWhereInput, required: false }),
  orderBy: t.field({ type: [Inputs.SkillNodePrerequisiteOrderByWithRelationInput], required: false }),
  cursor: t.field({ type: Inputs.SkillNodePrerequisiteWhereUniqueInput, required: false }),
  take: t.field({ type: 'Int', required: false }),
  skip: t.field({ type: 'Int', required: false }),
  distinct: t.field({ type: [Inputs.SkillNodePrerequisiteScalarFieldEnum], required: false }),
}))

export const findManySkillNodePrerequisiteQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: ['SkillNodePrerequisite'],
    nullable: false,
    args: findManySkillNodePrerequisiteQueryArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.skillNodePrerequisite.findMany({
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

export const findManySkillNodePrerequisiteQuery = defineQuery((t) => ({
  findManySkillNodePrerequisite: t.prismaField(findManySkillNodePrerequisiteQueryObject(t)),
}));
