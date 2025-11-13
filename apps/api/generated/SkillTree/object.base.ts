import * as Inputs from '../inputs';
import { builder } from '../../builder';
import {
  definePrismaObject,
  defineFieldObject,
  defineRelationFunction,
  defineRelationObject,
} from '../utils';

export const SkillTreeObject = definePrismaObject('SkillTree', {
  description: undefined,
  findUnique: ({ id }) => ({ id }),
  fields: (t) => ({
    id: t.field(SkillTreeIdFieldObject),
    courseId: t.field(SkillTreeCourseIdFieldObject),
    title: t.field(SkillTreeTitleFieldObject),
    description: t.field(SkillTreeDescriptionFieldObject),
    createdAt: t.field(SkillTreeCreatedAtFieldObject),
    updatedAt: t.field(SkillTreeUpdatedAtFieldObject),
    deletedAt: t.field(SkillTreeDeletedAtFieldObject),
    course: t.relation('course', SkillTreeCourseFieldObject),
    nodes: t.relation('nodes', SkillTreeNodesFieldObject(t)),
  }),
});

export const SkillTreeIdFieldObject = defineFieldObject('SkillTree', {
  type: "ID",
  description: undefined,
  nullable: false,
  resolve: (parent) => String(parent.id),
});

export const SkillTreeCourseIdFieldObject = defineFieldObject('SkillTree', {
  type: "String",
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.courseId,
});

export const SkillTreeTitleFieldObject = defineFieldObject('SkillTree', {
  type: "String",
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.title,
});

export const SkillTreeDescriptionFieldObject = defineFieldObject('SkillTree', {
  type: "String",
  description: undefined,
  nullable: true,
  resolve: (parent) => parent.description,
});

export const SkillTreeCreatedAtFieldObject = defineFieldObject('SkillTree', {
  type: Inputs.DateTime,
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.createdAt,
});

export const SkillTreeUpdatedAtFieldObject = defineFieldObject('SkillTree', {
  type: Inputs.DateTime,
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.updatedAt,
});

export const SkillTreeDeletedAtFieldObject = defineFieldObject('SkillTree', {
  type: Inputs.DateTime,
  description: undefined,
  nullable: true,
  resolve: (parent) => parent.deletedAt,
});

export const SkillTreeCourseFieldObject = defineRelationObject('SkillTree', 'course', {
  description: undefined,
  nullable: false,
  args: undefined,
  query: undefined,
});

export const SkillTreeNodesFieldArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.SkillNodeWhereInput, required: false }),
  orderBy: t.field({ type: [Inputs.SkillNodeOrderByWithRelationInput], required: false }),
  cursor: t.field({ type: Inputs.SkillNodeWhereUniqueInput, required: false }),
  take: t.field({ type: 'Int', required: false }),
  skip: t.field({ type: 'Int', required: false }),
  distinct: t.field({ type: [Inputs.SkillNodeScalarFieldEnum], required: false }),
}))

export const SkillTreeNodesFieldObject = defineRelationFunction('SkillTree', (t) =>
  defineRelationObject('SkillTree', 'nodes', {
    description: undefined,
    nullable: false,
    args: SkillTreeNodesFieldArgs,
    query: (args) => ({
      where: args.where || undefined,
      cursor: args.cursor || undefined,
      take: args.take || undefined,
      distinct: args.distinct || undefined,
      skip: args.skip || undefined,
      orderBy: args.orderBy || undefined,
    }),
  }),
);
