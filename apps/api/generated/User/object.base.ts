import * as Inputs from '../inputs';
import { builder } from '../../builder';
import {
  definePrismaObject,
  defineFieldObject,
  defineRelationFunction,
  defineRelationObject,
} from '../utils';

export const UserObject = definePrismaObject('User', {
  description: undefined,
  findUnique: ({ id }) => ({ id }),
  fields: (t) => ({
    id: t.field(UserIdFieldObject),
    email: t.field(UserEmailFieldObject),
    name: t.field(UserNameFieldObject),
    photoUrl: t.field(UserPhotoUrlFieldObject),
    role: t.field(UserRoleFieldObject),
    createdAt: t.field(UserCreatedAtFieldObject),
    updatedAt: t.field(UserUpdatedAtFieldObject),
    coursesAuthored: t.relation('coursesAuthored', UserCoursesAuthoredFieldObject(t)),
    nodeProgress: t.relation('nodeProgress', UserNodeProgressFieldObject(t)),
    quizAttempts: t.relation('quizAttempts', UserQuizAttemptsFieldObject(t)),
  }),
});

export const UserIdFieldObject = defineFieldObject('User', {
  type: "ID",
  description: undefined,
  nullable: false,
  resolve: (parent) => String(parent.id),
});

export const UserEmailFieldObject = defineFieldObject('User', {
  type: "String",
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.email,
});

export const UserNameFieldObject = defineFieldObject('User', {
  type: "String",
  description: undefined,
  nullable: true,
  resolve: (parent) => parent.name,
});

export const UserPhotoUrlFieldObject = defineFieldObject('User', {
  type: "String",
  description: undefined,
  nullable: true,
  resolve: (parent) => parent.photoUrl,
});

export const UserRoleFieldObject = defineFieldObject('User', {
  type: Inputs.Role,
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.role,
});

export const UserCreatedAtFieldObject = defineFieldObject('User', {
  type: Inputs.DateTime,
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.createdAt,
});

export const UserUpdatedAtFieldObject = defineFieldObject('User', {
  type: Inputs.DateTime,
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.updatedAt,
});

export const UserCoursesAuthoredFieldArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.CourseWhereInput, required: false }),
  orderBy: t.field({ type: [Inputs.CourseOrderByWithRelationInput], required: false }),
  cursor: t.field({ type: Inputs.CourseWhereUniqueInput, required: false }),
  take: t.field({ type: 'Int', required: false }),
  skip: t.field({ type: 'Int', required: false }),
  distinct: t.field({ type: [Inputs.CourseScalarFieldEnum], required: false }),
}))

export const UserCoursesAuthoredFieldObject = defineRelationFunction('User', (t) =>
  defineRelationObject('User', 'coursesAuthored', {
    description: undefined,
    nullable: false,
    args: UserCoursesAuthoredFieldArgs,
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

export const UserNodeProgressFieldArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.UserNodeProgressWhereInput, required: false }),
  orderBy: t.field({ type: [Inputs.UserNodeProgressOrderByWithRelationInput], required: false }),
  cursor: t.field({ type: Inputs.UserNodeProgressWhereUniqueInput, required: false }),
  take: t.field({ type: 'Int', required: false }),
  skip: t.field({ type: 'Int', required: false }),
  distinct: t.field({ type: [Inputs.UserNodeProgressScalarFieldEnum], required: false }),
}))

export const UserNodeProgressFieldObject = defineRelationFunction('User', (t) =>
  defineRelationObject('User', 'nodeProgress', {
    description: undefined,
    nullable: false,
    args: UserNodeProgressFieldArgs,
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

export const UserQuizAttemptsFieldArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.QuizAttemptWhereInput, required: false }),
  orderBy: t.field({ type: [Inputs.QuizAttemptOrderByWithRelationInput], required: false }),
  cursor: t.field({ type: Inputs.QuizAttemptWhereUniqueInput, required: false }),
  take: t.field({ type: 'Int', required: false }),
  skip: t.field({ type: 'Int', required: false }),
  distinct: t.field({ type: [Inputs.QuizAttemptScalarFieldEnum], required: false }),
}))

export const UserQuizAttemptsFieldObject = defineRelationFunction('User', (t) =>
  defineRelationObject('User', 'quizAttempts', {
    description: undefined,
    nullable: false,
    args: UserQuizAttemptsFieldArgs,
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
