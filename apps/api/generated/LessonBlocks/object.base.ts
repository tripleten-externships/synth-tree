import * as Inputs from '../inputs';
import { builder } from '../../builder';
import {
  definePrismaObject,
  defineFieldObject,
  defineRelationFunction,
  defineRelationObject,
} from '../utils';

export const LessonBlocksObject = definePrismaObject('LessonBlocks', {
  description: undefined,
  findUnique: ({ id }) => ({ id }),
  fields: (t) => ({
    id: t.field(LessonBlocksIdFieldObject),
    nodeId: t.field(LessonBlocksNodeIdFieldObject),
    type: t.field(LessonBlocksTypeFieldObject),
    url: t.field(LessonBlocksUrlFieldObject),
    html: t.field(LessonBlocksHtmlFieldObject),
    caption: t.field(LessonBlocksCaptionFieldObject),
    order: t.field(LessonBlocksOrderFieldObject),
    meta: t.field(LessonBlocksMetaFieldObject),
    status: t.field(LessonBlocksStatusFieldObject),
    createdAt: t.field(LessonBlocksCreatedAtFieldObject),
    updatedAt: t.field(LessonBlocksUpdatedAtFieldObject),
    deletedAt: t.field(LessonBlocksDeletedAtFieldObject),
    node: t.relation('node', LessonBlocksNodeFieldObject),
  }),
});

export const LessonBlocksIdFieldObject = defineFieldObject('LessonBlocks', {
  type: "ID",
  description: undefined,
  nullable: false,
  resolve: (parent) => String(parent.id),
});

export const LessonBlocksNodeIdFieldObject = defineFieldObject('LessonBlocks', {
  type: "String",
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.nodeId,
});

export const LessonBlocksTypeFieldObject = defineFieldObject('LessonBlocks', {
  type: Inputs.ContentType,
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.type,
});

export const LessonBlocksUrlFieldObject = defineFieldObject('LessonBlocks', {
  type: "String",
  description: undefined,
  nullable: true,
  resolve: (parent) => parent.url,
});

export const LessonBlocksHtmlFieldObject = defineFieldObject('LessonBlocks', {
  type: "String",
  description: undefined,
  nullable: true,
  resolve: (parent) => parent.html,
});

export const LessonBlocksCaptionFieldObject = defineFieldObject('LessonBlocks', {
  type: "String",
  description: undefined,
  nullable: true,
  resolve: (parent) => parent.caption,
});

export const LessonBlocksOrderFieldObject = defineFieldObject('LessonBlocks', {
  type: "Int",
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.order,
});

export const LessonBlocksMetaFieldObject = defineFieldObject('LessonBlocks', {
  type: Inputs.Json,
  description: undefined,
  nullable: true,
  resolve: (parent) => parent.meta,
});

export const LessonBlocksStatusFieldObject = defineFieldObject('LessonBlocks', {
  type: Inputs.LessonStatus,
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.status,
});

export const LessonBlocksCreatedAtFieldObject = defineFieldObject('LessonBlocks', {
  type: Inputs.DateTime,
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.createdAt,
});

export const LessonBlocksUpdatedAtFieldObject = defineFieldObject('LessonBlocks', {
  type: Inputs.DateTime,
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.updatedAt,
});

export const LessonBlocksDeletedAtFieldObject = defineFieldObject('LessonBlocks', {
  type: Inputs.DateTime,
  description: undefined,
  nullable: true,
  resolve: (parent) => parent.deletedAt,
});

export const LessonBlocksNodeFieldObject = defineRelationObject('LessonBlocks', 'node', {
  description: undefined,
  nullable: false,
  args: undefined,
  query: undefined,
});
