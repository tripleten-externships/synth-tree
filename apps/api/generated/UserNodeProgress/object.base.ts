import * as Inputs from '../inputs';
import { builder } from '../../builder';
import {
  definePrismaObject,
  defineFieldObject,
  defineRelationFunction,
  defineRelationObject,
} from '../utils';

export const UserNodeProgressObject = definePrismaObject('UserNodeProgress', {
  description: undefined,
  findUnique: ({ id }) => ({ id }),
  fields: (t) => ({
    id: t.field(UserNodeProgressIdFieldObject),
    userId: t.field(UserNodeProgressUserIdFieldObject),
    nodeId: t.field(UserNodeProgressNodeIdFieldObject),
    status: t.field(UserNodeProgressStatusFieldObject),
    completedAt: t.field(UserNodeProgressCompletedAtFieldObject),
    createdAt: t.field(UserNodeProgressCreatedAtFieldObject),
    updatedAt: t.field(UserNodeProgressUpdatedAtFieldObject),
    user: t.relation('user', UserNodeProgressUserFieldObject),
    node: t.relation('node', UserNodeProgressNodeFieldObject),
  }),
});

export const UserNodeProgressIdFieldObject = defineFieldObject('UserNodeProgress', {
  type: "ID",
  description: undefined,
  nullable: false,
  resolve: (parent) => String(parent.id),
});

export const UserNodeProgressUserIdFieldObject = defineFieldObject('UserNodeProgress', {
  type: "String",
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.userId,
});

export const UserNodeProgressNodeIdFieldObject = defineFieldObject('UserNodeProgress', {
  type: "String",
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.nodeId,
});

export const UserNodeProgressStatusFieldObject = defineFieldObject('UserNodeProgress', {
  type: Inputs.ProgressStatus,
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.status,
});

export const UserNodeProgressCompletedAtFieldObject = defineFieldObject('UserNodeProgress', {
  type: Inputs.DateTime,
  description: undefined,
  nullable: true,
  resolve: (parent) => parent.completedAt,
});

export const UserNodeProgressCreatedAtFieldObject = defineFieldObject('UserNodeProgress', {
  type: Inputs.DateTime,
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.createdAt,
});

export const UserNodeProgressUpdatedAtFieldObject = defineFieldObject('UserNodeProgress', {
  type: Inputs.DateTime,
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.updatedAt,
});

export const UserNodeProgressUserFieldObject = defineRelationObject('UserNodeProgress', 'user', {
  description: undefined,
  nullable: false,
  args: undefined,
  query: undefined,
});

export const UserNodeProgressNodeFieldObject = defineRelationObject('UserNodeProgress', 'node', {
  description: undefined,
  nullable: false,
  args: undefined,
  query: undefined,
});
