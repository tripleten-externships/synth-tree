import * as Inputs from '../inputs';
import { builder } from '../../builder';
import {
  definePrismaObject,
  defineFieldObject,
  defineRelationFunction,
  defineRelationObject,
} from '../utils';

export const SkillNodePrerequisiteObject = definePrismaObject('SkillNodePrerequisite', {
  description: undefined,
  findUnique: (fields) => ({ nodeId_dependsOnNodeId: fields }),
  fields: (t) => ({
    nodeId: t.field(SkillNodePrerequisiteNodeIdFieldObject),
    dependsOnNodeId: t.field(SkillNodePrerequisiteDependsOnNodeIdFieldObject),
    node: t.relation('node', SkillNodePrerequisiteNodeFieldObject),
    dependsOn: t.relation('dependsOn', SkillNodePrerequisiteDependsOnFieldObject),
  }),
});

export const SkillNodePrerequisiteNodeIdFieldObject = defineFieldObject('SkillNodePrerequisite', {
  type: "String",
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.nodeId,
});

export const SkillNodePrerequisiteDependsOnNodeIdFieldObject = defineFieldObject('SkillNodePrerequisite', {
  type: "String",
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.dependsOnNodeId,
});

export const SkillNodePrerequisiteNodeFieldObject = defineRelationObject('SkillNodePrerequisite', 'node', {
  description: undefined,
  nullable: false,
  args: undefined,
  query: undefined,
});

export const SkillNodePrerequisiteDependsOnFieldObject = defineRelationObject('SkillNodePrerequisite', 'dependsOn', {
  description: undefined,
  nullable: false,
  args: undefined,
  query: undefined,
});
