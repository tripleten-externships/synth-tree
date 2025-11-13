import * as Inputs from '../inputs';
import { builder } from '../../builder';
import {
  definePrismaObject,
  defineFieldObject,
  defineRelationFunction,
  defineRelationObject,
} from '../utils';

export const CourseObject = definePrismaObject('Course', {
  description: undefined,
  findUnique: ({ id }) => ({ id }),
  fields: (t) => ({
    id: t.field(CourseIdFieldObject),
    title: t.field(CourseTitleFieldObject),
    description: t.field(CourseDescriptionFieldObject),
    authorId: t.field(CourseAuthorIdFieldObject),
    status: t.field(CourseStatusFieldObject),
    createdAt: t.field(CourseCreatedAtFieldObject),
    updatedAt: t.field(CourseUpdatedAtFieldObject),
    deletedAt: t.field(CourseDeletedAtFieldObject),
    author: t.relation('author', CourseAuthorFieldObject),
    trees: t.relation('trees', CourseTreesFieldObject(t)),
  }),
});

export const CourseIdFieldObject = defineFieldObject('Course', {
  type: "ID",
  description: undefined,
  nullable: false,
  resolve: (parent) => String(parent.id),
});

export const CourseTitleFieldObject = defineFieldObject('Course', {
  type: "String",
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.title,
});

export const CourseDescriptionFieldObject = defineFieldObject('Course', {
  type: "String",
  description: undefined,
  nullable: true,
  resolve: (parent) => parent.description,
});

export const CourseAuthorIdFieldObject = defineFieldObject('Course', {
  type: "String",
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.authorId,
});

export const CourseStatusFieldObject = defineFieldObject('Course', {
  type: Inputs.CourseStatus,
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.status,
});

export const CourseCreatedAtFieldObject = defineFieldObject('Course', {
  type: Inputs.DateTime,
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.createdAt,
});

export const CourseUpdatedAtFieldObject = defineFieldObject('Course', {
  type: Inputs.DateTime,
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.updatedAt,
});

export const CourseDeletedAtFieldObject = defineFieldObject('Course', {
  type: Inputs.DateTime,
  description: undefined,
  nullable: true,
  resolve: (parent) => parent.deletedAt,
});

export const CourseAuthorFieldObject = defineRelationObject('Course', 'author', {
  description: undefined,
  nullable: false,
  args: undefined,
  query: undefined,
});

export const CourseTreesFieldArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.SkillTreeWhereInput, required: false }),
  orderBy: t.field({ type: [Inputs.SkillTreeOrderByWithRelationInput], required: false }),
  cursor: t.field({ type: Inputs.SkillTreeWhereUniqueInput, required: false }),
  take: t.field({ type: 'Int', required: false }),
  skip: t.field({ type: 'Int', required: false }),
  distinct: t.field({ type: [Inputs.SkillTreeScalarFieldEnum], required: false }),
}))

export const CourseTreesFieldObject = defineRelationFunction('Course', (t) =>
  defineRelationObject('Course', 'trees', {
    description: undefined,
    nullable: false,
    args: CourseTreesFieldArgs,
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
