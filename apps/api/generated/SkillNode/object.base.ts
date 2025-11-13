import * as Inputs from '../inputs';
import { builder } from '../../builder';
import {
  definePrismaObject,
  defineFieldObject,
  defineRelationFunction,
  defineRelationObject,
} from '../utils';

export const SkillNodeObject = definePrismaObject('SkillNode', {
  description: undefined,
  findUnique: ({ id }) => ({ id }),
  fields: (t) => ({
    id: t.field(SkillNodeIdFieldObject),
    treeId: t.field(SkillNodeTreeIdFieldObject),
    title: t.field(SkillNodeTitleFieldObject),
    step: t.field(SkillNodeStepFieldObject),
    orderInStep: t.field(SkillNodeOrderInStepFieldObject),
    posX: t.field(SkillNodePosXFieldObject),
    posY: t.field(SkillNodePosYFieldObject),
    createdAt: t.field(SkillNodeCreatedAtFieldObject),
    updatedAt: t.field(SkillNodeUpdatedAtFieldObject),
    deletedAt: t.field(SkillNodeDeletedAtFieldObject),
    tree: t.relation('tree', SkillNodeTreeFieldObject),
    lessons: t.relation('lessons', SkillNodeLessonsFieldObject(t)),
    quiz: t.relation('quiz', SkillNodeQuizFieldObject),
    prerequisites: t.relation('prerequisites', SkillNodePrerequisitesFieldObject(t)),
    requiredFor: t.relation('requiredFor', SkillNodeRequiredForFieldObject(t)),
    progresses: t.relation('progresses', SkillNodeProgressesFieldObject(t)),
  }),
});

export const SkillNodeIdFieldObject = defineFieldObject('SkillNode', {
  type: "ID",
  description: undefined,
  nullable: false,
  resolve: (parent) => String(parent.id),
});

export const SkillNodeTreeIdFieldObject = defineFieldObject('SkillNode', {
  type: "String",
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.treeId,
});

export const SkillNodeTitleFieldObject = defineFieldObject('SkillNode', {
  type: "String",
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.title,
});

export const SkillNodeStepFieldObject = defineFieldObject('SkillNode', {
  type: "Int",
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.step,
});

export const SkillNodeOrderInStepFieldObject = defineFieldObject('SkillNode', {
  type: "Int",
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.orderInStep,
});

export const SkillNodePosXFieldObject = defineFieldObject('SkillNode', {
  type: "Int",
  description: undefined,
  nullable: true,
  resolve: (parent) => parent.posX,
});

export const SkillNodePosYFieldObject = defineFieldObject('SkillNode', {
  type: "Int",
  description: undefined,
  nullable: true,
  resolve: (parent) => parent.posY,
});

export const SkillNodeCreatedAtFieldObject = defineFieldObject('SkillNode', {
  type: Inputs.DateTime,
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.createdAt,
});

export const SkillNodeUpdatedAtFieldObject = defineFieldObject('SkillNode', {
  type: Inputs.DateTime,
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.updatedAt,
});

export const SkillNodeDeletedAtFieldObject = defineFieldObject('SkillNode', {
  type: Inputs.DateTime,
  description: undefined,
  nullable: true,
  resolve: (parent) => parent.deletedAt,
});

export const SkillNodeTreeFieldObject = defineRelationObject('SkillNode', 'tree', {
  description: undefined,
  nullable: false,
  args: undefined,
  query: undefined,
});

export const SkillNodeLessonsFieldArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.LessonBlocksWhereInput, required: false }),
  orderBy: t.field({ type: [Inputs.LessonBlocksOrderByWithRelationInput], required: false }),
  cursor: t.field({ type: Inputs.LessonBlocksWhereUniqueInput, required: false }),
  take: t.field({ type: 'Int', required: false }),
  skip: t.field({ type: 'Int', required: false }),
  distinct: t.field({ type: [Inputs.LessonBlocksScalarFieldEnum], required: false }),
}))

export const SkillNodeLessonsFieldObject = defineRelationFunction('SkillNode', (t) =>
  defineRelationObject('SkillNode', 'lessons', {
    description: undefined,
    nullable: false,
    args: SkillNodeLessonsFieldArgs,
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

export const SkillNodeQuizFieldObject = defineRelationObject('SkillNode', 'quiz', {
  description: undefined,
  nullable: true,
  args: undefined,
  query: undefined,
});

export const SkillNodePrerequisitesFieldArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.SkillNodePrerequisiteWhereInput, required: false }),
  orderBy: t.field({ type: [Inputs.SkillNodePrerequisiteOrderByWithRelationInput], required: false }),
  cursor: t.field({ type: Inputs.SkillNodePrerequisiteWhereUniqueInput, required: false }),
  take: t.field({ type: 'Int', required: false }),
  skip: t.field({ type: 'Int', required: false }),
  distinct: t.field({ type: [Inputs.SkillNodePrerequisiteScalarFieldEnum], required: false }),
}))

export const SkillNodePrerequisitesFieldObject = defineRelationFunction('SkillNode', (t) =>
  defineRelationObject('SkillNode', 'prerequisites', {
    description: undefined,
    nullable: false,
    args: SkillNodePrerequisitesFieldArgs,
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

export const SkillNodeRequiredForFieldArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.SkillNodePrerequisiteWhereInput, required: false }),
  orderBy: t.field({ type: [Inputs.SkillNodePrerequisiteOrderByWithRelationInput], required: false }),
  cursor: t.field({ type: Inputs.SkillNodePrerequisiteWhereUniqueInput, required: false }),
  take: t.field({ type: 'Int', required: false }),
  skip: t.field({ type: 'Int', required: false }),
  distinct: t.field({ type: [Inputs.SkillNodePrerequisiteScalarFieldEnum], required: false }),
}))

export const SkillNodeRequiredForFieldObject = defineRelationFunction('SkillNode', (t) =>
  defineRelationObject('SkillNode', 'requiredFor', {
    description: undefined,
    nullable: false,
    args: SkillNodeRequiredForFieldArgs,
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

export const SkillNodeProgressesFieldArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.UserNodeProgressWhereInput, required: false }),
  orderBy: t.field({ type: [Inputs.UserNodeProgressOrderByWithRelationInput], required: false }),
  cursor: t.field({ type: Inputs.UserNodeProgressWhereUniqueInput, required: false }),
  take: t.field({ type: 'Int', required: false }),
  skip: t.field({ type: 'Int', required: false }),
  distinct: t.field({ type: [Inputs.UserNodeProgressScalarFieldEnum], required: false }),
}))

export const SkillNodeProgressesFieldObject = defineRelationFunction('SkillNode', (t) =>
  defineRelationObject('SkillNode', 'progresses', {
    description: undefined,
    nullable: false,
    args: SkillNodeProgressesFieldArgs,
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
