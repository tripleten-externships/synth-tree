// @ts-nocheck
import { Prisma } from '.prisma/client';

import { builder } from '../builder';

type Filters = {
  string: Prisma.StringFieldUpdateOperationsInput;
  nullableString: Prisma.NullableStringFieldUpdateOperationsInput;
  dateTime: Prisma.DateTimeFieldUpdateOperationsInput;
  nullableDateTime: Prisma.NullableDateTimeFieldUpdateOperationsInput;
  int: Prisma.IntFieldUpdateOperationsInput;
  nullableInt: Prisma.NullableIntFieldUpdateOperationsInput;
  bool: Prisma.BoolFieldUpdateOperationsInput;
  nullableBool: Prisma.NullableBoolFieldUpdateOperationsInput;
  bigInt: Prisma.BigIntFieldUpdateOperationsInput;
  nullableBigInt: Prisma.NullableBigIntFieldUpdateOperationsInput;
  bytes: Prisma.BytesFieldUpdateOperationsInput;
  nullableBytes: Prisma.NullableBytesFieldUpdateOperationsInput;
  float: Prisma.FloatFieldUpdateOperationsInput;
  nullableFloat: Prisma.NullableFloatFieldUpdateOperationsInput;
  decimal: Prisma.DecimalFieldUpdateOperationsInput;
  nullableDecimal: Prisma.NullableDecimalFieldUpdateOperationsInput;
};

type ApplyFilters<InputField> = {
  [F in keyof Filters]: 0 extends 1 & Filters[F]
    ? never
    : Filters[F] extends InputField
    ? Filters[F]
    : never;
}[keyof Filters];

type PrismaUpdateOperationsInputFilter<T extends object> = {
  [K in keyof T]: [ApplyFilters<T[K]>] extends [never] ? T[K] : ApplyFilters<T[K]>
};

export const DateTime = builder.scalarType('DateTime', {
  parseValue: (value) => {
    try {
      const date = new Date(value)
      if (date.toString() === 'Invalid Date') throw new Error('Invalid Date')
      return date
    } catch (error) {
      throw new Error('Invalid Date');
    }
  },
  serialize: (value) => value ? new Date(value) : null,
});

export const Json = builder.scalarType('Json', {
  serialize: (value) => value,
});

export const NEVER = builder.scalarType('NEVER', {
  serialize: (value) => value,
  description: 'Never fill this, its created for inputs that dont have fields',
});

export const TransactionIsolationLevel = builder.enumType('TransactionIsolationLevel', {
  values: ["ReadUncommitted","ReadCommitted","RepeatableRead","Serializable"] as const,
});

export const UserScalarFieldEnum = builder.enumType('UserScalarFieldEnum', {
  values: ["id","email","name","photoUrl","role","createdAt","updatedAt"] as const,
});

export const CourseScalarFieldEnum = builder.enumType('CourseScalarFieldEnum', {
  values: ["id","title","description","authorId","status","createdAt","updatedAt","deletedAt"] as const,
});

export const SkillTreeScalarFieldEnum = builder.enumType('SkillTreeScalarFieldEnum', {
  values: ["id","courseId","title","description","createdAt","updatedAt","deletedAt"] as const,
});

export const SkillNodeScalarFieldEnum = builder.enumType('SkillNodeScalarFieldEnum', {
  values: ["id","treeId","title","step","orderInStep","posX","posY","createdAt","updatedAt","deletedAt"] as const,
});

export const SkillNodePrerequisiteScalarFieldEnum = builder.enumType('SkillNodePrerequisiteScalarFieldEnum', {
  values: ["nodeId","dependsOnNodeId"] as const,
});

export const LessonBlocksScalarFieldEnum = builder.enumType('LessonBlocksScalarFieldEnum', {
  values: ["id","nodeId","type","url","html","caption","order","meta","status","createdAt","updatedAt","deletedAt"] as const,
});

export const QuizScalarFieldEnum = builder.enumType('QuizScalarFieldEnum', {
  values: ["id","nodeId","title","required","createdAt","updatedAt","deletedAt"] as const,
});

export const QuizQuestionScalarFieldEnum = builder.enumType('QuizQuestionScalarFieldEnum', {
  values: ["id","quizId","type","prompt","order","createdAt","updatedAt"] as const,
});

export const QuizOptionScalarFieldEnum = builder.enumType('QuizOptionScalarFieldEnum', {
  values: ["id","questionId","text","isCorrect","createdAt","updatedAt"] as const,
});

export const QuizAttemptScalarFieldEnum = builder.enumType('QuizAttemptScalarFieldEnum', {
  values: ["id","quizId","userId","passed","takenAt"] as const,
});

export const QuizAttemptAnswerScalarFieldEnum = builder.enumType('QuizAttemptAnswerScalarFieldEnum', {
  values: ["id","attemptId","questionId","answer","isCorrect"] as const,
});

export const UserNodeProgressScalarFieldEnum = builder.enumType('UserNodeProgressScalarFieldEnum', {
  values: ["id","userId","nodeId","status","completedAt","createdAt","updatedAt"] as const,
});

export const SortOrder = builder.enumType('SortOrder', {
  values: ["asc","desc"] as const,
});

export const NullableJsonNullValueInput = builder.enumType('NullableJsonNullValueInput', {
  values: ["DbNull","JsonNull"] as const,
});

export const QueryMode = builder.enumType('QueryMode', {
  values: ["default","insensitive"] as const,
});

export const NullsOrder = builder.enumType('NullsOrder', {
  values: ["first","last"] as const,
});

export const JsonNullValueFilter = builder.enumType('JsonNullValueFilter', {
  values: ["DbNull","JsonNull","AnyNull"] as const,
});

export const Role = builder.enumType('Role', {
  values: ["ADMIN","USER"] as const,
});

export const QuestionType = builder.enumType('QuestionType', {
  values: ["SINGLE_CHOICE","MULTIPLE_CHOICE","OPEN_QUESTION"] as const,
});

export const ContentType = builder.enumType('ContentType', {
  values: ["IMAGE","VIDEO","EMBED","HTML"] as const,
});

export const LessonStatus = builder.enumType('LessonStatus', {
  values: ["DRAFT","PUBLISHED"] as const,
});

export const CourseStatus = builder.enumType('CourseStatus', {
  values: ["DRAFT","PUBLISHED"] as const,
});

export const ProgressStatus = builder.enumType('ProgressStatus', {
  values: ["NOT_STARTED","IN_PROGRESS","COMPLETED"] as const,
});

export const UserWhereInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[UserWhereInput]}),
  OR: t.field({"required":false,"type":[UserWhereInput]}),
  NOT: t.field({"required":false,"type":[UserWhereInput]}),
  id: t.field({"required":false,"type":StringFilter}),
  email: t.field({"required":false,"type":StringFilter}),
  name: t.field({"required":false,"type":StringNullableFilter}),
  photoUrl: t.field({"required":false,"type":StringNullableFilter}),
  role: t.field({"required":false,"type":EnumRoleFilter}),
  createdAt: t.field({"required":false,"type":DateTimeFilter}),
  updatedAt: t.field({"required":false,"type":DateTimeFilter}),
  coursesAuthored: t.field({"required":false,"type":CourseListRelationFilter}),
  nodeProgress: t.field({"required":false,"type":UserNodeProgressListRelationFilter}),
  quizAttempts: t.field({"required":false,"type":QuizAttemptListRelationFilter}),
});
export const UserWhereInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserWhereInput>, false>('UserWhereInput').implement({
  fields: UserWhereInputFields,
});

export const UserOrderByWithRelationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  email: t.field({"required":false,"type":SortOrder}),
  name: t.field({"required":false,"type":SortOrder}),
  photoUrl: t.field({"required":false,"type":SortOrder}),
  role: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
  coursesAuthored: t.field({"required":false,"type":CourseOrderByRelationAggregateInput}),
  nodeProgress: t.field({"required":false,"type":UserNodeProgressOrderByRelationAggregateInput}),
  quizAttempts: t.field({"required":false,"type":QuizAttemptOrderByRelationAggregateInput}),
});
export const UserOrderByWithRelationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserOrderByWithRelationInput>, false>('UserOrderByWithRelationInput').implement({
  fields: UserOrderByWithRelationInputFields,
});

export const UserWhereUniqueInputFields = (t: any) => ({
  id: t.string({"required":false}),
  email: t.string({"required":false}),
  AND: t.field({"required":false,"type":[UserWhereInput]}),
  OR: t.field({"required":false,"type":[UserWhereInput]}),
  NOT: t.field({"required":false,"type":[UserWhereInput]}),
  name: t.field({"required":false,"type":StringNullableFilter}),
  photoUrl: t.field({"required":false,"type":StringNullableFilter}),
  role: t.field({"required":false,"type":EnumRoleFilter}),
  createdAt: t.field({"required":false,"type":DateTimeFilter}),
  updatedAt: t.field({"required":false,"type":DateTimeFilter}),
  coursesAuthored: t.field({"required":false,"type":CourseListRelationFilter}),
  nodeProgress: t.field({"required":false,"type":UserNodeProgressListRelationFilter}),
  quizAttempts: t.field({"required":false,"type":QuizAttemptListRelationFilter}),
});
export const UserWhereUniqueInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserWhereUniqueInput>, false>('UserWhereUniqueInput').implement({
  fields: UserWhereUniqueInputFields,
});

export const UserOrderByWithAggregationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  email: t.field({"required":false,"type":SortOrder}),
  name: t.field({"required":false,"type":SortOrder}),
  photoUrl: t.field({"required":false,"type":SortOrder}),
  role: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
  _count: t.field({"required":false,"type":UserCountOrderByAggregateInput}),
  _max: t.field({"required":false,"type":UserMaxOrderByAggregateInput}),
  _min: t.field({"required":false,"type":UserMinOrderByAggregateInput}),
});
export const UserOrderByWithAggregationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserOrderByWithAggregationInput>, false>('UserOrderByWithAggregationInput').implement({
  fields: UserOrderByWithAggregationInputFields,
});

export const UserScalarWhereWithAggregatesInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[UserScalarWhereWithAggregatesInput]}),
  OR: t.field({"required":false,"type":[UserScalarWhereWithAggregatesInput]}),
  NOT: t.field({"required":false,"type":[UserScalarWhereWithAggregatesInput]}),
  id: t.field({"required":false,"type":StringWithAggregatesFilter}),
  email: t.field({"required":false,"type":StringWithAggregatesFilter}),
  name: t.field({"required":false,"type":StringNullableWithAggregatesFilter}),
  photoUrl: t.field({"required":false,"type":StringNullableWithAggregatesFilter}),
  role: t.field({"required":false,"type":EnumRoleWithAggregatesFilter}),
  createdAt: t.field({"required":false,"type":DateTimeWithAggregatesFilter}),
  updatedAt: t.field({"required":false,"type":DateTimeWithAggregatesFilter}),
});
export const UserScalarWhereWithAggregatesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserScalarWhereWithAggregatesInput>, false>('UserScalarWhereWithAggregatesInput').implement({
  fields: UserScalarWhereWithAggregatesInputFields,
});

export const CourseWhereInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[CourseWhereInput]}),
  OR: t.field({"required":false,"type":[CourseWhereInput]}),
  NOT: t.field({"required":false,"type":[CourseWhereInput]}),
  id: t.field({"required":false,"type":UuidFilter}),
  title: t.field({"required":false,"type":StringFilter}),
  description: t.field({"required":false,"type":StringNullableFilter}),
  authorId: t.field({"required":false,"type":StringFilter}),
  status: t.field({"required":false,"type":EnumCourseStatusFilter}),
  createdAt: t.field({"required":false,"type":DateTimeFilter}),
  updatedAt: t.field({"required":false,"type":DateTimeFilter}),
  deletedAt: t.field({"required":false,"type":DateTimeNullableFilter}),
  author: t.field({"required":false,"type":UserWhereInput}),
  trees: t.field({"required":false,"type":SkillTreeListRelationFilter}),
});
export const CourseWhereInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CourseWhereInput>, false>('CourseWhereInput').implement({
  fields: CourseWhereInputFields,
});

export const CourseOrderByWithRelationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  title: t.field({"required":false,"type":SortOrder}),
  description: t.field({"required":false,"type":SortOrder}),
  authorId: t.field({"required":false,"type":SortOrder}),
  status: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
  deletedAt: t.field({"required":false,"type":SortOrder}),
  author: t.field({"required":false,"type":UserOrderByWithRelationInput}),
  trees: t.field({"required":false,"type":SkillTreeOrderByRelationAggregateInput}),
});
export const CourseOrderByWithRelationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CourseOrderByWithRelationInput>, false>('CourseOrderByWithRelationInput').implement({
  fields: CourseOrderByWithRelationInputFields,
});

export const CourseWhereUniqueInputFields = (t: any) => ({
  id: t.string({"required":false}),
  AND: t.field({"required":false,"type":[CourseWhereInput]}),
  OR: t.field({"required":false,"type":[CourseWhereInput]}),
  NOT: t.field({"required":false,"type":[CourseWhereInput]}),
  title: t.field({"required":false,"type":StringFilter}),
  description: t.field({"required":false,"type":StringNullableFilter}),
  authorId: t.field({"required":false,"type":StringFilter}),
  status: t.field({"required":false,"type":EnumCourseStatusFilter}),
  createdAt: t.field({"required":false,"type":DateTimeFilter}),
  updatedAt: t.field({"required":false,"type":DateTimeFilter}),
  deletedAt: t.field({"required":false,"type":DateTimeNullableFilter}),
  author: t.field({"required":false,"type":UserWhereInput}),
  trees: t.field({"required":false,"type":SkillTreeListRelationFilter}),
});
export const CourseWhereUniqueInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CourseWhereUniqueInput>, false>('CourseWhereUniqueInput').implement({
  fields: CourseWhereUniqueInputFields,
});

export const CourseOrderByWithAggregationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  title: t.field({"required":false,"type":SortOrder}),
  description: t.field({"required":false,"type":SortOrder}),
  authorId: t.field({"required":false,"type":SortOrder}),
  status: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
  deletedAt: t.field({"required":false,"type":SortOrder}),
  _count: t.field({"required":false,"type":CourseCountOrderByAggregateInput}),
  _max: t.field({"required":false,"type":CourseMaxOrderByAggregateInput}),
  _min: t.field({"required":false,"type":CourseMinOrderByAggregateInput}),
});
export const CourseOrderByWithAggregationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CourseOrderByWithAggregationInput>, false>('CourseOrderByWithAggregationInput').implement({
  fields: CourseOrderByWithAggregationInputFields,
});

export const CourseScalarWhereWithAggregatesInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[CourseScalarWhereWithAggregatesInput]}),
  OR: t.field({"required":false,"type":[CourseScalarWhereWithAggregatesInput]}),
  NOT: t.field({"required":false,"type":[CourseScalarWhereWithAggregatesInput]}),
  id: t.field({"required":false,"type":UuidWithAggregatesFilter}),
  title: t.field({"required":false,"type":StringWithAggregatesFilter}),
  description: t.field({"required":false,"type":StringNullableWithAggregatesFilter}),
  authorId: t.field({"required":false,"type":StringWithAggregatesFilter}),
  status: t.field({"required":false,"type":EnumCourseStatusWithAggregatesFilter}),
  createdAt: t.field({"required":false,"type":DateTimeWithAggregatesFilter}),
  updatedAt: t.field({"required":false,"type":DateTimeWithAggregatesFilter}),
  deletedAt: t.field({"required":false,"type":DateTimeNullableWithAggregatesFilter}),
});
export const CourseScalarWhereWithAggregatesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CourseScalarWhereWithAggregatesInput>, false>('CourseScalarWhereWithAggregatesInput').implement({
  fields: CourseScalarWhereWithAggregatesInputFields,
});

export const SkillTreeWhereInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[SkillTreeWhereInput]}),
  OR: t.field({"required":false,"type":[SkillTreeWhereInput]}),
  NOT: t.field({"required":false,"type":[SkillTreeWhereInput]}),
  id: t.field({"required":false,"type":UuidFilter}),
  courseId: t.field({"required":false,"type":UuidFilter}),
  title: t.field({"required":false,"type":StringFilter}),
  description: t.field({"required":false,"type":StringNullableFilter}),
  createdAt: t.field({"required":false,"type":DateTimeFilter}),
  updatedAt: t.field({"required":false,"type":DateTimeFilter}),
  deletedAt: t.field({"required":false,"type":DateTimeNullableFilter}),
  course: t.field({"required":false,"type":CourseWhereInput}),
  nodes: t.field({"required":false,"type":SkillNodeListRelationFilter}),
});
export const SkillTreeWhereInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillTreeWhereInput>, false>('SkillTreeWhereInput').implement({
  fields: SkillTreeWhereInputFields,
});

export const SkillTreeOrderByWithRelationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  courseId: t.field({"required":false,"type":SortOrder}),
  title: t.field({"required":false,"type":SortOrder}),
  description: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
  deletedAt: t.field({"required":false,"type":SortOrder}),
  course: t.field({"required":false,"type":CourseOrderByWithRelationInput}),
  nodes: t.field({"required":false,"type":SkillNodeOrderByRelationAggregateInput}),
});
export const SkillTreeOrderByWithRelationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillTreeOrderByWithRelationInput>, false>('SkillTreeOrderByWithRelationInput').implement({
  fields: SkillTreeOrderByWithRelationInputFields,
});

export const SkillTreeWhereUniqueInputFields = (t: any) => ({
  id: t.string({"required":false}),
  AND: t.field({"required":false,"type":[SkillTreeWhereInput]}),
  OR: t.field({"required":false,"type":[SkillTreeWhereInput]}),
  NOT: t.field({"required":false,"type":[SkillTreeWhereInput]}),
  courseId: t.field({"required":false,"type":UuidFilter}),
  title: t.field({"required":false,"type":StringFilter}),
  description: t.field({"required":false,"type":StringNullableFilter}),
  createdAt: t.field({"required":false,"type":DateTimeFilter}),
  updatedAt: t.field({"required":false,"type":DateTimeFilter}),
  deletedAt: t.field({"required":false,"type":DateTimeNullableFilter}),
  course: t.field({"required":false,"type":CourseWhereInput}),
  nodes: t.field({"required":false,"type":SkillNodeListRelationFilter}),
});
export const SkillTreeWhereUniqueInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillTreeWhereUniqueInput>, false>('SkillTreeWhereUniqueInput').implement({
  fields: SkillTreeWhereUniqueInputFields,
});

export const SkillTreeOrderByWithAggregationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  courseId: t.field({"required":false,"type":SortOrder}),
  title: t.field({"required":false,"type":SortOrder}),
  description: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
  deletedAt: t.field({"required":false,"type":SortOrder}),
  _count: t.field({"required":false,"type":SkillTreeCountOrderByAggregateInput}),
  _max: t.field({"required":false,"type":SkillTreeMaxOrderByAggregateInput}),
  _min: t.field({"required":false,"type":SkillTreeMinOrderByAggregateInput}),
});
export const SkillTreeOrderByWithAggregationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillTreeOrderByWithAggregationInput>, false>('SkillTreeOrderByWithAggregationInput').implement({
  fields: SkillTreeOrderByWithAggregationInputFields,
});

export const SkillTreeScalarWhereWithAggregatesInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[SkillTreeScalarWhereWithAggregatesInput]}),
  OR: t.field({"required":false,"type":[SkillTreeScalarWhereWithAggregatesInput]}),
  NOT: t.field({"required":false,"type":[SkillTreeScalarWhereWithAggregatesInput]}),
  id: t.field({"required":false,"type":UuidWithAggregatesFilter}),
  courseId: t.field({"required":false,"type":UuidWithAggregatesFilter}),
  title: t.field({"required":false,"type":StringWithAggregatesFilter}),
  description: t.field({"required":false,"type":StringNullableWithAggregatesFilter}),
  createdAt: t.field({"required":false,"type":DateTimeWithAggregatesFilter}),
  updatedAt: t.field({"required":false,"type":DateTimeWithAggregatesFilter}),
  deletedAt: t.field({"required":false,"type":DateTimeNullableWithAggregatesFilter}),
});
export const SkillTreeScalarWhereWithAggregatesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillTreeScalarWhereWithAggregatesInput>, false>('SkillTreeScalarWhereWithAggregatesInput').implement({
  fields: SkillTreeScalarWhereWithAggregatesInputFields,
});

export const SkillNodeWhereInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[SkillNodeWhereInput]}),
  OR: t.field({"required":false,"type":[SkillNodeWhereInput]}),
  NOT: t.field({"required":false,"type":[SkillNodeWhereInput]}),
  id: t.field({"required":false,"type":UuidFilter}),
  treeId: t.field({"required":false,"type":UuidFilter}),
  title: t.field({"required":false,"type":StringFilter}),
  step: t.field({"required":false,"type":IntFilter}),
  orderInStep: t.field({"required":false,"type":IntFilter}),
  posX: t.field({"required":false,"type":IntNullableFilter}),
  posY: t.field({"required":false,"type":IntNullableFilter}),
  createdAt: t.field({"required":false,"type":DateTimeFilter}),
  updatedAt: t.field({"required":false,"type":DateTimeFilter}),
  deletedAt: t.field({"required":false,"type":DateTimeNullableFilter}),
  tree: t.field({"required":false,"type":SkillTreeWhereInput}),
  lessons: t.field({"required":false,"type":LessonBlocksListRelationFilter}),
  quiz: t.field({"required":false,"type":QuizWhereInput}),
  prerequisites: t.field({"required":false,"type":SkillNodePrerequisiteListRelationFilter}),
  requiredFor: t.field({"required":false,"type":SkillNodePrerequisiteListRelationFilter}),
  progresses: t.field({"required":false,"type":UserNodeProgressListRelationFilter}),
});
export const SkillNodeWhereInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeWhereInput>, false>('SkillNodeWhereInput').implement({
  fields: SkillNodeWhereInputFields,
});

export const SkillNodeOrderByWithRelationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  treeId: t.field({"required":false,"type":SortOrder}),
  title: t.field({"required":false,"type":SortOrder}),
  step: t.field({"required":false,"type":SortOrder}),
  orderInStep: t.field({"required":false,"type":SortOrder}),
  posX: t.field({"required":false,"type":SortOrder}),
  posY: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
  deletedAt: t.field({"required":false,"type":SortOrder}),
  tree: t.field({"required":false,"type":SkillTreeOrderByWithRelationInput}),
  lessons: t.field({"required":false,"type":LessonBlocksOrderByRelationAggregateInput}),
  quiz: t.field({"required":false,"type":QuizOrderByWithRelationInput}),
  prerequisites: t.field({"required":false,"type":SkillNodePrerequisiteOrderByRelationAggregateInput}),
  requiredFor: t.field({"required":false,"type":SkillNodePrerequisiteOrderByRelationAggregateInput}),
  progresses: t.field({"required":false,"type":UserNodeProgressOrderByRelationAggregateInput}),
});
export const SkillNodeOrderByWithRelationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeOrderByWithRelationInput>, false>('SkillNodeOrderByWithRelationInput').implement({
  fields: SkillNodeOrderByWithRelationInputFields,
});

export const SkillNodeWhereUniqueInputFields = (t: any) => ({
  id: t.string({"required":false}),
  treeId_step_orderInStep: t.field({"required":false,"type":SkillNodeTreeIdStepOrderInStepCompoundUniqueInput}),
  treeId_posX_posY: t.field({"required":false,"type":SkillNodeTreeIdPosXPosYCompoundUniqueInput}),
  AND: t.field({"required":false,"type":[SkillNodeWhereInput]}),
  OR: t.field({"required":false,"type":[SkillNodeWhereInput]}),
  NOT: t.field({"required":false,"type":[SkillNodeWhereInput]}),
  treeId: t.field({"required":false,"type":UuidFilter}),
  title: t.field({"required":false,"type":StringFilter}),
  step: t.field({"required":false,"type":IntFilter}),
  orderInStep: t.field({"required":false,"type":IntFilter}),
  posX: t.field({"required":false,"type":IntNullableFilter}),
  posY: t.field({"required":false,"type":IntNullableFilter}),
  createdAt: t.field({"required":false,"type":DateTimeFilter}),
  updatedAt: t.field({"required":false,"type":DateTimeFilter}),
  deletedAt: t.field({"required":false,"type":DateTimeNullableFilter}),
  tree: t.field({"required":false,"type":SkillTreeWhereInput}),
  lessons: t.field({"required":false,"type":LessonBlocksListRelationFilter}),
  quiz: t.field({"required":false,"type":QuizWhereInput}),
  prerequisites: t.field({"required":false,"type":SkillNodePrerequisiteListRelationFilter}),
  requiredFor: t.field({"required":false,"type":SkillNodePrerequisiteListRelationFilter}),
  progresses: t.field({"required":false,"type":UserNodeProgressListRelationFilter}),
});
export const SkillNodeWhereUniqueInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeWhereUniqueInput>, false>('SkillNodeWhereUniqueInput').implement({
  fields: SkillNodeWhereUniqueInputFields,
});

export const SkillNodeOrderByWithAggregationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  treeId: t.field({"required":false,"type":SortOrder}),
  title: t.field({"required":false,"type":SortOrder}),
  step: t.field({"required":false,"type":SortOrder}),
  orderInStep: t.field({"required":false,"type":SortOrder}),
  posX: t.field({"required":false,"type":SortOrder}),
  posY: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
  deletedAt: t.field({"required":false,"type":SortOrder}),
  _count: t.field({"required":false,"type":SkillNodeCountOrderByAggregateInput}),
  _avg: t.field({"required":false,"type":SkillNodeAvgOrderByAggregateInput}),
  _max: t.field({"required":false,"type":SkillNodeMaxOrderByAggregateInput}),
  _min: t.field({"required":false,"type":SkillNodeMinOrderByAggregateInput}),
  _sum: t.field({"required":false,"type":SkillNodeSumOrderByAggregateInput}),
});
export const SkillNodeOrderByWithAggregationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeOrderByWithAggregationInput>, false>('SkillNodeOrderByWithAggregationInput').implement({
  fields: SkillNodeOrderByWithAggregationInputFields,
});

export const SkillNodeScalarWhereWithAggregatesInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[SkillNodeScalarWhereWithAggregatesInput]}),
  OR: t.field({"required":false,"type":[SkillNodeScalarWhereWithAggregatesInput]}),
  NOT: t.field({"required":false,"type":[SkillNodeScalarWhereWithAggregatesInput]}),
  id: t.field({"required":false,"type":UuidWithAggregatesFilter}),
  treeId: t.field({"required":false,"type":UuidWithAggregatesFilter}),
  title: t.field({"required":false,"type":StringWithAggregatesFilter}),
  step: t.field({"required":false,"type":IntWithAggregatesFilter}),
  orderInStep: t.field({"required":false,"type":IntWithAggregatesFilter}),
  posX: t.field({"required":false,"type":IntNullableWithAggregatesFilter}),
  posY: t.field({"required":false,"type":IntNullableWithAggregatesFilter}),
  createdAt: t.field({"required":false,"type":DateTimeWithAggregatesFilter}),
  updatedAt: t.field({"required":false,"type":DateTimeWithAggregatesFilter}),
  deletedAt: t.field({"required":false,"type":DateTimeNullableWithAggregatesFilter}),
});
export const SkillNodeScalarWhereWithAggregatesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeScalarWhereWithAggregatesInput>, false>('SkillNodeScalarWhereWithAggregatesInput').implement({
  fields: SkillNodeScalarWhereWithAggregatesInputFields,
});

export const SkillNodePrerequisiteWhereInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[SkillNodePrerequisiteWhereInput]}),
  OR: t.field({"required":false,"type":[SkillNodePrerequisiteWhereInput]}),
  NOT: t.field({"required":false,"type":[SkillNodePrerequisiteWhereInput]}),
  nodeId: t.field({"required":false,"type":UuidFilter}),
  dependsOnNodeId: t.field({"required":false,"type":UuidFilter}),
  node: t.field({"required":false,"type":SkillNodeWhereInput}),
  dependsOn: t.field({"required":false,"type":SkillNodeWhereInput}),
});
export const SkillNodePrerequisiteWhereInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodePrerequisiteWhereInput>, false>('SkillNodePrerequisiteWhereInput').implement({
  fields: SkillNodePrerequisiteWhereInputFields,
});

export const SkillNodePrerequisiteOrderByWithRelationInputFields = (t: any) => ({
  nodeId: t.field({"required":false,"type":SortOrder}),
  dependsOnNodeId: t.field({"required":false,"type":SortOrder}),
  node: t.field({"required":false,"type":SkillNodeOrderByWithRelationInput}),
  dependsOn: t.field({"required":false,"type":SkillNodeOrderByWithRelationInput}),
});
export const SkillNodePrerequisiteOrderByWithRelationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodePrerequisiteOrderByWithRelationInput>, false>('SkillNodePrerequisiteOrderByWithRelationInput').implement({
  fields: SkillNodePrerequisiteOrderByWithRelationInputFields,
});

export const SkillNodePrerequisiteWhereUniqueInputFields = (t: any) => ({
  nodeId_dependsOnNodeId: t.field({"required":false,"type":SkillNodePrerequisiteNodeIdDependsOnNodeIdCompoundUniqueInput}),
  AND: t.field({"required":false,"type":[SkillNodePrerequisiteWhereInput]}),
  OR: t.field({"required":false,"type":[SkillNodePrerequisiteWhereInput]}),
  NOT: t.field({"required":false,"type":[SkillNodePrerequisiteWhereInput]}),
  nodeId: t.field({"required":false,"type":UuidFilter}),
  dependsOnNodeId: t.field({"required":false,"type":UuidFilter}),
  node: t.field({"required":false,"type":SkillNodeWhereInput}),
  dependsOn: t.field({"required":false,"type":SkillNodeWhereInput}),
});
export const SkillNodePrerequisiteWhereUniqueInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodePrerequisiteWhereUniqueInput>, false>('SkillNodePrerequisiteWhereUniqueInput').implement({
  fields: SkillNodePrerequisiteWhereUniqueInputFields,
});

export const SkillNodePrerequisiteOrderByWithAggregationInputFields = (t: any) => ({
  nodeId: t.field({"required":false,"type":SortOrder}),
  dependsOnNodeId: t.field({"required":false,"type":SortOrder}),
  _count: t.field({"required":false,"type":SkillNodePrerequisiteCountOrderByAggregateInput}),
  _max: t.field({"required":false,"type":SkillNodePrerequisiteMaxOrderByAggregateInput}),
  _min: t.field({"required":false,"type":SkillNodePrerequisiteMinOrderByAggregateInput}),
});
export const SkillNodePrerequisiteOrderByWithAggregationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodePrerequisiteOrderByWithAggregationInput>, false>('SkillNodePrerequisiteOrderByWithAggregationInput').implement({
  fields: SkillNodePrerequisiteOrderByWithAggregationInputFields,
});

export const SkillNodePrerequisiteScalarWhereWithAggregatesInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[SkillNodePrerequisiteScalarWhereWithAggregatesInput]}),
  OR: t.field({"required":false,"type":[SkillNodePrerequisiteScalarWhereWithAggregatesInput]}),
  NOT: t.field({"required":false,"type":[SkillNodePrerequisiteScalarWhereWithAggregatesInput]}),
  nodeId: t.field({"required":false,"type":UuidWithAggregatesFilter}),
  dependsOnNodeId: t.field({"required":false,"type":UuidWithAggregatesFilter}),
});
export const SkillNodePrerequisiteScalarWhereWithAggregatesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodePrerequisiteScalarWhereWithAggregatesInput>, false>('SkillNodePrerequisiteScalarWhereWithAggregatesInput').implement({
  fields: SkillNodePrerequisiteScalarWhereWithAggregatesInputFields,
});

export const LessonBlocksWhereInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[LessonBlocksWhereInput]}),
  OR: t.field({"required":false,"type":[LessonBlocksWhereInput]}),
  NOT: t.field({"required":false,"type":[LessonBlocksWhereInput]}),
  id: t.field({"required":false,"type":UuidFilter}),
  nodeId: t.field({"required":false,"type":UuidFilter}),
  type: t.field({"required":false,"type":EnumContentTypeFilter}),
  url: t.field({"required":false,"type":StringNullableFilter}),
  html: t.field({"required":false,"type":StringNullableFilter}),
  caption: t.field({"required":false,"type":StringNullableFilter}),
  order: t.field({"required":false,"type":IntFilter}),
  meta: t.field({"required":false,"type":JsonNullableFilter}),
  status: t.field({"required":false,"type":EnumLessonStatusFilter}),
  createdAt: t.field({"required":false,"type":DateTimeFilter}),
  updatedAt: t.field({"required":false,"type":DateTimeFilter}),
  deletedAt: t.field({"required":false,"type":DateTimeNullableFilter}),
  node: t.field({"required":false,"type":SkillNodeWhereInput}),
});
export const LessonBlocksWhereInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.LessonBlocksWhereInput>, false>('LessonBlocksWhereInput').implement({
  fields: LessonBlocksWhereInputFields,
});

export const LessonBlocksOrderByWithRelationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  nodeId: t.field({"required":false,"type":SortOrder}),
  type: t.field({"required":false,"type":SortOrder}),
  url: t.field({"required":false,"type":SortOrder}),
  html: t.field({"required":false,"type":SortOrder}),
  caption: t.field({"required":false,"type":SortOrder}),
  order: t.field({"required":false,"type":SortOrder}),
  meta: t.field({"required":false,"type":SortOrder}),
  status: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
  deletedAt: t.field({"required":false,"type":SortOrder}),
  node: t.field({"required":false,"type":SkillNodeOrderByWithRelationInput}),
});
export const LessonBlocksOrderByWithRelationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.LessonBlocksOrderByWithRelationInput>, false>('LessonBlocksOrderByWithRelationInput').implement({
  fields: LessonBlocksOrderByWithRelationInputFields,
});

export const LessonBlocksWhereUniqueInputFields = (t: any) => ({
  id: t.string({"required":false}),
  AND: t.field({"required":false,"type":[LessonBlocksWhereInput]}),
  OR: t.field({"required":false,"type":[LessonBlocksWhereInput]}),
  NOT: t.field({"required":false,"type":[LessonBlocksWhereInput]}),
  nodeId: t.field({"required":false,"type":UuidFilter}),
  type: t.field({"required":false,"type":EnumContentTypeFilter}),
  url: t.field({"required":false,"type":StringNullableFilter}),
  html: t.field({"required":false,"type":StringNullableFilter}),
  caption: t.field({"required":false,"type":StringNullableFilter}),
  order: t.field({"required":false,"type":IntFilter}),
  meta: t.field({"required":false,"type":JsonNullableFilter}),
  status: t.field({"required":false,"type":EnumLessonStatusFilter}),
  createdAt: t.field({"required":false,"type":DateTimeFilter}),
  updatedAt: t.field({"required":false,"type":DateTimeFilter}),
  deletedAt: t.field({"required":false,"type":DateTimeNullableFilter}),
  node: t.field({"required":false,"type":SkillNodeWhereInput}),
});
export const LessonBlocksWhereUniqueInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.LessonBlocksWhereUniqueInput>, false>('LessonBlocksWhereUniqueInput').implement({
  fields: LessonBlocksWhereUniqueInputFields,
});

export const LessonBlocksOrderByWithAggregationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  nodeId: t.field({"required":false,"type":SortOrder}),
  type: t.field({"required":false,"type":SortOrder}),
  url: t.field({"required":false,"type":SortOrder}),
  html: t.field({"required":false,"type":SortOrder}),
  caption: t.field({"required":false,"type":SortOrder}),
  order: t.field({"required":false,"type":SortOrder}),
  meta: t.field({"required":false,"type":SortOrder}),
  status: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
  deletedAt: t.field({"required":false,"type":SortOrder}),
  _count: t.field({"required":false,"type":LessonBlocksCountOrderByAggregateInput}),
  _avg: t.field({"required":false,"type":LessonBlocksAvgOrderByAggregateInput}),
  _max: t.field({"required":false,"type":LessonBlocksMaxOrderByAggregateInput}),
  _min: t.field({"required":false,"type":LessonBlocksMinOrderByAggregateInput}),
  _sum: t.field({"required":false,"type":LessonBlocksSumOrderByAggregateInput}),
});
export const LessonBlocksOrderByWithAggregationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.LessonBlocksOrderByWithAggregationInput>, false>('LessonBlocksOrderByWithAggregationInput').implement({
  fields: LessonBlocksOrderByWithAggregationInputFields,
});

export const LessonBlocksScalarWhereWithAggregatesInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[LessonBlocksScalarWhereWithAggregatesInput]}),
  OR: t.field({"required":false,"type":[LessonBlocksScalarWhereWithAggregatesInput]}),
  NOT: t.field({"required":false,"type":[LessonBlocksScalarWhereWithAggregatesInput]}),
  id: t.field({"required":false,"type":UuidWithAggregatesFilter}),
  nodeId: t.field({"required":false,"type":UuidWithAggregatesFilter}),
  type: t.field({"required":false,"type":EnumContentTypeWithAggregatesFilter}),
  url: t.field({"required":false,"type":StringNullableWithAggregatesFilter}),
  html: t.field({"required":false,"type":StringNullableWithAggregatesFilter}),
  caption: t.field({"required":false,"type":StringNullableWithAggregatesFilter}),
  order: t.field({"required":false,"type":IntWithAggregatesFilter}),
  meta: t.field({"required":false,"type":JsonNullableWithAggregatesFilter}),
  status: t.field({"required":false,"type":EnumLessonStatusWithAggregatesFilter}),
  createdAt: t.field({"required":false,"type":DateTimeWithAggregatesFilter}),
  updatedAt: t.field({"required":false,"type":DateTimeWithAggregatesFilter}),
  deletedAt: t.field({"required":false,"type":DateTimeNullableWithAggregatesFilter}),
});
export const LessonBlocksScalarWhereWithAggregatesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.LessonBlocksScalarWhereWithAggregatesInput>, false>('LessonBlocksScalarWhereWithAggregatesInput').implement({
  fields: LessonBlocksScalarWhereWithAggregatesInputFields,
});

export const QuizWhereInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[QuizWhereInput]}),
  OR: t.field({"required":false,"type":[QuizWhereInput]}),
  NOT: t.field({"required":false,"type":[QuizWhereInput]}),
  id: t.field({"required":false,"type":UuidFilter}),
  nodeId: t.field({"required":false,"type":UuidFilter}),
  title: t.field({"required":false,"type":StringNullableFilter}),
  required: t.field({"required":false,"type":BoolFilter}),
  createdAt: t.field({"required":false,"type":DateTimeFilter}),
  updatedAt: t.field({"required":false,"type":DateTimeFilter}),
  deletedAt: t.field({"required":false,"type":DateTimeNullableFilter}),
  node: t.field({"required":false,"type":SkillNodeWhereInput}),
  questions: t.field({"required":false,"type":QuizQuestionListRelationFilter}),
  attempts: t.field({"required":false,"type":QuizAttemptListRelationFilter}),
});
export const QuizWhereInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizWhereInput>, false>('QuizWhereInput').implement({
  fields: QuizWhereInputFields,
});

export const QuizOrderByWithRelationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  nodeId: t.field({"required":false,"type":SortOrder}),
  title: t.field({"required":false,"type":SortOrder}),
  required: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
  deletedAt: t.field({"required":false,"type":SortOrder}),
  node: t.field({"required":false,"type":SkillNodeOrderByWithRelationInput}),
  questions: t.field({"required":false,"type":QuizQuestionOrderByRelationAggregateInput}),
  attempts: t.field({"required":false,"type":QuizAttemptOrderByRelationAggregateInput}),
});
export const QuizOrderByWithRelationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizOrderByWithRelationInput>, false>('QuizOrderByWithRelationInput').implement({
  fields: QuizOrderByWithRelationInputFields,
});

export const QuizWhereUniqueInputFields = (t: any) => ({
  id: t.string({"required":false}),
  nodeId: t.string({"required":false}),
  AND: t.field({"required":false,"type":[QuizWhereInput]}),
  OR: t.field({"required":false,"type":[QuizWhereInput]}),
  NOT: t.field({"required":false,"type":[QuizWhereInput]}),
  title: t.field({"required":false,"type":StringNullableFilter}),
  required: t.field({"required":false,"type":BoolFilter}),
  createdAt: t.field({"required":false,"type":DateTimeFilter}),
  updatedAt: t.field({"required":false,"type":DateTimeFilter}),
  deletedAt: t.field({"required":false,"type":DateTimeNullableFilter}),
  node: t.field({"required":false,"type":SkillNodeWhereInput}),
  questions: t.field({"required":false,"type":QuizQuestionListRelationFilter}),
  attempts: t.field({"required":false,"type":QuizAttemptListRelationFilter}),
});
export const QuizWhereUniqueInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizWhereUniqueInput>, false>('QuizWhereUniqueInput').implement({
  fields: QuizWhereUniqueInputFields,
});

export const QuizOrderByWithAggregationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  nodeId: t.field({"required":false,"type":SortOrder}),
  title: t.field({"required":false,"type":SortOrder}),
  required: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
  deletedAt: t.field({"required":false,"type":SortOrder}),
  _count: t.field({"required":false,"type":QuizCountOrderByAggregateInput}),
  _max: t.field({"required":false,"type":QuizMaxOrderByAggregateInput}),
  _min: t.field({"required":false,"type":QuizMinOrderByAggregateInput}),
});
export const QuizOrderByWithAggregationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizOrderByWithAggregationInput>, false>('QuizOrderByWithAggregationInput').implement({
  fields: QuizOrderByWithAggregationInputFields,
});

export const QuizScalarWhereWithAggregatesInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[QuizScalarWhereWithAggregatesInput]}),
  OR: t.field({"required":false,"type":[QuizScalarWhereWithAggregatesInput]}),
  NOT: t.field({"required":false,"type":[QuizScalarWhereWithAggregatesInput]}),
  id: t.field({"required":false,"type":UuidWithAggregatesFilter}),
  nodeId: t.field({"required":false,"type":UuidWithAggregatesFilter}),
  title: t.field({"required":false,"type":StringNullableWithAggregatesFilter}),
  required: t.field({"required":false,"type":BoolWithAggregatesFilter}),
  createdAt: t.field({"required":false,"type":DateTimeWithAggregatesFilter}),
  updatedAt: t.field({"required":false,"type":DateTimeWithAggregatesFilter}),
  deletedAt: t.field({"required":false,"type":DateTimeNullableWithAggregatesFilter}),
});
export const QuizScalarWhereWithAggregatesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizScalarWhereWithAggregatesInput>, false>('QuizScalarWhereWithAggregatesInput').implement({
  fields: QuizScalarWhereWithAggregatesInputFields,
});

export const QuizQuestionWhereInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[QuizQuestionWhereInput]}),
  OR: t.field({"required":false,"type":[QuizQuestionWhereInput]}),
  NOT: t.field({"required":false,"type":[QuizQuestionWhereInput]}),
  id: t.field({"required":false,"type":UuidFilter}),
  quizId: t.field({"required":false,"type":UuidFilter}),
  type: t.field({"required":false,"type":EnumQuestionTypeFilter}),
  prompt: t.field({"required":false,"type":StringFilter}),
  order: t.field({"required":false,"type":IntFilter}),
  createdAt: t.field({"required":false,"type":DateTimeFilter}),
  updatedAt: t.field({"required":false,"type":DateTimeFilter}),
  quiz: t.field({"required":false,"type":QuizWhereInput}),
  options: t.field({"required":false,"type":QuizOptionListRelationFilter}),
  answers: t.field({"required":false,"type":QuizAttemptAnswerListRelationFilter}),
});
export const QuizQuestionWhereInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizQuestionWhereInput>, false>('QuizQuestionWhereInput').implement({
  fields: QuizQuestionWhereInputFields,
});

export const QuizQuestionOrderByWithRelationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  quizId: t.field({"required":false,"type":SortOrder}),
  type: t.field({"required":false,"type":SortOrder}),
  prompt: t.field({"required":false,"type":SortOrder}),
  order: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
  quiz: t.field({"required":false,"type":QuizOrderByWithRelationInput}),
  options: t.field({"required":false,"type":QuizOptionOrderByRelationAggregateInput}),
  answers: t.field({"required":false,"type":QuizAttemptAnswerOrderByRelationAggregateInput}),
});
export const QuizQuestionOrderByWithRelationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizQuestionOrderByWithRelationInput>, false>('QuizQuestionOrderByWithRelationInput').implement({
  fields: QuizQuestionOrderByWithRelationInputFields,
});

export const QuizQuestionWhereUniqueInputFields = (t: any) => ({
  id: t.string({"required":false}),
  AND: t.field({"required":false,"type":[QuizQuestionWhereInput]}),
  OR: t.field({"required":false,"type":[QuizQuestionWhereInput]}),
  NOT: t.field({"required":false,"type":[QuizQuestionWhereInput]}),
  quizId: t.field({"required":false,"type":UuidFilter}),
  type: t.field({"required":false,"type":EnumQuestionTypeFilter}),
  prompt: t.field({"required":false,"type":StringFilter}),
  order: t.field({"required":false,"type":IntFilter}),
  createdAt: t.field({"required":false,"type":DateTimeFilter}),
  updatedAt: t.field({"required":false,"type":DateTimeFilter}),
  quiz: t.field({"required":false,"type":QuizWhereInput}),
  options: t.field({"required":false,"type":QuizOptionListRelationFilter}),
  answers: t.field({"required":false,"type":QuizAttemptAnswerListRelationFilter}),
});
export const QuizQuestionWhereUniqueInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizQuestionWhereUniqueInput>, false>('QuizQuestionWhereUniqueInput').implement({
  fields: QuizQuestionWhereUniqueInputFields,
});

export const QuizQuestionOrderByWithAggregationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  quizId: t.field({"required":false,"type":SortOrder}),
  type: t.field({"required":false,"type":SortOrder}),
  prompt: t.field({"required":false,"type":SortOrder}),
  order: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
  _count: t.field({"required":false,"type":QuizQuestionCountOrderByAggregateInput}),
  _avg: t.field({"required":false,"type":QuizQuestionAvgOrderByAggregateInput}),
  _max: t.field({"required":false,"type":QuizQuestionMaxOrderByAggregateInput}),
  _min: t.field({"required":false,"type":QuizQuestionMinOrderByAggregateInput}),
  _sum: t.field({"required":false,"type":QuizQuestionSumOrderByAggregateInput}),
});
export const QuizQuestionOrderByWithAggregationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizQuestionOrderByWithAggregationInput>, false>('QuizQuestionOrderByWithAggregationInput').implement({
  fields: QuizQuestionOrderByWithAggregationInputFields,
});

export const QuizQuestionScalarWhereWithAggregatesInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[QuizQuestionScalarWhereWithAggregatesInput]}),
  OR: t.field({"required":false,"type":[QuizQuestionScalarWhereWithAggregatesInput]}),
  NOT: t.field({"required":false,"type":[QuizQuestionScalarWhereWithAggregatesInput]}),
  id: t.field({"required":false,"type":UuidWithAggregatesFilter}),
  quizId: t.field({"required":false,"type":UuidWithAggregatesFilter}),
  type: t.field({"required":false,"type":EnumQuestionTypeWithAggregatesFilter}),
  prompt: t.field({"required":false,"type":StringWithAggregatesFilter}),
  order: t.field({"required":false,"type":IntWithAggregatesFilter}),
  createdAt: t.field({"required":false,"type":DateTimeWithAggregatesFilter}),
  updatedAt: t.field({"required":false,"type":DateTimeWithAggregatesFilter}),
});
export const QuizQuestionScalarWhereWithAggregatesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizQuestionScalarWhereWithAggregatesInput>, false>('QuizQuestionScalarWhereWithAggregatesInput').implement({
  fields: QuizQuestionScalarWhereWithAggregatesInputFields,
});

export const QuizOptionWhereInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[QuizOptionWhereInput]}),
  OR: t.field({"required":false,"type":[QuizOptionWhereInput]}),
  NOT: t.field({"required":false,"type":[QuizOptionWhereInput]}),
  id: t.field({"required":false,"type":UuidFilter}),
  questionId: t.field({"required":false,"type":UuidFilter}),
  text: t.field({"required":false,"type":StringFilter}),
  isCorrect: t.field({"required":false,"type":BoolFilter}),
  createdAt: t.field({"required":false,"type":DateTimeFilter}),
  updatedAt: t.field({"required":false,"type":DateTimeFilter}),
  question: t.field({"required":false,"type":QuizQuestionWhereInput}),
});
export const QuizOptionWhereInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizOptionWhereInput>, false>('QuizOptionWhereInput').implement({
  fields: QuizOptionWhereInputFields,
});

export const QuizOptionOrderByWithRelationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  questionId: t.field({"required":false,"type":SortOrder}),
  text: t.field({"required":false,"type":SortOrder}),
  isCorrect: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
  question: t.field({"required":false,"type":QuizQuestionOrderByWithRelationInput}),
});
export const QuizOptionOrderByWithRelationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizOptionOrderByWithRelationInput>, false>('QuizOptionOrderByWithRelationInput').implement({
  fields: QuizOptionOrderByWithRelationInputFields,
});

export const QuizOptionWhereUniqueInputFields = (t: any) => ({
  id: t.string({"required":false}),
  AND: t.field({"required":false,"type":[QuizOptionWhereInput]}),
  OR: t.field({"required":false,"type":[QuizOptionWhereInput]}),
  NOT: t.field({"required":false,"type":[QuizOptionWhereInput]}),
  questionId: t.field({"required":false,"type":UuidFilter}),
  text: t.field({"required":false,"type":StringFilter}),
  isCorrect: t.field({"required":false,"type":BoolFilter}),
  createdAt: t.field({"required":false,"type":DateTimeFilter}),
  updatedAt: t.field({"required":false,"type":DateTimeFilter}),
  question: t.field({"required":false,"type":QuizQuestionWhereInput}),
});
export const QuizOptionWhereUniqueInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizOptionWhereUniqueInput>, false>('QuizOptionWhereUniqueInput').implement({
  fields: QuizOptionWhereUniqueInputFields,
});

export const QuizOptionOrderByWithAggregationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  questionId: t.field({"required":false,"type":SortOrder}),
  text: t.field({"required":false,"type":SortOrder}),
  isCorrect: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
  _count: t.field({"required":false,"type":QuizOptionCountOrderByAggregateInput}),
  _max: t.field({"required":false,"type":QuizOptionMaxOrderByAggregateInput}),
  _min: t.field({"required":false,"type":QuizOptionMinOrderByAggregateInput}),
});
export const QuizOptionOrderByWithAggregationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizOptionOrderByWithAggregationInput>, false>('QuizOptionOrderByWithAggregationInput').implement({
  fields: QuizOptionOrderByWithAggregationInputFields,
});

export const QuizOptionScalarWhereWithAggregatesInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[QuizOptionScalarWhereWithAggregatesInput]}),
  OR: t.field({"required":false,"type":[QuizOptionScalarWhereWithAggregatesInput]}),
  NOT: t.field({"required":false,"type":[QuizOptionScalarWhereWithAggregatesInput]}),
  id: t.field({"required":false,"type":UuidWithAggregatesFilter}),
  questionId: t.field({"required":false,"type":UuidWithAggregatesFilter}),
  text: t.field({"required":false,"type":StringWithAggregatesFilter}),
  isCorrect: t.field({"required":false,"type":BoolWithAggregatesFilter}),
  createdAt: t.field({"required":false,"type":DateTimeWithAggregatesFilter}),
  updatedAt: t.field({"required":false,"type":DateTimeWithAggregatesFilter}),
});
export const QuizOptionScalarWhereWithAggregatesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizOptionScalarWhereWithAggregatesInput>, false>('QuizOptionScalarWhereWithAggregatesInput').implement({
  fields: QuizOptionScalarWhereWithAggregatesInputFields,
});

export const QuizAttemptWhereInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[QuizAttemptWhereInput]}),
  OR: t.field({"required":false,"type":[QuizAttemptWhereInput]}),
  NOT: t.field({"required":false,"type":[QuizAttemptWhereInput]}),
  id: t.field({"required":false,"type":UuidFilter}),
  quizId: t.field({"required":false,"type":UuidFilter}),
  userId: t.field({"required":false,"type":StringFilter}),
  passed: t.field({"required":false,"type":BoolFilter}),
  takenAt: t.field({"required":false,"type":DateTimeFilter}),
  quiz: t.field({"required":false,"type":QuizWhereInput}),
  user: t.field({"required":false,"type":UserWhereInput}),
  answers: t.field({"required":false,"type":QuizAttemptAnswerListRelationFilter}),
});
export const QuizAttemptWhereInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptWhereInput>, false>('QuizAttemptWhereInput').implement({
  fields: QuizAttemptWhereInputFields,
});

export const QuizAttemptOrderByWithRelationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  quizId: t.field({"required":false,"type":SortOrder}),
  userId: t.field({"required":false,"type":SortOrder}),
  passed: t.field({"required":false,"type":SortOrder}),
  takenAt: t.field({"required":false,"type":SortOrder}),
  quiz: t.field({"required":false,"type":QuizOrderByWithRelationInput}),
  user: t.field({"required":false,"type":UserOrderByWithRelationInput}),
  answers: t.field({"required":false,"type":QuizAttemptAnswerOrderByRelationAggregateInput}),
});
export const QuizAttemptOrderByWithRelationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptOrderByWithRelationInput>, false>('QuizAttemptOrderByWithRelationInput').implement({
  fields: QuizAttemptOrderByWithRelationInputFields,
});

export const QuizAttemptWhereUniqueInputFields = (t: any) => ({
  id: t.string({"required":false}),
  AND: t.field({"required":false,"type":[QuizAttemptWhereInput]}),
  OR: t.field({"required":false,"type":[QuizAttemptWhereInput]}),
  NOT: t.field({"required":false,"type":[QuizAttemptWhereInput]}),
  quizId: t.field({"required":false,"type":UuidFilter}),
  userId: t.field({"required":false,"type":StringFilter}),
  passed: t.field({"required":false,"type":BoolFilter}),
  takenAt: t.field({"required":false,"type":DateTimeFilter}),
  quiz: t.field({"required":false,"type":QuizWhereInput}),
  user: t.field({"required":false,"type":UserWhereInput}),
  answers: t.field({"required":false,"type":QuizAttemptAnswerListRelationFilter}),
});
export const QuizAttemptWhereUniqueInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptWhereUniqueInput>, false>('QuizAttemptWhereUniqueInput').implement({
  fields: QuizAttemptWhereUniqueInputFields,
});

export const QuizAttemptOrderByWithAggregationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  quizId: t.field({"required":false,"type":SortOrder}),
  userId: t.field({"required":false,"type":SortOrder}),
  passed: t.field({"required":false,"type":SortOrder}),
  takenAt: t.field({"required":false,"type":SortOrder}),
  _count: t.field({"required":false,"type":QuizAttemptCountOrderByAggregateInput}),
  _max: t.field({"required":false,"type":QuizAttemptMaxOrderByAggregateInput}),
  _min: t.field({"required":false,"type":QuizAttemptMinOrderByAggregateInput}),
});
export const QuizAttemptOrderByWithAggregationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptOrderByWithAggregationInput>, false>('QuizAttemptOrderByWithAggregationInput').implement({
  fields: QuizAttemptOrderByWithAggregationInputFields,
});

export const QuizAttemptScalarWhereWithAggregatesInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[QuizAttemptScalarWhereWithAggregatesInput]}),
  OR: t.field({"required":false,"type":[QuizAttemptScalarWhereWithAggregatesInput]}),
  NOT: t.field({"required":false,"type":[QuizAttemptScalarWhereWithAggregatesInput]}),
  id: t.field({"required":false,"type":UuidWithAggregatesFilter}),
  quizId: t.field({"required":false,"type":UuidWithAggregatesFilter}),
  userId: t.field({"required":false,"type":StringWithAggregatesFilter}),
  passed: t.field({"required":false,"type":BoolWithAggregatesFilter}),
  takenAt: t.field({"required":false,"type":DateTimeWithAggregatesFilter}),
});
export const QuizAttemptScalarWhereWithAggregatesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptScalarWhereWithAggregatesInput>, false>('QuizAttemptScalarWhereWithAggregatesInput').implement({
  fields: QuizAttemptScalarWhereWithAggregatesInputFields,
});

export const QuizAttemptAnswerWhereInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[QuizAttemptAnswerWhereInput]}),
  OR: t.field({"required":false,"type":[QuizAttemptAnswerWhereInput]}),
  NOT: t.field({"required":false,"type":[QuizAttemptAnswerWhereInput]}),
  id: t.field({"required":false,"type":UuidFilter}),
  attemptId: t.field({"required":false,"type":UuidFilter}),
  questionId: t.field({"required":false,"type":UuidFilter}),
  answer: t.field({"required":false,"type":JsonNullableFilter}),
  isCorrect: t.field({"required":false,"type":BoolNullableFilter}),
  attempt: t.field({"required":false,"type":QuizAttemptWhereInput}),
  question: t.field({"required":false,"type":QuizQuestionWhereInput}),
});
export const QuizAttemptAnswerWhereInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptAnswerWhereInput>, false>('QuizAttemptAnswerWhereInput').implement({
  fields: QuizAttemptAnswerWhereInputFields,
});

export const QuizAttemptAnswerOrderByWithRelationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  attemptId: t.field({"required":false,"type":SortOrder}),
  questionId: t.field({"required":false,"type":SortOrder}),
  answer: t.field({"required":false,"type":SortOrder}),
  isCorrect: t.field({"required":false,"type":SortOrder}),
  attempt: t.field({"required":false,"type":QuizAttemptOrderByWithRelationInput}),
  question: t.field({"required":false,"type":QuizQuestionOrderByWithRelationInput}),
});
export const QuizAttemptAnswerOrderByWithRelationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptAnswerOrderByWithRelationInput>, false>('QuizAttemptAnswerOrderByWithRelationInput').implement({
  fields: QuizAttemptAnswerOrderByWithRelationInputFields,
});

export const QuizAttemptAnswerWhereUniqueInputFields = (t: any) => ({
  id: t.string({"required":false}),
  attemptId_questionId: t.field({"required":false,"type":QuizAttemptAnswerAttemptIdQuestionIdCompoundUniqueInput}),
  AND: t.field({"required":false,"type":[QuizAttemptAnswerWhereInput]}),
  OR: t.field({"required":false,"type":[QuizAttemptAnswerWhereInput]}),
  NOT: t.field({"required":false,"type":[QuizAttemptAnswerWhereInput]}),
  attemptId: t.field({"required":false,"type":UuidFilter}),
  questionId: t.field({"required":false,"type":UuidFilter}),
  answer: t.field({"required":false,"type":JsonNullableFilter}),
  isCorrect: t.field({"required":false,"type":BoolNullableFilter}),
  attempt: t.field({"required":false,"type":QuizAttemptWhereInput}),
  question: t.field({"required":false,"type":QuizQuestionWhereInput}),
});
export const QuizAttemptAnswerWhereUniqueInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptAnswerWhereUniqueInput>, false>('QuizAttemptAnswerWhereUniqueInput').implement({
  fields: QuizAttemptAnswerWhereUniqueInputFields,
});

export const QuizAttemptAnswerOrderByWithAggregationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  attemptId: t.field({"required":false,"type":SortOrder}),
  questionId: t.field({"required":false,"type":SortOrder}),
  answer: t.field({"required":false,"type":SortOrder}),
  isCorrect: t.field({"required":false,"type":SortOrder}),
  _count: t.field({"required":false,"type":QuizAttemptAnswerCountOrderByAggregateInput}),
  _max: t.field({"required":false,"type":QuizAttemptAnswerMaxOrderByAggregateInput}),
  _min: t.field({"required":false,"type":QuizAttemptAnswerMinOrderByAggregateInput}),
});
export const QuizAttemptAnswerOrderByWithAggregationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptAnswerOrderByWithAggregationInput>, false>('QuizAttemptAnswerOrderByWithAggregationInput').implement({
  fields: QuizAttemptAnswerOrderByWithAggregationInputFields,
});

export const QuizAttemptAnswerScalarWhereWithAggregatesInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[QuizAttemptAnswerScalarWhereWithAggregatesInput]}),
  OR: t.field({"required":false,"type":[QuizAttemptAnswerScalarWhereWithAggregatesInput]}),
  NOT: t.field({"required":false,"type":[QuizAttemptAnswerScalarWhereWithAggregatesInput]}),
  id: t.field({"required":false,"type":UuidWithAggregatesFilter}),
  attemptId: t.field({"required":false,"type":UuidWithAggregatesFilter}),
  questionId: t.field({"required":false,"type":UuidWithAggregatesFilter}),
  answer: t.field({"required":false,"type":JsonNullableWithAggregatesFilter}),
  isCorrect: t.field({"required":false,"type":BoolNullableWithAggregatesFilter}),
});
export const QuizAttemptAnswerScalarWhereWithAggregatesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptAnswerScalarWhereWithAggregatesInput>, false>('QuizAttemptAnswerScalarWhereWithAggregatesInput').implement({
  fields: QuizAttemptAnswerScalarWhereWithAggregatesInputFields,
});

export const UserNodeProgressWhereInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[UserNodeProgressWhereInput]}),
  OR: t.field({"required":false,"type":[UserNodeProgressWhereInput]}),
  NOT: t.field({"required":false,"type":[UserNodeProgressWhereInput]}),
  id: t.field({"required":false,"type":UuidFilter}),
  userId: t.field({"required":false,"type":StringFilter}),
  nodeId: t.field({"required":false,"type":UuidFilter}),
  status: t.field({"required":false,"type":EnumProgressStatusFilter}),
  completedAt: t.field({"required":false,"type":DateTimeNullableFilter}),
  createdAt: t.field({"required":false,"type":DateTimeFilter}),
  updatedAt: t.field({"required":false,"type":DateTimeFilter}),
  user: t.field({"required":false,"type":UserWhereInput}),
  node: t.field({"required":false,"type":SkillNodeWhereInput}),
});
export const UserNodeProgressWhereInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserNodeProgressWhereInput>, false>('UserNodeProgressWhereInput').implement({
  fields: UserNodeProgressWhereInputFields,
});

export const UserNodeProgressOrderByWithRelationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  userId: t.field({"required":false,"type":SortOrder}),
  nodeId: t.field({"required":false,"type":SortOrder}),
  status: t.field({"required":false,"type":SortOrder}),
  completedAt: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
  user: t.field({"required":false,"type":UserOrderByWithRelationInput}),
  node: t.field({"required":false,"type":SkillNodeOrderByWithRelationInput}),
});
export const UserNodeProgressOrderByWithRelationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserNodeProgressOrderByWithRelationInput>, false>('UserNodeProgressOrderByWithRelationInput').implement({
  fields: UserNodeProgressOrderByWithRelationInputFields,
});

export const UserNodeProgressWhereUniqueInputFields = (t: any) => ({
  id: t.string({"required":false}),
  userId_nodeId: t.field({"required":false,"type":UserNodeProgressUserIdNodeIdCompoundUniqueInput}),
  AND: t.field({"required":false,"type":[UserNodeProgressWhereInput]}),
  OR: t.field({"required":false,"type":[UserNodeProgressWhereInput]}),
  NOT: t.field({"required":false,"type":[UserNodeProgressWhereInput]}),
  userId: t.field({"required":false,"type":StringFilter}),
  nodeId: t.field({"required":false,"type":UuidFilter}),
  status: t.field({"required":false,"type":EnumProgressStatusFilter}),
  completedAt: t.field({"required":false,"type":DateTimeNullableFilter}),
  createdAt: t.field({"required":false,"type":DateTimeFilter}),
  updatedAt: t.field({"required":false,"type":DateTimeFilter}),
  user: t.field({"required":false,"type":UserWhereInput}),
  node: t.field({"required":false,"type":SkillNodeWhereInput}),
});
export const UserNodeProgressWhereUniqueInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserNodeProgressWhereUniqueInput>, false>('UserNodeProgressWhereUniqueInput').implement({
  fields: UserNodeProgressWhereUniqueInputFields,
});

export const UserNodeProgressOrderByWithAggregationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  userId: t.field({"required":false,"type":SortOrder}),
  nodeId: t.field({"required":false,"type":SortOrder}),
  status: t.field({"required":false,"type":SortOrder}),
  completedAt: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
  _count: t.field({"required":false,"type":UserNodeProgressCountOrderByAggregateInput}),
  _max: t.field({"required":false,"type":UserNodeProgressMaxOrderByAggregateInput}),
  _min: t.field({"required":false,"type":UserNodeProgressMinOrderByAggregateInput}),
});
export const UserNodeProgressOrderByWithAggregationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserNodeProgressOrderByWithAggregationInput>, false>('UserNodeProgressOrderByWithAggregationInput').implement({
  fields: UserNodeProgressOrderByWithAggregationInputFields,
});

export const UserNodeProgressScalarWhereWithAggregatesInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[UserNodeProgressScalarWhereWithAggregatesInput]}),
  OR: t.field({"required":false,"type":[UserNodeProgressScalarWhereWithAggregatesInput]}),
  NOT: t.field({"required":false,"type":[UserNodeProgressScalarWhereWithAggregatesInput]}),
  id: t.field({"required":false,"type":UuidWithAggregatesFilter}),
  userId: t.field({"required":false,"type":StringWithAggregatesFilter}),
  nodeId: t.field({"required":false,"type":UuidWithAggregatesFilter}),
  status: t.field({"required":false,"type":EnumProgressStatusWithAggregatesFilter}),
  completedAt: t.field({"required":false,"type":DateTimeNullableWithAggregatesFilter}),
  createdAt: t.field({"required":false,"type":DateTimeWithAggregatesFilter}),
  updatedAt: t.field({"required":false,"type":DateTimeWithAggregatesFilter}),
});
export const UserNodeProgressScalarWhereWithAggregatesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserNodeProgressScalarWhereWithAggregatesInput>, false>('UserNodeProgressScalarWhereWithAggregatesInput').implement({
  fields: UserNodeProgressScalarWhereWithAggregatesInputFields,
});

export const UserCreateInputFields = (t: any) => ({
  id: t.string({"required":true}),
  email: t.string({"required":true}),
  name: t.string({"required":false}),
  photoUrl: t.string({"required":false}),
  role: t.field({"required":false,"type":Role}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  coursesAuthored: t.field({"required":false,"type":CourseCreateNestedManyWithoutAuthorInput}),
  nodeProgress: t.field({"required":false,"type":UserNodeProgressCreateNestedManyWithoutUserInput}),
  quizAttempts: t.field({"required":false,"type":QuizAttemptCreateNestedManyWithoutUserInput}),
});
export const UserCreateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserCreateInput>, false>('UserCreateInput').implement({
  fields: UserCreateInputFields,
});

export const UserUpdateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  email: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  name: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  photoUrl: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  role: t.field({"required":false,"type":EnumRoleFieldUpdateOperationsInput}),
  createdAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updatedAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  coursesAuthored: t.field({"required":false,"type":CourseUpdateManyWithoutAuthorNestedInput}),
  nodeProgress: t.field({"required":false,"type":UserNodeProgressUpdateManyWithoutUserNestedInput}),
  quizAttempts: t.field({"required":false,"type":QuizAttemptUpdateManyWithoutUserNestedInput}),
});
export const UserUpdateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserUpdateInput>, false>('UserUpdateInput').implement({
  fields: UserUpdateInputFields,
});

export const UserCreateManyInputFields = (t: any) => ({
  id: t.string({"required":true}),
  email: t.string({"required":true}),
  name: t.string({"required":false}),
  photoUrl: t.string({"required":false}),
  role: t.field({"required":false,"type":Role}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
});
export const UserCreateManyInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserCreateManyInput>, false>('UserCreateManyInput').implement({
  fields: UserCreateManyInputFields,
});

export const UserUpdateManyMutationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  email: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  name: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  photoUrl: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  role: t.field({"required":false,"type":EnumRoleFieldUpdateOperationsInput}),
  createdAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updatedAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
});
export const UserUpdateManyMutationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserUpdateManyMutationInput>, false>('UserUpdateManyMutationInput').implement({
  fields: UserUpdateManyMutationInputFields,
});

export const CourseCreateInputFields = (t: any) => ({
  id: t.string({"required":false}),
  title: t.string({"required":true}),
  description: t.string({"required":false}),
  status: t.field({"required":false,"type":CourseStatus}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  deletedAt: t.field({"required":false,"type":DateTime}),
  author: t.field({"required":true,"type":UserCreateNestedOneWithoutCoursesAuthoredInput}),
  trees: t.field({"required":false,"type":SkillTreeCreateNestedManyWithoutCourseInput}),
});
export const CourseCreateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CourseCreateInput>, false>('CourseCreateInput').implement({
  fields: CourseCreateInputFields,
});

export const CourseUpdateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  title: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  description: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  status: t.field({"required":false,"type":EnumCourseStatusFieldUpdateOperationsInput}),
  createdAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updatedAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  deletedAt: t.field({"required":false,"type":NullableDateTimeFieldUpdateOperationsInput}),
  author: t.field({"required":false,"type":UserUpdateOneRequiredWithoutCoursesAuthoredNestedInput}),
  trees: t.field({"required":false,"type":SkillTreeUpdateManyWithoutCourseNestedInput}),
});
export const CourseUpdateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CourseUpdateInput>, false>('CourseUpdateInput').implement({
  fields: CourseUpdateInputFields,
});

export const CourseCreateManyInputFields = (t: any) => ({
  id: t.string({"required":false}),
  title: t.string({"required":true}),
  description: t.string({"required":false}),
  authorId: t.string({"required":true}),
  status: t.field({"required":false,"type":CourseStatus}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  deletedAt: t.field({"required":false,"type":DateTime}),
});
export const CourseCreateManyInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CourseCreateManyInput>, false>('CourseCreateManyInput').implement({
  fields: CourseCreateManyInputFields,
});

export const CourseUpdateManyMutationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  title: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  description: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  status: t.field({"required":false,"type":EnumCourseStatusFieldUpdateOperationsInput}),
  createdAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updatedAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  deletedAt: t.field({"required":false,"type":NullableDateTimeFieldUpdateOperationsInput}),
});
export const CourseUpdateManyMutationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CourseUpdateManyMutationInput>, false>('CourseUpdateManyMutationInput').implement({
  fields: CourseUpdateManyMutationInputFields,
});

export const SkillTreeCreateInputFields = (t: any) => ({
  id: t.string({"required":false}),
  title: t.string({"required":true}),
  description: t.string({"required":false}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  deletedAt: t.field({"required":false,"type":DateTime}),
  course: t.field({"required":true,"type":CourseCreateNestedOneWithoutTreesInput}),
  nodes: t.field({"required":false,"type":SkillNodeCreateNestedManyWithoutTreeInput}),
});
export const SkillTreeCreateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillTreeCreateInput>, false>('SkillTreeCreateInput').implement({
  fields: SkillTreeCreateInputFields,
});

export const SkillTreeUpdateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  title: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  description: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  createdAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updatedAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  deletedAt: t.field({"required":false,"type":NullableDateTimeFieldUpdateOperationsInput}),
  course: t.field({"required":false,"type":CourseUpdateOneRequiredWithoutTreesNestedInput}),
  nodes: t.field({"required":false,"type":SkillNodeUpdateManyWithoutTreeNestedInput}),
});
export const SkillTreeUpdateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillTreeUpdateInput>, false>('SkillTreeUpdateInput').implement({
  fields: SkillTreeUpdateInputFields,
});

export const SkillTreeCreateManyInputFields = (t: any) => ({
  id: t.string({"required":false}),
  courseId: t.string({"required":true}),
  title: t.string({"required":true}),
  description: t.string({"required":false}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  deletedAt: t.field({"required":false,"type":DateTime}),
});
export const SkillTreeCreateManyInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillTreeCreateManyInput>, false>('SkillTreeCreateManyInput').implement({
  fields: SkillTreeCreateManyInputFields,
});

export const SkillTreeUpdateManyMutationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  title: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  description: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  createdAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updatedAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  deletedAt: t.field({"required":false,"type":NullableDateTimeFieldUpdateOperationsInput}),
});
export const SkillTreeUpdateManyMutationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillTreeUpdateManyMutationInput>, false>('SkillTreeUpdateManyMutationInput').implement({
  fields: SkillTreeUpdateManyMutationInputFields,
});

export const SkillNodeCreateInputFields = (t: any) => ({
  id: t.string({"required":false}),
  title: t.string({"required":true}),
  step: t.int({"required":false}),
  orderInStep: t.int({"required":false}),
  posX: t.int({"required":false}),
  posY: t.int({"required":false}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  deletedAt: t.field({"required":false,"type":DateTime}),
  tree: t.field({"required":true,"type":SkillTreeCreateNestedOneWithoutNodesInput}),
  lessons: t.field({"required":false,"type":LessonBlocksCreateNestedManyWithoutNodeInput}),
  quiz: t.field({"required":false,"type":QuizCreateNestedOneWithoutNodeInput}),
  prerequisites: t.field({"required":false,"type":SkillNodePrerequisiteCreateNestedManyWithoutNodeInput}),
  requiredFor: t.field({"required":false,"type":SkillNodePrerequisiteCreateNestedManyWithoutDependsOnInput}),
  progresses: t.field({"required":false,"type":UserNodeProgressCreateNestedManyWithoutNodeInput}),
});
export const SkillNodeCreateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeCreateInput>, false>('SkillNodeCreateInput').implement({
  fields: SkillNodeCreateInputFields,
});

export const SkillNodeUpdateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  title: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  step: t.field({"required":false,"type":IntFieldUpdateOperationsInput}),
  orderInStep: t.field({"required":false,"type":IntFieldUpdateOperationsInput}),
  posX: t.field({"required":false,"type":NullableIntFieldUpdateOperationsInput}),
  posY: t.field({"required":false,"type":NullableIntFieldUpdateOperationsInput}),
  createdAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updatedAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  deletedAt: t.field({"required":false,"type":NullableDateTimeFieldUpdateOperationsInput}),
  tree: t.field({"required":false,"type":SkillTreeUpdateOneRequiredWithoutNodesNestedInput}),
  lessons: t.field({"required":false,"type":LessonBlocksUpdateManyWithoutNodeNestedInput}),
  quiz: t.field({"required":false,"type":QuizUpdateOneWithoutNodeNestedInput}),
  prerequisites: t.field({"required":false,"type":SkillNodePrerequisiteUpdateManyWithoutNodeNestedInput}),
  requiredFor: t.field({"required":false,"type":SkillNodePrerequisiteUpdateManyWithoutDependsOnNestedInput}),
  progresses: t.field({"required":false,"type":UserNodeProgressUpdateManyWithoutNodeNestedInput}),
});
export const SkillNodeUpdateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeUpdateInput>, false>('SkillNodeUpdateInput').implement({
  fields: SkillNodeUpdateInputFields,
});

export const SkillNodeCreateManyInputFields = (t: any) => ({
  id: t.string({"required":false}),
  treeId: t.string({"required":true}),
  title: t.string({"required":true}),
  step: t.int({"required":false}),
  orderInStep: t.int({"required":false}),
  posX: t.int({"required":false}),
  posY: t.int({"required":false}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  deletedAt: t.field({"required":false,"type":DateTime}),
});
export const SkillNodeCreateManyInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeCreateManyInput>, false>('SkillNodeCreateManyInput').implement({
  fields: SkillNodeCreateManyInputFields,
});

export const SkillNodeUpdateManyMutationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  title: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  step: t.field({"required":false,"type":IntFieldUpdateOperationsInput}),
  orderInStep: t.field({"required":false,"type":IntFieldUpdateOperationsInput}),
  posX: t.field({"required":false,"type":NullableIntFieldUpdateOperationsInput}),
  posY: t.field({"required":false,"type":NullableIntFieldUpdateOperationsInput}),
  createdAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updatedAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  deletedAt: t.field({"required":false,"type":NullableDateTimeFieldUpdateOperationsInput}),
});
export const SkillNodeUpdateManyMutationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeUpdateManyMutationInput>, false>('SkillNodeUpdateManyMutationInput').implement({
  fields: SkillNodeUpdateManyMutationInputFields,
});

export const SkillNodePrerequisiteCreateInputFields = (t: any) => ({
  node: t.field({"required":true,"type":SkillNodeCreateNestedOneWithoutPrerequisitesInput}),
  dependsOn: t.field({"required":true,"type":SkillNodeCreateNestedOneWithoutRequiredForInput}),
});
export const SkillNodePrerequisiteCreateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodePrerequisiteCreateInput>, false>('SkillNodePrerequisiteCreateInput').implement({
  fields: SkillNodePrerequisiteCreateInputFields,
});

export const SkillNodePrerequisiteUpdateInputFields = (t: any) => ({
  node: t.field({"required":false,"type":SkillNodeUpdateOneRequiredWithoutPrerequisitesNestedInput}),
  dependsOn: t.field({"required":false,"type":SkillNodeUpdateOneRequiredWithoutRequiredForNestedInput}),
});
export const SkillNodePrerequisiteUpdateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodePrerequisiteUpdateInput>, false>('SkillNodePrerequisiteUpdateInput').implement({
  fields: SkillNodePrerequisiteUpdateInputFields,
});

export const SkillNodePrerequisiteCreateManyInputFields = (t: any) => ({
  nodeId: t.string({"required":true}),
  dependsOnNodeId: t.string({"required":true}),
});
export const SkillNodePrerequisiteCreateManyInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodePrerequisiteCreateManyInput>, false>('SkillNodePrerequisiteCreateManyInput').implement({
  fields: SkillNodePrerequisiteCreateManyInputFields,
});

export const SkillNodePrerequisiteUpdateManyMutationInputFields = (t: any) => ({
  _: t.field({ type: NEVER }),
});
export const SkillNodePrerequisiteUpdateManyMutationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodePrerequisiteUpdateManyMutationInput>, false>('SkillNodePrerequisiteUpdateManyMutationInput').implement({
  fields: SkillNodePrerequisiteUpdateManyMutationInputFields,
});

export const LessonBlocksCreateInputFields = (t: any) => ({
  id: t.string({"required":false}),
  type: t.field({"required":true,"type":ContentType}),
  url: t.string({"required":false}),
  html: t.string({"required":false}),
  caption: t.string({"required":false}),
  order: t.int({"required":false}),
  meta: t.field({"required":false,"type":Json}),
  status: t.field({"required":false,"type":LessonStatus}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  deletedAt: t.field({"required":false,"type":DateTime}),
  node: t.field({"required":true,"type":SkillNodeCreateNestedOneWithoutLessonsInput}),
});
export const LessonBlocksCreateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.LessonBlocksCreateInput>, false>('LessonBlocksCreateInput').implement({
  fields: LessonBlocksCreateInputFields,
});

export const LessonBlocksUpdateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  type: t.field({"required":false,"type":EnumContentTypeFieldUpdateOperationsInput}),
  url: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  html: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  caption: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  order: t.field({"required":false,"type":IntFieldUpdateOperationsInput}),
  meta: t.field({"required":false,"type":Json}),
  status: t.field({"required":false,"type":EnumLessonStatusFieldUpdateOperationsInput}),
  createdAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updatedAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  deletedAt: t.field({"required":false,"type":NullableDateTimeFieldUpdateOperationsInput}),
  node: t.field({"required":false,"type":SkillNodeUpdateOneRequiredWithoutLessonsNestedInput}),
});
export const LessonBlocksUpdateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.LessonBlocksUpdateInput>, false>('LessonBlocksUpdateInput').implement({
  fields: LessonBlocksUpdateInputFields,
});

export const LessonBlocksCreateManyInputFields = (t: any) => ({
  id: t.string({"required":false}),
  nodeId: t.string({"required":true}),
  type: t.field({"required":true,"type":ContentType}),
  url: t.string({"required":false}),
  html: t.string({"required":false}),
  caption: t.string({"required":false}),
  order: t.int({"required":false}),
  meta: t.field({"required":false,"type":Json}),
  status: t.field({"required":false,"type":LessonStatus}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  deletedAt: t.field({"required":false,"type":DateTime}),
});
export const LessonBlocksCreateManyInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.LessonBlocksCreateManyInput>, false>('LessonBlocksCreateManyInput').implement({
  fields: LessonBlocksCreateManyInputFields,
});

export const LessonBlocksUpdateManyMutationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  type: t.field({"required":false,"type":EnumContentTypeFieldUpdateOperationsInput}),
  url: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  html: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  caption: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  order: t.field({"required":false,"type":IntFieldUpdateOperationsInput}),
  meta: t.field({"required":false,"type":Json}),
  status: t.field({"required":false,"type":EnumLessonStatusFieldUpdateOperationsInput}),
  createdAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updatedAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  deletedAt: t.field({"required":false,"type":NullableDateTimeFieldUpdateOperationsInput}),
});
export const LessonBlocksUpdateManyMutationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.LessonBlocksUpdateManyMutationInput>, false>('LessonBlocksUpdateManyMutationInput').implement({
  fields: LessonBlocksUpdateManyMutationInputFields,
});

export const QuizCreateInputFields = (t: any) => ({
  id: t.string({"required":false}),
  title: t.string({"required":false}),
  required: t.boolean({"required":false}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  deletedAt: t.field({"required":false,"type":DateTime}),
  node: t.field({"required":true,"type":SkillNodeCreateNestedOneWithoutQuizInput}),
  questions: t.field({"required":false,"type":QuizQuestionCreateNestedManyWithoutQuizInput}),
  attempts: t.field({"required":false,"type":QuizAttemptCreateNestedManyWithoutQuizInput}),
});
export const QuizCreateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizCreateInput>, false>('QuizCreateInput').implement({
  fields: QuizCreateInputFields,
});

export const QuizUpdateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  title: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  required: t.field({"required":false,"type":BoolFieldUpdateOperationsInput}),
  createdAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updatedAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  deletedAt: t.field({"required":false,"type":NullableDateTimeFieldUpdateOperationsInput}),
  node: t.field({"required":false,"type":SkillNodeUpdateOneRequiredWithoutQuizNestedInput}),
  questions: t.field({"required":false,"type":QuizQuestionUpdateManyWithoutQuizNestedInput}),
  attempts: t.field({"required":false,"type":QuizAttemptUpdateManyWithoutQuizNestedInput}),
});
export const QuizUpdateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizUpdateInput>, false>('QuizUpdateInput').implement({
  fields: QuizUpdateInputFields,
});

export const QuizCreateManyInputFields = (t: any) => ({
  id: t.string({"required":false}),
  nodeId: t.string({"required":true}),
  title: t.string({"required":false}),
  required: t.boolean({"required":false}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  deletedAt: t.field({"required":false,"type":DateTime}),
});
export const QuizCreateManyInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizCreateManyInput>, false>('QuizCreateManyInput').implement({
  fields: QuizCreateManyInputFields,
});

export const QuizUpdateManyMutationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  title: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  required: t.field({"required":false,"type":BoolFieldUpdateOperationsInput}),
  createdAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updatedAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  deletedAt: t.field({"required":false,"type":NullableDateTimeFieldUpdateOperationsInput}),
});
export const QuizUpdateManyMutationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizUpdateManyMutationInput>, false>('QuizUpdateManyMutationInput').implement({
  fields: QuizUpdateManyMutationInputFields,
});

export const QuizQuestionCreateInputFields = (t: any) => ({
  id: t.string({"required":false}),
  type: t.field({"required":true,"type":QuestionType}),
  prompt: t.string({"required":true}),
  order: t.int({"required":false}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  quiz: t.field({"required":true,"type":QuizCreateNestedOneWithoutQuestionsInput}),
  options: t.field({"required":false,"type":QuizOptionCreateNestedManyWithoutQuestionInput}),
  answers: t.field({"required":false,"type":QuizAttemptAnswerCreateNestedManyWithoutQuestionInput}),
});
export const QuizQuestionCreateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizQuestionCreateInput>, false>('QuizQuestionCreateInput').implement({
  fields: QuizQuestionCreateInputFields,
});

export const QuizQuestionUpdateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  type: t.field({"required":false,"type":EnumQuestionTypeFieldUpdateOperationsInput}),
  prompt: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  order: t.field({"required":false,"type":IntFieldUpdateOperationsInput}),
  createdAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updatedAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  quiz: t.field({"required":false,"type":QuizUpdateOneRequiredWithoutQuestionsNestedInput}),
  options: t.field({"required":false,"type":QuizOptionUpdateManyWithoutQuestionNestedInput}),
  answers: t.field({"required":false,"type":QuizAttemptAnswerUpdateManyWithoutQuestionNestedInput}),
});
export const QuizQuestionUpdateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizQuestionUpdateInput>, false>('QuizQuestionUpdateInput').implement({
  fields: QuizQuestionUpdateInputFields,
});

export const QuizQuestionCreateManyInputFields = (t: any) => ({
  id: t.string({"required":false}),
  quizId: t.string({"required":true}),
  type: t.field({"required":true,"type":QuestionType}),
  prompt: t.string({"required":true}),
  order: t.int({"required":false}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
});
export const QuizQuestionCreateManyInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizQuestionCreateManyInput>, false>('QuizQuestionCreateManyInput').implement({
  fields: QuizQuestionCreateManyInputFields,
});

export const QuizQuestionUpdateManyMutationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  type: t.field({"required":false,"type":EnumQuestionTypeFieldUpdateOperationsInput}),
  prompt: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  order: t.field({"required":false,"type":IntFieldUpdateOperationsInput}),
  createdAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updatedAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
});
export const QuizQuestionUpdateManyMutationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizQuestionUpdateManyMutationInput>, false>('QuizQuestionUpdateManyMutationInput').implement({
  fields: QuizQuestionUpdateManyMutationInputFields,
});

export const QuizOptionCreateInputFields = (t: any) => ({
  id: t.string({"required":false}),
  text: t.string({"required":true}),
  isCorrect: t.boolean({"required":false}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  question: t.field({"required":true,"type":QuizQuestionCreateNestedOneWithoutOptionsInput}),
});
export const QuizOptionCreateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizOptionCreateInput>, false>('QuizOptionCreateInput').implement({
  fields: QuizOptionCreateInputFields,
});

export const QuizOptionUpdateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  text: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  isCorrect: t.field({"required":false,"type":BoolFieldUpdateOperationsInput}),
  createdAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updatedAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  question: t.field({"required":false,"type":QuizQuestionUpdateOneRequiredWithoutOptionsNestedInput}),
});
export const QuizOptionUpdateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizOptionUpdateInput>, false>('QuizOptionUpdateInput').implement({
  fields: QuizOptionUpdateInputFields,
});

export const QuizOptionCreateManyInputFields = (t: any) => ({
  id: t.string({"required":false}),
  questionId: t.string({"required":true}),
  text: t.string({"required":true}),
  isCorrect: t.boolean({"required":false}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
});
export const QuizOptionCreateManyInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizOptionCreateManyInput>, false>('QuizOptionCreateManyInput').implement({
  fields: QuizOptionCreateManyInputFields,
});

export const QuizOptionUpdateManyMutationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  text: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  isCorrect: t.field({"required":false,"type":BoolFieldUpdateOperationsInput}),
  createdAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updatedAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
});
export const QuizOptionUpdateManyMutationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizOptionUpdateManyMutationInput>, false>('QuizOptionUpdateManyMutationInput').implement({
  fields: QuizOptionUpdateManyMutationInputFields,
});

export const QuizAttemptCreateInputFields = (t: any) => ({
  id: t.string({"required":false}),
  passed: t.boolean({"required":true}),
  takenAt: t.field({"required":false,"type":DateTime}),
  quiz: t.field({"required":true,"type":QuizCreateNestedOneWithoutAttemptsInput}),
  user: t.field({"required":true,"type":UserCreateNestedOneWithoutQuizAttemptsInput}),
  answers: t.field({"required":false,"type":QuizAttemptAnswerCreateNestedManyWithoutAttemptInput}),
});
export const QuizAttemptCreateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptCreateInput>, false>('QuizAttemptCreateInput').implement({
  fields: QuizAttemptCreateInputFields,
});

export const QuizAttemptUpdateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  passed: t.field({"required":false,"type":BoolFieldUpdateOperationsInput}),
  takenAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  quiz: t.field({"required":false,"type":QuizUpdateOneRequiredWithoutAttemptsNestedInput}),
  user: t.field({"required":false,"type":UserUpdateOneRequiredWithoutQuizAttemptsNestedInput}),
  answers: t.field({"required":false,"type":QuizAttemptAnswerUpdateManyWithoutAttemptNestedInput}),
});
export const QuizAttemptUpdateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptUpdateInput>, false>('QuizAttemptUpdateInput').implement({
  fields: QuizAttemptUpdateInputFields,
});

export const QuizAttemptCreateManyInputFields = (t: any) => ({
  id: t.string({"required":false}),
  quizId: t.string({"required":true}),
  userId: t.string({"required":true}),
  passed: t.boolean({"required":true}),
  takenAt: t.field({"required":false,"type":DateTime}),
});
export const QuizAttemptCreateManyInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptCreateManyInput>, false>('QuizAttemptCreateManyInput').implement({
  fields: QuizAttemptCreateManyInputFields,
});

export const QuizAttemptUpdateManyMutationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  passed: t.field({"required":false,"type":BoolFieldUpdateOperationsInput}),
  takenAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
});
export const QuizAttemptUpdateManyMutationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptUpdateManyMutationInput>, false>('QuizAttemptUpdateManyMutationInput').implement({
  fields: QuizAttemptUpdateManyMutationInputFields,
});

export const QuizAttemptAnswerCreateInputFields = (t: any) => ({
  id: t.string({"required":false}),
  answer: t.field({"required":false,"type":Json}),
  isCorrect: t.boolean({"required":false}),
  attempt: t.field({"required":true,"type":QuizAttemptCreateNestedOneWithoutAnswersInput}),
  question: t.field({"required":true,"type":QuizQuestionCreateNestedOneWithoutAnswersInput}),
});
export const QuizAttemptAnswerCreateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptAnswerCreateInput>, false>('QuizAttemptAnswerCreateInput').implement({
  fields: QuizAttemptAnswerCreateInputFields,
});

export const QuizAttemptAnswerUpdateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  answer: t.field({"required":false,"type":Json}),
  isCorrect: t.field({"required":false,"type":NullableBoolFieldUpdateOperationsInput}),
  attempt: t.field({"required":false,"type":QuizAttemptUpdateOneRequiredWithoutAnswersNestedInput}),
  question: t.field({"required":false,"type":QuizQuestionUpdateOneRequiredWithoutAnswersNestedInput}),
});
export const QuizAttemptAnswerUpdateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptAnswerUpdateInput>, false>('QuizAttemptAnswerUpdateInput').implement({
  fields: QuizAttemptAnswerUpdateInputFields,
});

export const QuizAttemptAnswerCreateManyInputFields = (t: any) => ({
  id: t.string({"required":false}),
  attemptId: t.string({"required":true}),
  questionId: t.string({"required":true}),
  answer: t.field({"required":false,"type":Json}),
  isCorrect: t.boolean({"required":false}),
});
export const QuizAttemptAnswerCreateManyInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptAnswerCreateManyInput>, false>('QuizAttemptAnswerCreateManyInput').implement({
  fields: QuizAttemptAnswerCreateManyInputFields,
});

export const QuizAttemptAnswerUpdateManyMutationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  answer: t.field({"required":false,"type":Json}),
  isCorrect: t.field({"required":false,"type":NullableBoolFieldUpdateOperationsInput}),
});
export const QuizAttemptAnswerUpdateManyMutationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptAnswerUpdateManyMutationInput>, false>('QuizAttemptAnswerUpdateManyMutationInput').implement({
  fields: QuizAttemptAnswerUpdateManyMutationInputFields,
});

export const UserNodeProgressCreateInputFields = (t: any) => ({
  id: t.string({"required":false}),
  status: t.field({"required":false,"type":ProgressStatus}),
  completedAt: t.field({"required":false,"type":DateTime}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  user: t.field({"required":true,"type":UserCreateNestedOneWithoutNodeProgressInput}),
  node: t.field({"required":true,"type":SkillNodeCreateNestedOneWithoutProgressesInput}),
});
export const UserNodeProgressCreateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserNodeProgressCreateInput>, false>('UserNodeProgressCreateInput').implement({
  fields: UserNodeProgressCreateInputFields,
});

export const UserNodeProgressUpdateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  status: t.field({"required":false,"type":EnumProgressStatusFieldUpdateOperationsInput}),
  completedAt: t.field({"required":false,"type":NullableDateTimeFieldUpdateOperationsInput}),
  createdAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updatedAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  user: t.field({"required":false,"type":UserUpdateOneRequiredWithoutNodeProgressNestedInput}),
  node: t.field({"required":false,"type":SkillNodeUpdateOneRequiredWithoutProgressesNestedInput}),
});
export const UserNodeProgressUpdateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserNodeProgressUpdateInput>, false>('UserNodeProgressUpdateInput').implement({
  fields: UserNodeProgressUpdateInputFields,
});

export const UserNodeProgressCreateManyInputFields = (t: any) => ({
  id: t.string({"required":false}),
  userId: t.string({"required":true}),
  nodeId: t.string({"required":true}),
  status: t.field({"required":false,"type":ProgressStatus}),
  completedAt: t.field({"required":false,"type":DateTime}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
});
export const UserNodeProgressCreateManyInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserNodeProgressCreateManyInput>, false>('UserNodeProgressCreateManyInput').implement({
  fields: UserNodeProgressCreateManyInputFields,
});

export const UserNodeProgressUpdateManyMutationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  status: t.field({"required":false,"type":EnumProgressStatusFieldUpdateOperationsInput}),
  completedAt: t.field({"required":false,"type":NullableDateTimeFieldUpdateOperationsInput}),
  createdAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updatedAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
});
export const UserNodeProgressUpdateManyMutationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserNodeProgressUpdateManyMutationInput>, false>('UserNodeProgressUpdateManyMutationInput').implement({
  fields: UserNodeProgressUpdateManyMutationInputFields,
});

export const StringFilterFields = (t: any) => ({
  equals: t.string({"required":false}),
  in: t.stringList({"required":false}),
  notIn: t.stringList({"required":false}),
  lt: t.string({"required":false}),
  lte: t.string({"required":false}),
  gt: t.string({"required":false}),
  gte: t.string({"required":false}),
  contains: t.string({"required":false}),
  startsWith: t.string({"required":false}),
  endsWith: t.string({"required":false}),
  mode: t.field({"required":false,"type":QueryMode}),
  not: t.field({"required":false,"type":NestedStringFilter}),
});
export const StringFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.StringFilter>, false>('StringFilter').implement({
  fields: StringFilterFields,
});

export const StringNullableFilterFields = (t: any) => ({
  equals: t.string({"required":false}),
  in: t.stringList({"required":false}),
  notIn: t.stringList({"required":false}),
  lt: t.string({"required":false}),
  lte: t.string({"required":false}),
  gt: t.string({"required":false}),
  gte: t.string({"required":false}),
  contains: t.string({"required":false}),
  startsWith: t.string({"required":false}),
  endsWith: t.string({"required":false}),
  mode: t.field({"required":false,"type":QueryMode}),
  not: t.field({"required":false,"type":NestedStringNullableFilter}),
});
export const StringNullableFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.StringNullableFilter>, false>('StringNullableFilter').implement({
  fields: StringNullableFilterFields,
});

export const EnumRoleFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":Role}),
  in: t.field({"required":false,"type":[Role]}),
  notIn: t.field({"required":false,"type":[Role]}),
  not: t.field({"required":false,"type":Role}),
});
export const EnumRoleFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.EnumRoleFilter>, false>('EnumRoleFilter').implement({
  fields: EnumRoleFilterFields,
});

export const DateTimeFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":DateTime}),
  in: t.field({"required":false,"type":[DateTime]}),
  notIn: t.field({"required":false,"type":[DateTime]}),
  lt: t.field({"required":false,"type":DateTime}),
  lte: t.field({"required":false,"type":DateTime}),
  gt: t.field({"required":false,"type":DateTime}),
  gte: t.field({"required":false,"type":DateTime}),
  not: t.field({"required":false,"type":NestedDateTimeFilter}),
});
export const DateTimeFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.DateTimeFilter>, false>('DateTimeFilter').implement({
  fields: DateTimeFilterFields,
});

export const CourseListRelationFilterFields = (t: any) => ({
  every: t.field({"required":false,"type":CourseWhereInput}),
  some: t.field({"required":false,"type":CourseWhereInput}),
  none: t.field({"required":false,"type":CourseWhereInput}),
});
export const CourseListRelationFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CourseListRelationFilter>, false>('CourseListRelationFilter').implement({
  fields: CourseListRelationFilterFields,
});

export const UserNodeProgressListRelationFilterFields = (t: any) => ({
  every: t.field({"required":false,"type":UserNodeProgressWhereInput}),
  some: t.field({"required":false,"type":UserNodeProgressWhereInput}),
  none: t.field({"required":false,"type":UserNodeProgressWhereInput}),
});
export const UserNodeProgressListRelationFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserNodeProgressListRelationFilter>, false>('UserNodeProgressListRelationFilter').implement({
  fields: UserNodeProgressListRelationFilterFields,
});

export const QuizAttemptListRelationFilterFields = (t: any) => ({
  every: t.field({"required":false,"type":QuizAttemptWhereInput}),
  some: t.field({"required":false,"type":QuizAttemptWhereInput}),
  none: t.field({"required":false,"type":QuizAttemptWhereInput}),
});
export const QuizAttemptListRelationFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptListRelationFilter>, false>('QuizAttemptListRelationFilter').implement({
  fields: QuizAttemptListRelationFilterFields,
});

export const CourseOrderByRelationAggregateInputFields = (t: any) => ({
  _count: t.field({"required":false,"type":SortOrder}),
});
export const CourseOrderByRelationAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CourseOrderByRelationAggregateInput>, false>('CourseOrderByRelationAggregateInput').implement({
  fields: CourseOrderByRelationAggregateInputFields,
});

export const UserNodeProgressOrderByRelationAggregateInputFields = (t: any) => ({
  _count: t.field({"required":false,"type":SortOrder}),
});
export const UserNodeProgressOrderByRelationAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserNodeProgressOrderByRelationAggregateInput>, false>('UserNodeProgressOrderByRelationAggregateInput').implement({
  fields: UserNodeProgressOrderByRelationAggregateInputFields,
});

export const QuizAttemptOrderByRelationAggregateInputFields = (t: any) => ({
  _count: t.field({"required":false,"type":SortOrder}),
});
export const QuizAttemptOrderByRelationAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptOrderByRelationAggregateInput>, false>('QuizAttemptOrderByRelationAggregateInput').implement({
  fields: QuizAttemptOrderByRelationAggregateInputFields,
});

export const UserCountOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  email: t.field({"required":false,"type":SortOrder}),
  name: t.field({"required":false,"type":SortOrder}),
  photoUrl: t.field({"required":false,"type":SortOrder}),
  role: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
});
export const UserCountOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserCountOrderByAggregateInput>, false>('UserCountOrderByAggregateInput').implement({
  fields: UserCountOrderByAggregateInputFields,
});

export const UserMaxOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  email: t.field({"required":false,"type":SortOrder}),
  name: t.field({"required":false,"type":SortOrder}),
  photoUrl: t.field({"required":false,"type":SortOrder}),
  role: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
});
export const UserMaxOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserMaxOrderByAggregateInput>, false>('UserMaxOrderByAggregateInput').implement({
  fields: UserMaxOrderByAggregateInputFields,
});

export const UserMinOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  email: t.field({"required":false,"type":SortOrder}),
  name: t.field({"required":false,"type":SortOrder}),
  photoUrl: t.field({"required":false,"type":SortOrder}),
  role: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
});
export const UserMinOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserMinOrderByAggregateInput>, false>('UserMinOrderByAggregateInput').implement({
  fields: UserMinOrderByAggregateInputFields,
});

export const StringWithAggregatesFilterFields = (t: any) => ({
  equals: t.string({"required":false}),
  in: t.stringList({"required":false}),
  notIn: t.stringList({"required":false}),
  lt: t.string({"required":false}),
  lte: t.string({"required":false}),
  gt: t.string({"required":false}),
  gte: t.string({"required":false}),
  contains: t.string({"required":false}),
  startsWith: t.string({"required":false}),
  endsWith: t.string({"required":false}),
  mode: t.field({"required":false,"type":QueryMode}),
  not: t.field({"required":false,"type":NestedStringWithAggregatesFilter}),
  _count: t.field({"required":false,"type":NestedIntFilter}),
  _min: t.field({"required":false,"type":NestedStringFilter}),
  _max: t.field({"required":false,"type":NestedStringFilter}),
});
export const StringWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.StringWithAggregatesFilter>, false>('StringWithAggregatesFilter').implement({
  fields: StringWithAggregatesFilterFields,
});

export const StringNullableWithAggregatesFilterFields = (t: any) => ({
  equals: t.string({"required":false}),
  in: t.stringList({"required":false}),
  notIn: t.stringList({"required":false}),
  lt: t.string({"required":false}),
  lte: t.string({"required":false}),
  gt: t.string({"required":false}),
  gte: t.string({"required":false}),
  contains: t.string({"required":false}),
  startsWith: t.string({"required":false}),
  endsWith: t.string({"required":false}),
  mode: t.field({"required":false,"type":QueryMode}),
  not: t.field({"required":false,"type":NestedStringNullableWithAggregatesFilter}),
  _count: t.field({"required":false,"type":NestedIntNullableFilter}),
  _min: t.field({"required":false,"type":NestedStringNullableFilter}),
  _max: t.field({"required":false,"type":NestedStringNullableFilter}),
});
export const StringNullableWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.StringNullableWithAggregatesFilter>, false>('StringNullableWithAggregatesFilter').implement({
  fields: StringNullableWithAggregatesFilterFields,
});

export const EnumRoleWithAggregatesFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":Role}),
  in: t.field({"required":false,"type":[Role]}),
  notIn: t.field({"required":false,"type":[Role]}),
  not: t.field({"required":false,"type":Role}),
  _count: t.field({"required":false,"type":NestedIntFilter}),
  _min: t.field({"required":false,"type":NestedEnumRoleFilter}),
  _max: t.field({"required":false,"type":NestedEnumRoleFilter}),
});
export const EnumRoleWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.EnumRoleWithAggregatesFilter>, false>('EnumRoleWithAggregatesFilter').implement({
  fields: EnumRoleWithAggregatesFilterFields,
});

export const DateTimeWithAggregatesFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":DateTime}),
  in: t.field({"required":false,"type":[DateTime]}),
  notIn: t.field({"required":false,"type":[DateTime]}),
  lt: t.field({"required":false,"type":DateTime}),
  lte: t.field({"required":false,"type":DateTime}),
  gt: t.field({"required":false,"type":DateTime}),
  gte: t.field({"required":false,"type":DateTime}),
  not: t.field({"required":false,"type":NestedDateTimeWithAggregatesFilter}),
  _count: t.field({"required":false,"type":NestedIntFilter}),
  _min: t.field({"required":false,"type":NestedDateTimeFilter}),
  _max: t.field({"required":false,"type":NestedDateTimeFilter}),
});
export const DateTimeWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.DateTimeWithAggregatesFilter>, false>('DateTimeWithAggregatesFilter').implement({
  fields: DateTimeWithAggregatesFilterFields,
});

export const UuidFilterFields = (t: any) => ({
  equals: t.string({"required":false}),
  in: t.stringList({"required":false}),
  notIn: t.stringList({"required":false}),
  lt: t.string({"required":false}),
  lte: t.string({"required":false}),
  gt: t.string({"required":false}),
  gte: t.string({"required":false}),
  mode: t.field({"required":false,"type":QueryMode}),
  not: t.field({"required":false,"type":NestedUuidFilter}),
});
export const UuidFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UuidFilter>, false>('UuidFilter').implement({
  fields: UuidFilterFields,
});

export const EnumCourseStatusFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":CourseStatus}),
  in: t.field({"required":false,"type":[CourseStatus]}),
  notIn: t.field({"required":false,"type":[CourseStatus]}),
  not: t.field({"required":false,"type":CourseStatus}),
});
export const EnumCourseStatusFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.EnumCourseStatusFilter>, false>('EnumCourseStatusFilter').implement({
  fields: EnumCourseStatusFilterFields,
});

export const DateTimeNullableFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":DateTime}),
  in: t.field({"required":false,"type":[DateTime]}),
  notIn: t.field({"required":false,"type":[DateTime]}),
  lt: t.field({"required":false,"type":DateTime}),
  lte: t.field({"required":false,"type":DateTime}),
  gt: t.field({"required":false,"type":DateTime}),
  gte: t.field({"required":false,"type":DateTime}),
  not: t.field({"required":false,"type":NestedDateTimeNullableFilter}),
});
export const DateTimeNullableFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.DateTimeNullableFilter>, false>('DateTimeNullableFilter').implement({
  fields: DateTimeNullableFilterFields,
});

export const UserScalarRelationFilterFields = (t: any) => ({
  is: t.field({"required":false,"type":UserWhereInput}),
  isNot: t.field({"required":false,"type":UserWhereInput}),
});
export const UserScalarRelationFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserScalarRelationFilter>, false>('UserScalarRelationFilter').implement({
  fields: UserScalarRelationFilterFields,
});

export const SkillTreeListRelationFilterFields = (t: any) => ({
  every: t.field({"required":false,"type":SkillTreeWhereInput}),
  some: t.field({"required":false,"type":SkillTreeWhereInput}),
  none: t.field({"required":false,"type":SkillTreeWhereInput}),
});
export const SkillTreeListRelationFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillTreeListRelationFilter>, false>('SkillTreeListRelationFilter').implement({
  fields: SkillTreeListRelationFilterFields,
});

export const SkillTreeOrderByRelationAggregateInputFields = (t: any) => ({
  _count: t.field({"required":false,"type":SortOrder}),
});
export const SkillTreeOrderByRelationAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillTreeOrderByRelationAggregateInput>, false>('SkillTreeOrderByRelationAggregateInput').implement({
  fields: SkillTreeOrderByRelationAggregateInputFields,
});

export const CourseCountOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  title: t.field({"required":false,"type":SortOrder}),
  description: t.field({"required":false,"type":SortOrder}),
  authorId: t.field({"required":false,"type":SortOrder}),
  status: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
  deletedAt: t.field({"required":false,"type":SortOrder}),
});
export const CourseCountOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CourseCountOrderByAggregateInput>, false>('CourseCountOrderByAggregateInput').implement({
  fields: CourseCountOrderByAggregateInputFields,
});

export const CourseMaxOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  title: t.field({"required":false,"type":SortOrder}),
  description: t.field({"required":false,"type":SortOrder}),
  authorId: t.field({"required":false,"type":SortOrder}),
  status: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
  deletedAt: t.field({"required":false,"type":SortOrder}),
});
export const CourseMaxOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CourseMaxOrderByAggregateInput>, false>('CourseMaxOrderByAggregateInput').implement({
  fields: CourseMaxOrderByAggregateInputFields,
});

export const CourseMinOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  title: t.field({"required":false,"type":SortOrder}),
  description: t.field({"required":false,"type":SortOrder}),
  authorId: t.field({"required":false,"type":SortOrder}),
  status: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
  deletedAt: t.field({"required":false,"type":SortOrder}),
});
export const CourseMinOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CourseMinOrderByAggregateInput>, false>('CourseMinOrderByAggregateInput').implement({
  fields: CourseMinOrderByAggregateInputFields,
});

export const UuidWithAggregatesFilterFields = (t: any) => ({
  equals: t.string({"required":false}),
  in: t.stringList({"required":false}),
  notIn: t.stringList({"required":false}),
  lt: t.string({"required":false}),
  lte: t.string({"required":false}),
  gt: t.string({"required":false}),
  gte: t.string({"required":false}),
  mode: t.field({"required":false,"type":QueryMode}),
  not: t.field({"required":false,"type":NestedUuidWithAggregatesFilter}),
  _count: t.field({"required":false,"type":NestedIntFilter}),
  _min: t.field({"required":false,"type":NestedStringFilter}),
  _max: t.field({"required":false,"type":NestedStringFilter}),
});
export const UuidWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UuidWithAggregatesFilter>, false>('UuidWithAggregatesFilter').implement({
  fields: UuidWithAggregatesFilterFields,
});

export const EnumCourseStatusWithAggregatesFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":CourseStatus}),
  in: t.field({"required":false,"type":[CourseStatus]}),
  notIn: t.field({"required":false,"type":[CourseStatus]}),
  not: t.field({"required":false,"type":CourseStatus}),
  _count: t.field({"required":false,"type":NestedIntFilter}),
  _min: t.field({"required":false,"type":NestedEnumCourseStatusFilter}),
  _max: t.field({"required":false,"type":NestedEnumCourseStatusFilter}),
});
export const EnumCourseStatusWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.EnumCourseStatusWithAggregatesFilter>, false>('EnumCourseStatusWithAggregatesFilter').implement({
  fields: EnumCourseStatusWithAggregatesFilterFields,
});

export const DateTimeNullableWithAggregatesFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":DateTime}),
  in: t.field({"required":false,"type":[DateTime]}),
  notIn: t.field({"required":false,"type":[DateTime]}),
  lt: t.field({"required":false,"type":DateTime}),
  lte: t.field({"required":false,"type":DateTime}),
  gt: t.field({"required":false,"type":DateTime}),
  gte: t.field({"required":false,"type":DateTime}),
  not: t.field({"required":false,"type":NestedDateTimeNullableWithAggregatesFilter}),
  _count: t.field({"required":false,"type":NestedIntNullableFilter}),
  _min: t.field({"required":false,"type":NestedDateTimeNullableFilter}),
  _max: t.field({"required":false,"type":NestedDateTimeNullableFilter}),
});
export const DateTimeNullableWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.DateTimeNullableWithAggregatesFilter>, false>('DateTimeNullableWithAggregatesFilter').implement({
  fields: DateTimeNullableWithAggregatesFilterFields,
});

export const CourseScalarRelationFilterFields = (t: any) => ({
  is: t.field({"required":false,"type":CourseWhereInput}),
  isNot: t.field({"required":false,"type":CourseWhereInput}),
});
export const CourseScalarRelationFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CourseScalarRelationFilter>, false>('CourseScalarRelationFilter').implement({
  fields: CourseScalarRelationFilterFields,
});

export const SkillNodeListRelationFilterFields = (t: any) => ({
  every: t.field({"required":false,"type":SkillNodeWhereInput}),
  some: t.field({"required":false,"type":SkillNodeWhereInput}),
  none: t.field({"required":false,"type":SkillNodeWhereInput}),
});
export const SkillNodeListRelationFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeListRelationFilter>, false>('SkillNodeListRelationFilter').implement({
  fields: SkillNodeListRelationFilterFields,
});

export const SkillNodeOrderByRelationAggregateInputFields = (t: any) => ({
  _count: t.field({"required":false,"type":SortOrder}),
});
export const SkillNodeOrderByRelationAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeOrderByRelationAggregateInput>, false>('SkillNodeOrderByRelationAggregateInput').implement({
  fields: SkillNodeOrderByRelationAggregateInputFields,
});

export const SkillTreeCountOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  courseId: t.field({"required":false,"type":SortOrder}),
  title: t.field({"required":false,"type":SortOrder}),
  description: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
  deletedAt: t.field({"required":false,"type":SortOrder}),
});
export const SkillTreeCountOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillTreeCountOrderByAggregateInput>, false>('SkillTreeCountOrderByAggregateInput').implement({
  fields: SkillTreeCountOrderByAggregateInputFields,
});

export const SkillTreeMaxOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  courseId: t.field({"required":false,"type":SortOrder}),
  title: t.field({"required":false,"type":SortOrder}),
  description: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
  deletedAt: t.field({"required":false,"type":SortOrder}),
});
export const SkillTreeMaxOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillTreeMaxOrderByAggregateInput>, false>('SkillTreeMaxOrderByAggregateInput').implement({
  fields: SkillTreeMaxOrderByAggregateInputFields,
});

export const SkillTreeMinOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  courseId: t.field({"required":false,"type":SortOrder}),
  title: t.field({"required":false,"type":SortOrder}),
  description: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
  deletedAt: t.field({"required":false,"type":SortOrder}),
});
export const SkillTreeMinOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillTreeMinOrderByAggregateInput>, false>('SkillTreeMinOrderByAggregateInput').implement({
  fields: SkillTreeMinOrderByAggregateInputFields,
});

export const IntFilterFields = (t: any) => ({
  equals: t.int({"required":false}),
  in: t.intList({"required":false}),
  notIn: t.intList({"required":false}),
  lt: t.int({"required":false}),
  lte: t.int({"required":false}),
  gt: t.int({"required":false}),
  gte: t.int({"required":false}),
  not: t.field({"required":false,"type":NestedIntFilter}),
});
export const IntFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.IntFilter>, false>('IntFilter').implement({
  fields: IntFilterFields,
});

export const IntNullableFilterFields = (t: any) => ({
  equals: t.int({"required":false}),
  in: t.intList({"required":false}),
  notIn: t.intList({"required":false}),
  lt: t.int({"required":false}),
  lte: t.int({"required":false}),
  gt: t.int({"required":false}),
  gte: t.int({"required":false}),
  not: t.field({"required":false,"type":NestedIntNullableFilter}),
});
export const IntNullableFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.IntNullableFilter>, false>('IntNullableFilter').implement({
  fields: IntNullableFilterFields,
});

export const SkillTreeScalarRelationFilterFields = (t: any) => ({
  is: t.field({"required":false,"type":SkillTreeWhereInput}),
  isNot: t.field({"required":false,"type":SkillTreeWhereInput}),
});
export const SkillTreeScalarRelationFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillTreeScalarRelationFilter>, false>('SkillTreeScalarRelationFilter').implement({
  fields: SkillTreeScalarRelationFilterFields,
});

export const LessonBlocksListRelationFilterFields = (t: any) => ({
  every: t.field({"required":false,"type":LessonBlocksWhereInput}),
  some: t.field({"required":false,"type":LessonBlocksWhereInput}),
  none: t.field({"required":false,"type":LessonBlocksWhereInput}),
});
export const LessonBlocksListRelationFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.LessonBlocksListRelationFilter>, false>('LessonBlocksListRelationFilter').implement({
  fields: LessonBlocksListRelationFilterFields,
});

export const QuizNullableScalarRelationFilterFields = (t: any) => ({
  is: t.field({"required":false,"type":QuizWhereInput}),
  isNot: t.field({"required":false,"type":QuizWhereInput}),
});
export const QuizNullableScalarRelationFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizNullableScalarRelationFilter>, false>('QuizNullableScalarRelationFilter').implement({
  fields: QuizNullableScalarRelationFilterFields,
});

export const SkillNodePrerequisiteListRelationFilterFields = (t: any) => ({
  every: t.field({"required":false,"type":SkillNodePrerequisiteWhereInput}),
  some: t.field({"required":false,"type":SkillNodePrerequisiteWhereInput}),
  none: t.field({"required":false,"type":SkillNodePrerequisiteWhereInput}),
});
export const SkillNodePrerequisiteListRelationFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodePrerequisiteListRelationFilter>, false>('SkillNodePrerequisiteListRelationFilter').implement({
  fields: SkillNodePrerequisiteListRelationFilterFields,
});

export const LessonBlocksOrderByRelationAggregateInputFields = (t: any) => ({
  _count: t.field({"required":false,"type":SortOrder}),
});
export const LessonBlocksOrderByRelationAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.LessonBlocksOrderByRelationAggregateInput>, false>('LessonBlocksOrderByRelationAggregateInput').implement({
  fields: LessonBlocksOrderByRelationAggregateInputFields,
});

export const SkillNodePrerequisiteOrderByRelationAggregateInputFields = (t: any) => ({
  _count: t.field({"required":false,"type":SortOrder}),
});
export const SkillNodePrerequisiteOrderByRelationAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodePrerequisiteOrderByRelationAggregateInput>, false>('SkillNodePrerequisiteOrderByRelationAggregateInput').implement({
  fields: SkillNodePrerequisiteOrderByRelationAggregateInputFields,
});

export const SkillNodeTreeIdStepOrderInStepCompoundUniqueInputFields = (t: any) => ({
  treeId: t.string({"required":true}),
  step: t.int({"required":true}),
  orderInStep: t.int({"required":true}),
});
export const SkillNodeTreeIdStepOrderInStepCompoundUniqueInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeTreeIdStepOrderInStepCompoundUniqueInput>, false>('SkillNodeTreeIdStepOrderInStepCompoundUniqueInput').implement({
  fields: SkillNodeTreeIdStepOrderInStepCompoundUniqueInputFields,
});

export const SkillNodeTreeIdPosXPosYCompoundUniqueInputFields = (t: any) => ({
  treeId: t.string({"required":true}),
  posX: t.int({"required":true}),
  posY: t.int({"required":true}),
});
export const SkillNodeTreeIdPosXPosYCompoundUniqueInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeTreeIdPosXPosYCompoundUniqueInput>, false>('SkillNodeTreeIdPosXPosYCompoundUniqueInput').implement({
  fields: SkillNodeTreeIdPosXPosYCompoundUniqueInputFields,
});

export const SkillNodeCountOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  treeId: t.field({"required":false,"type":SortOrder}),
  title: t.field({"required":false,"type":SortOrder}),
  step: t.field({"required":false,"type":SortOrder}),
  orderInStep: t.field({"required":false,"type":SortOrder}),
  posX: t.field({"required":false,"type":SortOrder}),
  posY: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
  deletedAt: t.field({"required":false,"type":SortOrder}),
});
export const SkillNodeCountOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeCountOrderByAggregateInput>, false>('SkillNodeCountOrderByAggregateInput').implement({
  fields: SkillNodeCountOrderByAggregateInputFields,
});

export const SkillNodeAvgOrderByAggregateInputFields = (t: any) => ({
  step: t.field({"required":false,"type":SortOrder}),
  orderInStep: t.field({"required":false,"type":SortOrder}),
  posX: t.field({"required":false,"type":SortOrder}),
  posY: t.field({"required":false,"type":SortOrder}),
});
export const SkillNodeAvgOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeAvgOrderByAggregateInput>, false>('SkillNodeAvgOrderByAggregateInput').implement({
  fields: SkillNodeAvgOrderByAggregateInputFields,
});

export const SkillNodeMaxOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  treeId: t.field({"required":false,"type":SortOrder}),
  title: t.field({"required":false,"type":SortOrder}),
  step: t.field({"required":false,"type":SortOrder}),
  orderInStep: t.field({"required":false,"type":SortOrder}),
  posX: t.field({"required":false,"type":SortOrder}),
  posY: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
  deletedAt: t.field({"required":false,"type":SortOrder}),
});
export const SkillNodeMaxOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeMaxOrderByAggregateInput>, false>('SkillNodeMaxOrderByAggregateInput').implement({
  fields: SkillNodeMaxOrderByAggregateInputFields,
});

export const SkillNodeMinOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  treeId: t.field({"required":false,"type":SortOrder}),
  title: t.field({"required":false,"type":SortOrder}),
  step: t.field({"required":false,"type":SortOrder}),
  orderInStep: t.field({"required":false,"type":SortOrder}),
  posX: t.field({"required":false,"type":SortOrder}),
  posY: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
  deletedAt: t.field({"required":false,"type":SortOrder}),
});
export const SkillNodeMinOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeMinOrderByAggregateInput>, false>('SkillNodeMinOrderByAggregateInput').implement({
  fields: SkillNodeMinOrderByAggregateInputFields,
});

export const SkillNodeSumOrderByAggregateInputFields = (t: any) => ({
  step: t.field({"required":false,"type":SortOrder}),
  orderInStep: t.field({"required":false,"type":SortOrder}),
  posX: t.field({"required":false,"type":SortOrder}),
  posY: t.field({"required":false,"type":SortOrder}),
});
export const SkillNodeSumOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeSumOrderByAggregateInput>, false>('SkillNodeSumOrderByAggregateInput').implement({
  fields: SkillNodeSumOrderByAggregateInputFields,
});

export const IntWithAggregatesFilterFields = (t: any) => ({
  equals: t.int({"required":false}),
  in: t.intList({"required":false}),
  notIn: t.intList({"required":false}),
  lt: t.int({"required":false}),
  lte: t.int({"required":false}),
  gt: t.int({"required":false}),
  gte: t.int({"required":false}),
  not: t.field({"required":false,"type":NestedIntWithAggregatesFilter}),
  _count: t.field({"required":false,"type":NestedIntFilter}),
  _avg: t.field({"required":false,"type":NestedFloatFilter}),
  _sum: t.field({"required":false,"type":NestedIntFilter}),
  _min: t.field({"required":false,"type":NestedIntFilter}),
  _max: t.field({"required":false,"type":NestedIntFilter}),
});
export const IntWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.IntWithAggregatesFilter>, false>('IntWithAggregatesFilter').implement({
  fields: IntWithAggregatesFilterFields,
});

export const IntNullableWithAggregatesFilterFields = (t: any) => ({
  equals: t.int({"required":false}),
  in: t.intList({"required":false}),
  notIn: t.intList({"required":false}),
  lt: t.int({"required":false}),
  lte: t.int({"required":false}),
  gt: t.int({"required":false}),
  gte: t.int({"required":false}),
  not: t.field({"required":false,"type":NestedIntNullableWithAggregatesFilter}),
  _count: t.field({"required":false,"type":NestedIntNullableFilter}),
  _avg: t.field({"required":false,"type":NestedFloatNullableFilter}),
  _sum: t.field({"required":false,"type":NestedIntNullableFilter}),
  _min: t.field({"required":false,"type":NestedIntNullableFilter}),
  _max: t.field({"required":false,"type":NestedIntNullableFilter}),
});
export const IntNullableWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.IntNullableWithAggregatesFilter>, false>('IntNullableWithAggregatesFilter').implement({
  fields: IntNullableWithAggregatesFilterFields,
});

export const SkillNodeScalarRelationFilterFields = (t: any) => ({
  is: t.field({"required":false,"type":SkillNodeWhereInput}),
  isNot: t.field({"required":false,"type":SkillNodeWhereInput}),
});
export const SkillNodeScalarRelationFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeScalarRelationFilter>, false>('SkillNodeScalarRelationFilter').implement({
  fields: SkillNodeScalarRelationFilterFields,
});

export const SkillNodePrerequisiteNodeIdDependsOnNodeIdCompoundUniqueInputFields = (t: any) => ({
  nodeId: t.string({"required":true}),
  dependsOnNodeId: t.string({"required":true}),
});
export const SkillNodePrerequisiteNodeIdDependsOnNodeIdCompoundUniqueInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodePrerequisiteNodeIdDependsOnNodeIdCompoundUniqueInput>, false>('SkillNodePrerequisiteNodeIdDependsOnNodeIdCompoundUniqueInput').implement({
  fields: SkillNodePrerequisiteNodeIdDependsOnNodeIdCompoundUniqueInputFields,
});

export const SkillNodePrerequisiteCountOrderByAggregateInputFields = (t: any) => ({
  nodeId: t.field({"required":false,"type":SortOrder}),
  dependsOnNodeId: t.field({"required":false,"type":SortOrder}),
});
export const SkillNodePrerequisiteCountOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodePrerequisiteCountOrderByAggregateInput>, false>('SkillNodePrerequisiteCountOrderByAggregateInput').implement({
  fields: SkillNodePrerequisiteCountOrderByAggregateInputFields,
});

export const SkillNodePrerequisiteMaxOrderByAggregateInputFields = (t: any) => ({
  nodeId: t.field({"required":false,"type":SortOrder}),
  dependsOnNodeId: t.field({"required":false,"type":SortOrder}),
});
export const SkillNodePrerequisiteMaxOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodePrerequisiteMaxOrderByAggregateInput>, false>('SkillNodePrerequisiteMaxOrderByAggregateInput').implement({
  fields: SkillNodePrerequisiteMaxOrderByAggregateInputFields,
});

export const SkillNodePrerequisiteMinOrderByAggregateInputFields = (t: any) => ({
  nodeId: t.field({"required":false,"type":SortOrder}),
  dependsOnNodeId: t.field({"required":false,"type":SortOrder}),
});
export const SkillNodePrerequisiteMinOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodePrerequisiteMinOrderByAggregateInput>, false>('SkillNodePrerequisiteMinOrderByAggregateInput').implement({
  fields: SkillNodePrerequisiteMinOrderByAggregateInputFields,
});

export const EnumContentTypeFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":ContentType}),
  in: t.field({"required":false,"type":[ContentType]}),
  notIn: t.field({"required":false,"type":[ContentType]}),
  not: t.field({"required":false,"type":ContentType}),
});
export const EnumContentTypeFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.EnumContentTypeFilter>, false>('EnumContentTypeFilter').implement({
  fields: EnumContentTypeFilterFields,
});

export const JsonNullableFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":Json}),
  path: t.stringList({"required":false}),
  mode: t.field({"required":false,"type":QueryMode}),
  string_contains: t.string({"required":false}),
  string_starts_with: t.string({"required":false}),
  string_ends_with: t.string({"required":false}),
  array_starts_with: t.field({"required":false,"type":Json}),
  array_ends_with: t.field({"required":false,"type":Json}),
  array_contains: t.field({"required":false,"type":Json}),
  lt: t.field({"required":false,"type":Json}),
  lte: t.field({"required":false,"type":Json}),
  gt: t.field({"required":false,"type":Json}),
  gte: t.field({"required":false,"type":Json}),
  not: t.field({"required":false,"type":Json}),
});
export const JsonNullableFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.JsonNullableFilter>, false>('JsonNullableFilter').implement({
  fields: JsonNullableFilterFields,
});

export const EnumLessonStatusFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":LessonStatus}),
  in: t.field({"required":false,"type":[LessonStatus]}),
  notIn: t.field({"required":false,"type":[LessonStatus]}),
  not: t.field({"required":false,"type":LessonStatus}),
});
export const EnumLessonStatusFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.EnumLessonStatusFilter>, false>('EnumLessonStatusFilter').implement({
  fields: EnumLessonStatusFilterFields,
});

export const LessonBlocksCountOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  nodeId: t.field({"required":false,"type":SortOrder}),
  type: t.field({"required":false,"type":SortOrder}),
  url: t.field({"required":false,"type":SortOrder}),
  html: t.field({"required":false,"type":SortOrder}),
  caption: t.field({"required":false,"type":SortOrder}),
  order: t.field({"required":false,"type":SortOrder}),
  meta: t.field({"required":false,"type":SortOrder}),
  status: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
  deletedAt: t.field({"required":false,"type":SortOrder}),
});
export const LessonBlocksCountOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.LessonBlocksCountOrderByAggregateInput>, false>('LessonBlocksCountOrderByAggregateInput').implement({
  fields: LessonBlocksCountOrderByAggregateInputFields,
});

export const LessonBlocksAvgOrderByAggregateInputFields = (t: any) => ({
  order: t.field({"required":false,"type":SortOrder}),
});
export const LessonBlocksAvgOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.LessonBlocksAvgOrderByAggregateInput>, false>('LessonBlocksAvgOrderByAggregateInput').implement({
  fields: LessonBlocksAvgOrderByAggregateInputFields,
});

export const LessonBlocksMaxOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  nodeId: t.field({"required":false,"type":SortOrder}),
  type: t.field({"required":false,"type":SortOrder}),
  url: t.field({"required":false,"type":SortOrder}),
  html: t.field({"required":false,"type":SortOrder}),
  caption: t.field({"required":false,"type":SortOrder}),
  order: t.field({"required":false,"type":SortOrder}),
  status: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
  deletedAt: t.field({"required":false,"type":SortOrder}),
});
export const LessonBlocksMaxOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.LessonBlocksMaxOrderByAggregateInput>, false>('LessonBlocksMaxOrderByAggregateInput').implement({
  fields: LessonBlocksMaxOrderByAggregateInputFields,
});

export const LessonBlocksMinOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  nodeId: t.field({"required":false,"type":SortOrder}),
  type: t.field({"required":false,"type":SortOrder}),
  url: t.field({"required":false,"type":SortOrder}),
  html: t.field({"required":false,"type":SortOrder}),
  caption: t.field({"required":false,"type":SortOrder}),
  order: t.field({"required":false,"type":SortOrder}),
  status: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
  deletedAt: t.field({"required":false,"type":SortOrder}),
});
export const LessonBlocksMinOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.LessonBlocksMinOrderByAggregateInput>, false>('LessonBlocksMinOrderByAggregateInput').implement({
  fields: LessonBlocksMinOrderByAggregateInputFields,
});

export const LessonBlocksSumOrderByAggregateInputFields = (t: any) => ({
  order: t.field({"required":false,"type":SortOrder}),
});
export const LessonBlocksSumOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.LessonBlocksSumOrderByAggregateInput>, false>('LessonBlocksSumOrderByAggregateInput').implement({
  fields: LessonBlocksSumOrderByAggregateInputFields,
});

export const EnumContentTypeWithAggregatesFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":ContentType}),
  in: t.field({"required":false,"type":[ContentType]}),
  notIn: t.field({"required":false,"type":[ContentType]}),
  not: t.field({"required":false,"type":ContentType}),
  _count: t.field({"required":false,"type":NestedIntFilter}),
  _min: t.field({"required":false,"type":NestedEnumContentTypeFilter}),
  _max: t.field({"required":false,"type":NestedEnumContentTypeFilter}),
});
export const EnumContentTypeWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.EnumContentTypeWithAggregatesFilter>, false>('EnumContentTypeWithAggregatesFilter').implement({
  fields: EnumContentTypeWithAggregatesFilterFields,
});

export const JsonNullableWithAggregatesFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":Json}),
  path: t.stringList({"required":false}),
  mode: t.field({"required":false,"type":QueryMode}),
  string_contains: t.string({"required":false}),
  string_starts_with: t.string({"required":false}),
  string_ends_with: t.string({"required":false}),
  array_starts_with: t.field({"required":false,"type":Json}),
  array_ends_with: t.field({"required":false,"type":Json}),
  array_contains: t.field({"required":false,"type":Json}),
  lt: t.field({"required":false,"type":Json}),
  lte: t.field({"required":false,"type":Json}),
  gt: t.field({"required":false,"type":Json}),
  gte: t.field({"required":false,"type":Json}),
  not: t.field({"required":false,"type":Json}),
  _count: t.field({"required":false,"type":NestedIntNullableFilter}),
  _min: t.field({"required":false,"type":NestedJsonNullableFilter}),
  _max: t.field({"required":false,"type":NestedJsonNullableFilter}),
});
export const JsonNullableWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.JsonNullableWithAggregatesFilter>, false>('JsonNullableWithAggregatesFilter').implement({
  fields: JsonNullableWithAggregatesFilterFields,
});

export const EnumLessonStatusWithAggregatesFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":LessonStatus}),
  in: t.field({"required":false,"type":[LessonStatus]}),
  notIn: t.field({"required":false,"type":[LessonStatus]}),
  not: t.field({"required":false,"type":LessonStatus}),
  _count: t.field({"required":false,"type":NestedIntFilter}),
  _min: t.field({"required":false,"type":NestedEnumLessonStatusFilter}),
  _max: t.field({"required":false,"type":NestedEnumLessonStatusFilter}),
});
export const EnumLessonStatusWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.EnumLessonStatusWithAggregatesFilter>, false>('EnumLessonStatusWithAggregatesFilter').implement({
  fields: EnumLessonStatusWithAggregatesFilterFields,
});

export const BoolFilterFields = (t: any) => ({
  equals: t.boolean({"required":false}),
  not: t.field({"required":false,"type":NestedBoolFilter}),
});
export const BoolFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.BoolFilter>, false>('BoolFilter').implement({
  fields: BoolFilterFields,
});

export const QuizQuestionListRelationFilterFields = (t: any) => ({
  every: t.field({"required":false,"type":QuizQuestionWhereInput}),
  some: t.field({"required":false,"type":QuizQuestionWhereInput}),
  none: t.field({"required":false,"type":QuizQuestionWhereInput}),
});
export const QuizQuestionListRelationFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizQuestionListRelationFilter>, false>('QuizQuestionListRelationFilter').implement({
  fields: QuizQuestionListRelationFilterFields,
});

export const QuizQuestionOrderByRelationAggregateInputFields = (t: any) => ({
  _count: t.field({"required":false,"type":SortOrder}),
});
export const QuizQuestionOrderByRelationAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizQuestionOrderByRelationAggregateInput>, false>('QuizQuestionOrderByRelationAggregateInput').implement({
  fields: QuizQuestionOrderByRelationAggregateInputFields,
});

export const QuizCountOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  nodeId: t.field({"required":false,"type":SortOrder}),
  title: t.field({"required":false,"type":SortOrder}),
  required: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
  deletedAt: t.field({"required":false,"type":SortOrder}),
});
export const QuizCountOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizCountOrderByAggregateInput>, false>('QuizCountOrderByAggregateInput').implement({
  fields: QuizCountOrderByAggregateInputFields,
});

export const QuizMaxOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  nodeId: t.field({"required":false,"type":SortOrder}),
  title: t.field({"required":false,"type":SortOrder}),
  required: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
  deletedAt: t.field({"required":false,"type":SortOrder}),
});
export const QuizMaxOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizMaxOrderByAggregateInput>, false>('QuizMaxOrderByAggregateInput').implement({
  fields: QuizMaxOrderByAggregateInputFields,
});

export const QuizMinOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  nodeId: t.field({"required":false,"type":SortOrder}),
  title: t.field({"required":false,"type":SortOrder}),
  required: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
  deletedAt: t.field({"required":false,"type":SortOrder}),
});
export const QuizMinOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizMinOrderByAggregateInput>, false>('QuizMinOrderByAggregateInput').implement({
  fields: QuizMinOrderByAggregateInputFields,
});

export const BoolWithAggregatesFilterFields = (t: any) => ({
  equals: t.boolean({"required":false}),
  not: t.field({"required":false,"type":NestedBoolWithAggregatesFilter}),
  _count: t.field({"required":false,"type":NestedIntFilter}),
  _min: t.field({"required":false,"type":NestedBoolFilter}),
  _max: t.field({"required":false,"type":NestedBoolFilter}),
});
export const BoolWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.BoolWithAggregatesFilter>, false>('BoolWithAggregatesFilter').implement({
  fields: BoolWithAggregatesFilterFields,
});

export const EnumQuestionTypeFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":QuestionType}),
  in: t.field({"required":false,"type":[QuestionType]}),
  notIn: t.field({"required":false,"type":[QuestionType]}),
  not: t.field({"required":false,"type":QuestionType}),
});
export const EnumQuestionTypeFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.EnumQuestionTypeFilter>, false>('EnumQuestionTypeFilter').implement({
  fields: EnumQuestionTypeFilterFields,
});

export const QuizScalarRelationFilterFields = (t: any) => ({
  is: t.field({"required":false,"type":QuizWhereInput}),
  isNot: t.field({"required":false,"type":QuizWhereInput}),
});
export const QuizScalarRelationFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizScalarRelationFilter>, false>('QuizScalarRelationFilter').implement({
  fields: QuizScalarRelationFilterFields,
});

export const QuizOptionListRelationFilterFields = (t: any) => ({
  every: t.field({"required":false,"type":QuizOptionWhereInput}),
  some: t.field({"required":false,"type":QuizOptionWhereInput}),
  none: t.field({"required":false,"type":QuizOptionWhereInput}),
});
export const QuizOptionListRelationFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizOptionListRelationFilter>, false>('QuizOptionListRelationFilter').implement({
  fields: QuizOptionListRelationFilterFields,
});

export const QuizAttemptAnswerListRelationFilterFields = (t: any) => ({
  every: t.field({"required":false,"type":QuizAttemptAnswerWhereInput}),
  some: t.field({"required":false,"type":QuizAttemptAnswerWhereInput}),
  none: t.field({"required":false,"type":QuizAttemptAnswerWhereInput}),
});
export const QuizAttemptAnswerListRelationFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptAnswerListRelationFilter>, false>('QuizAttemptAnswerListRelationFilter').implement({
  fields: QuizAttemptAnswerListRelationFilterFields,
});

export const QuizOptionOrderByRelationAggregateInputFields = (t: any) => ({
  _count: t.field({"required":false,"type":SortOrder}),
});
export const QuizOptionOrderByRelationAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizOptionOrderByRelationAggregateInput>, false>('QuizOptionOrderByRelationAggregateInput').implement({
  fields: QuizOptionOrderByRelationAggregateInputFields,
});

export const QuizAttemptAnswerOrderByRelationAggregateInputFields = (t: any) => ({
  _count: t.field({"required":false,"type":SortOrder}),
});
export const QuizAttemptAnswerOrderByRelationAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptAnswerOrderByRelationAggregateInput>, false>('QuizAttemptAnswerOrderByRelationAggregateInput').implement({
  fields: QuizAttemptAnswerOrderByRelationAggregateInputFields,
});

export const QuizQuestionCountOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  quizId: t.field({"required":false,"type":SortOrder}),
  type: t.field({"required":false,"type":SortOrder}),
  prompt: t.field({"required":false,"type":SortOrder}),
  order: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
});
export const QuizQuestionCountOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizQuestionCountOrderByAggregateInput>, false>('QuizQuestionCountOrderByAggregateInput').implement({
  fields: QuizQuestionCountOrderByAggregateInputFields,
});

export const QuizQuestionAvgOrderByAggregateInputFields = (t: any) => ({
  order: t.field({"required":false,"type":SortOrder}),
});
export const QuizQuestionAvgOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizQuestionAvgOrderByAggregateInput>, false>('QuizQuestionAvgOrderByAggregateInput').implement({
  fields: QuizQuestionAvgOrderByAggregateInputFields,
});

export const QuizQuestionMaxOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  quizId: t.field({"required":false,"type":SortOrder}),
  type: t.field({"required":false,"type":SortOrder}),
  prompt: t.field({"required":false,"type":SortOrder}),
  order: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
});
export const QuizQuestionMaxOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizQuestionMaxOrderByAggregateInput>, false>('QuizQuestionMaxOrderByAggregateInput').implement({
  fields: QuizQuestionMaxOrderByAggregateInputFields,
});

export const QuizQuestionMinOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  quizId: t.field({"required":false,"type":SortOrder}),
  type: t.field({"required":false,"type":SortOrder}),
  prompt: t.field({"required":false,"type":SortOrder}),
  order: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
});
export const QuizQuestionMinOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizQuestionMinOrderByAggregateInput>, false>('QuizQuestionMinOrderByAggregateInput').implement({
  fields: QuizQuestionMinOrderByAggregateInputFields,
});

export const QuizQuestionSumOrderByAggregateInputFields = (t: any) => ({
  order: t.field({"required":false,"type":SortOrder}),
});
export const QuizQuestionSumOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizQuestionSumOrderByAggregateInput>, false>('QuizQuestionSumOrderByAggregateInput').implement({
  fields: QuizQuestionSumOrderByAggregateInputFields,
});

export const EnumQuestionTypeWithAggregatesFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":QuestionType}),
  in: t.field({"required":false,"type":[QuestionType]}),
  notIn: t.field({"required":false,"type":[QuestionType]}),
  not: t.field({"required":false,"type":QuestionType}),
  _count: t.field({"required":false,"type":NestedIntFilter}),
  _min: t.field({"required":false,"type":NestedEnumQuestionTypeFilter}),
  _max: t.field({"required":false,"type":NestedEnumQuestionTypeFilter}),
});
export const EnumQuestionTypeWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.EnumQuestionTypeWithAggregatesFilter>, false>('EnumQuestionTypeWithAggregatesFilter').implement({
  fields: EnumQuestionTypeWithAggregatesFilterFields,
});

export const QuizQuestionScalarRelationFilterFields = (t: any) => ({
  is: t.field({"required":false,"type":QuizQuestionWhereInput}),
  isNot: t.field({"required":false,"type":QuizQuestionWhereInput}),
});
export const QuizQuestionScalarRelationFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizQuestionScalarRelationFilter>, false>('QuizQuestionScalarRelationFilter').implement({
  fields: QuizQuestionScalarRelationFilterFields,
});

export const QuizOptionCountOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  questionId: t.field({"required":false,"type":SortOrder}),
  text: t.field({"required":false,"type":SortOrder}),
  isCorrect: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
});
export const QuizOptionCountOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizOptionCountOrderByAggregateInput>, false>('QuizOptionCountOrderByAggregateInput').implement({
  fields: QuizOptionCountOrderByAggregateInputFields,
});

export const QuizOptionMaxOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  questionId: t.field({"required":false,"type":SortOrder}),
  text: t.field({"required":false,"type":SortOrder}),
  isCorrect: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
});
export const QuizOptionMaxOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizOptionMaxOrderByAggregateInput>, false>('QuizOptionMaxOrderByAggregateInput').implement({
  fields: QuizOptionMaxOrderByAggregateInputFields,
});

export const QuizOptionMinOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  questionId: t.field({"required":false,"type":SortOrder}),
  text: t.field({"required":false,"type":SortOrder}),
  isCorrect: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
});
export const QuizOptionMinOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizOptionMinOrderByAggregateInput>, false>('QuizOptionMinOrderByAggregateInput').implement({
  fields: QuizOptionMinOrderByAggregateInputFields,
});

export const QuizAttemptCountOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  quizId: t.field({"required":false,"type":SortOrder}),
  userId: t.field({"required":false,"type":SortOrder}),
  passed: t.field({"required":false,"type":SortOrder}),
  takenAt: t.field({"required":false,"type":SortOrder}),
});
export const QuizAttemptCountOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptCountOrderByAggregateInput>, false>('QuizAttemptCountOrderByAggregateInput').implement({
  fields: QuizAttemptCountOrderByAggregateInputFields,
});

export const QuizAttemptMaxOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  quizId: t.field({"required":false,"type":SortOrder}),
  userId: t.field({"required":false,"type":SortOrder}),
  passed: t.field({"required":false,"type":SortOrder}),
  takenAt: t.field({"required":false,"type":SortOrder}),
});
export const QuizAttemptMaxOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptMaxOrderByAggregateInput>, false>('QuizAttemptMaxOrderByAggregateInput').implement({
  fields: QuizAttemptMaxOrderByAggregateInputFields,
});

export const QuizAttemptMinOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  quizId: t.field({"required":false,"type":SortOrder}),
  userId: t.field({"required":false,"type":SortOrder}),
  passed: t.field({"required":false,"type":SortOrder}),
  takenAt: t.field({"required":false,"type":SortOrder}),
});
export const QuizAttemptMinOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptMinOrderByAggregateInput>, false>('QuizAttemptMinOrderByAggregateInput').implement({
  fields: QuizAttemptMinOrderByAggregateInputFields,
});

export const BoolNullableFilterFields = (t: any) => ({
  equals: t.boolean({"required":false}),
  not: t.field({"required":false,"type":NestedBoolNullableFilter}),
});
export const BoolNullableFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.BoolNullableFilter>, false>('BoolNullableFilter').implement({
  fields: BoolNullableFilterFields,
});

export const QuizAttemptScalarRelationFilterFields = (t: any) => ({
  is: t.field({"required":false,"type":QuizAttemptWhereInput}),
  isNot: t.field({"required":false,"type":QuizAttemptWhereInput}),
});
export const QuizAttemptScalarRelationFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptScalarRelationFilter>, false>('QuizAttemptScalarRelationFilter').implement({
  fields: QuizAttemptScalarRelationFilterFields,
});

export const QuizAttemptAnswerAttemptIdQuestionIdCompoundUniqueInputFields = (t: any) => ({
  attemptId: t.string({"required":true}),
  questionId: t.string({"required":true}),
});
export const QuizAttemptAnswerAttemptIdQuestionIdCompoundUniqueInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptAnswerAttemptIdQuestionIdCompoundUniqueInput>, false>('QuizAttemptAnswerAttemptIdQuestionIdCompoundUniqueInput').implement({
  fields: QuizAttemptAnswerAttemptIdQuestionIdCompoundUniqueInputFields,
});

export const QuizAttemptAnswerCountOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  attemptId: t.field({"required":false,"type":SortOrder}),
  questionId: t.field({"required":false,"type":SortOrder}),
  answer: t.field({"required":false,"type":SortOrder}),
  isCorrect: t.field({"required":false,"type":SortOrder}),
});
export const QuizAttemptAnswerCountOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptAnswerCountOrderByAggregateInput>, false>('QuizAttemptAnswerCountOrderByAggregateInput').implement({
  fields: QuizAttemptAnswerCountOrderByAggregateInputFields,
});

export const QuizAttemptAnswerMaxOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  attemptId: t.field({"required":false,"type":SortOrder}),
  questionId: t.field({"required":false,"type":SortOrder}),
  isCorrect: t.field({"required":false,"type":SortOrder}),
});
export const QuizAttemptAnswerMaxOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptAnswerMaxOrderByAggregateInput>, false>('QuizAttemptAnswerMaxOrderByAggregateInput').implement({
  fields: QuizAttemptAnswerMaxOrderByAggregateInputFields,
});

export const QuizAttemptAnswerMinOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  attemptId: t.field({"required":false,"type":SortOrder}),
  questionId: t.field({"required":false,"type":SortOrder}),
  isCorrect: t.field({"required":false,"type":SortOrder}),
});
export const QuizAttemptAnswerMinOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptAnswerMinOrderByAggregateInput>, false>('QuizAttemptAnswerMinOrderByAggregateInput').implement({
  fields: QuizAttemptAnswerMinOrderByAggregateInputFields,
});

export const BoolNullableWithAggregatesFilterFields = (t: any) => ({
  equals: t.boolean({"required":false}),
  not: t.field({"required":false,"type":NestedBoolNullableWithAggregatesFilter}),
  _count: t.field({"required":false,"type":NestedIntNullableFilter}),
  _min: t.field({"required":false,"type":NestedBoolNullableFilter}),
  _max: t.field({"required":false,"type":NestedBoolNullableFilter}),
});
export const BoolNullableWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.BoolNullableWithAggregatesFilter>, false>('BoolNullableWithAggregatesFilter').implement({
  fields: BoolNullableWithAggregatesFilterFields,
});

export const EnumProgressStatusFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":ProgressStatus}),
  in: t.field({"required":false,"type":[ProgressStatus]}),
  notIn: t.field({"required":false,"type":[ProgressStatus]}),
  not: t.field({"required":false,"type":ProgressStatus}),
});
export const EnumProgressStatusFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.EnumProgressStatusFilter>, false>('EnumProgressStatusFilter').implement({
  fields: EnumProgressStatusFilterFields,
});

export const UserNodeProgressUserIdNodeIdCompoundUniqueInputFields = (t: any) => ({
  userId: t.string({"required":true}),
  nodeId: t.string({"required":true}),
});
export const UserNodeProgressUserIdNodeIdCompoundUniqueInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserNodeProgressUserIdNodeIdCompoundUniqueInput>, false>('UserNodeProgressUserIdNodeIdCompoundUniqueInput').implement({
  fields: UserNodeProgressUserIdNodeIdCompoundUniqueInputFields,
});

export const UserNodeProgressCountOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  userId: t.field({"required":false,"type":SortOrder}),
  nodeId: t.field({"required":false,"type":SortOrder}),
  status: t.field({"required":false,"type":SortOrder}),
  completedAt: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
});
export const UserNodeProgressCountOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserNodeProgressCountOrderByAggregateInput>, false>('UserNodeProgressCountOrderByAggregateInput').implement({
  fields: UserNodeProgressCountOrderByAggregateInputFields,
});

export const UserNodeProgressMaxOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  userId: t.field({"required":false,"type":SortOrder}),
  nodeId: t.field({"required":false,"type":SortOrder}),
  status: t.field({"required":false,"type":SortOrder}),
  completedAt: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
});
export const UserNodeProgressMaxOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserNodeProgressMaxOrderByAggregateInput>, false>('UserNodeProgressMaxOrderByAggregateInput').implement({
  fields: UserNodeProgressMaxOrderByAggregateInputFields,
});

export const UserNodeProgressMinOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  userId: t.field({"required":false,"type":SortOrder}),
  nodeId: t.field({"required":false,"type":SortOrder}),
  status: t.field({"required":false,"type":SortOrder}),
  completedAt: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
});
export const UserNodeProgressMinOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserNodeProgressMinOrderByAggregateInput>, false>('UserNodeProgressMinOrderByAggregateInput').implement({
  fields: UserNodeProgressMinOrderByAggregateInputFields,
});

export const EnumProgressStatusWithAggregatesFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":ProgressStatus}),
  in: t.field({"required":false,"type":[ProgressStatus]}),
  notIn: t.field({"required":false,"type":[ProgressStatus]}),
  not: t.field({"required":false,"type":ProgressStatus}),
  _count: t.field({"required":false,"type":NestedIntFilter}),
  _min: t.field({"required":false,"type":NestedEnumProgressStatusFilter}),
  _max: t.field({"required":false,"type":NestedEnumProgressStatusFilter}),
});
export const EnumProgressStatusWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.EnumProgressStatusWithAggregatesFilter>, false>('EnumProgressStatusWithAggregatesFilter').implement({
  fields: EnumProgressStatusWithAggregatesFilterFields,
});

export const CourseCreateNestedManyWithoutAuthorInputFields = (t: any) => ({
  create: t.field({"required":false,"type":[CourseCreateWithoutAuthorInput]}),
  connectOrCreate: t.field({"required":false,"type":[CourseCreateOrConnectWithoutAuthorInput]}),
  createMany: t.field({"required":false,"type":CourseCreateManyAuthorInputEnvelope}),
  connect: t.field({"required":false,"type":[CourseWhereUniqueInput]}),
});
export const CourseCreateNestedManyWithoutAuthorInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CourseCreateNestedManyWithoutAuthorInput>, false>('CourseCreateNestedManyWithoutAuthorInput').implement({
  fields: CourseCreateNestedManyWithoutAuthorInputFields,
});

export const UserNodeProgressCreateNestedManyWithoutUserInputFields = (t: any) => ({
  create: t.field({"required":false,"type":[UserNodeProgressCreateWithoutUserInput]}),
  connectOrCreate: t.field({"required":false,"type":[UserNodeProgressCreateOrConnectWithoutUserInput]}),
  createMany: t.field({"required":false,"type":UserNodeProgressCreateManyUserInputEnvelope}),
  connect: t.field({"required":false,"type":[UserNodeProgressWhereUniqueInput]}),
});
export const UserNodeProgressCreateNestedManyWithoutUserInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserNodeProgressCreateNestedManyWithoutUserInput>, false>('UserNodeProgressCreateNestedManyWithoutUserInput').implement({
  fields: UserNodeProgressCreateNestedManyWithoutUserInputFields,
});

export const QuizAttemptCreateNestedManyWithoutUserInputFields = (t: any) => ({
  create: t.field({"required":false,"type":[QuizAttemptCreateWithoutUserInput]}),
  connectOrCreate: t.field({"required":false,"type":[QuizAttemptCreateOrConnectWithoutUserInput]}),
  createMany: t.field({"required":false,"type":QuizAttemptCreateManyUserInputEnvelope}),
  connect: t.field({"required":false,"type":[QuizAttemptWhereUniqueInput]}),
});
export const QuizAttemptCreateNestedManyWithoutUserInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptCreateNestedManyWithoutUserInput>, false>('QuizAttemptCreateNestedManyWithoutUserInput').implement({
  fields: QuizAttemptCreateNestedManyWithoutUserInputFields,
});

export const StringFieldUpdateOperationsInputFields = (t: any) => ({
  set: t.string({"required":false}),
});
export const StringFieldUpdateOperationsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.StringFieldUpdateOperationsInput>, false>('StringFieldUpdateOperationsInput').implement({
  fields: StringFieldUpdateOperationsInputFields,
});

export const NullableStringFieldUpdateOperationsInputFields = (t: any) => ({
  set: t.string({"required":false}),
});
export const NullableStringFieldUpdateOperationsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NullableStringFieldUpdateOperationsInput>, false>('NullableStringFieldUpdateOperationsInput').implement({
  fields: NullableStringFieldUpdateOperationsInputFields,
});

export const EnumRoleFieldUpdateOperationsInputFields = (t: any) => ({
  set: t.field({"required":false,"type":Role}),
});
export const EnumRoleFieldUpdateOperationsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.EnumRoleFieldUpdateOperationsInput>, false>('EnumRoleFieldUpdateOperationsInput').implement({
  fields: EnumRoleFieldUpdateOperationsInputFields,
});

export const DateTimeFieldUpdateOperationsInputFields = (t: any) => ({
  set: t.field({"required":false,"type":DateTime}),
});
export const DateTimeFieldUpdateOperationsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.DateTimeFieldUpdateOperationsInput>, false>('DateTimeFieldUpdateOperationsInput').implement({
  fields: DateTimeFieldUpdateOperationsInputFields,
});

export const CourseUpdateManyWithoutAuthorNestedInputFields = (t: any) => ({
  create: t.field({"required":false,"type":[CourseCreateWithoutAuthorInput]}),
  connectOrCreate: t.field({"required":false,"type":[CourseCreateOrConnectWithoutAuthorInput]}),
  upsert: t.field({"required":false,"type":[CourseUpsertWithWhereUniqueWithoutAuthorInput]}),
  createMany: t.field({"required":false,"type":CourseCreateManyAuthorInputEnvelope}),
  set: t.field({"required":false,"type":[CourseWhereUniqueInput]}),
  disconnect: t.field({"required":false,"type":[CourseWhereUniqueInput]}),
  delete: t.field({"required":false,"type":[CourseWhereUniqueInput]}),
  connect: t.field({"required":false,"type":[CourseWhereUniqueInput]}),
  update: t.field({"required":false,"type":[CourseUpdateWithWhereUniqueWithoutAuthorInput]}),
  updateMany: t.field({"required":false,"type":[CourseUpdateManyWithWhereWithoutAuthorInput]}),
  deleteMany: t.field({"required":false,"type":[CourseScalarWhereInput]}),
});
export const CourseUpdateManyWithoutAuthorNestedInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CourseUpdateManyWithoutAuthorNestedInput>, false>('CourseUpdateManyWithoutAuthorNestedInput').implement({
  fields: CourseUpdateManyWithoutAuthorNestedInputFields,
});

export const UserNodeProgressUpdateManyWithoutUserNestedInputFields = (t: any) => ({
  create: t.field({"required":false,"type":[UserNodeProgressCreateWithoutUserInput]}),
  connectOrCreate: t.field({"required":false,"type":[UserNodeProgressCreateOrConnectWithoutUserInput]}),
  upsert: t.field({"required":false,"type":[UserNodeProgressUpsertWithWhereUniqueWithoutUserInput]}),
  createMany: t.field({"required":false,"type":UserNodeProgressCreateManyUserInputEnvelope}),
  set: t.field({"required":false,"type":[UserNodeProgressWhereUniqueInput]}),
  disconnect: t.field({"required":false,"type":[UserNodeProgressWhereUniqueInput]}),
  delete: t.field({"required":false,"type":[UserNodeProgressWhereUniqueInput]}),
  connect: t.field({"required":false,"type":[UserNodeProgressWhereUniqueInput]}),
  update: t.field({"required":false,"type":[UserNodeProgressUpdateWithWhereUniqueWithoutUserInput]}),
  updateMany: t.field({"required":false,"type":[UserNodeProgressUpdateManyWithWhereWithoutUserInput]}),
  deleteMany: t.field({"required":false,"type":[UserNodeProgressScalarWhereInput]}),
});
export const UserNodeProgressUpdateManyWithoutUserNestedInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserNodeProgressUpdateManyWithoutUserNestedInput>, false>('UserNodeProgressUpdateManyWithoutUserNestedInput').implement({
  fields: UserNodeProgressUpdateManyWithoutUserNestedInputFields,
});

export const QuizAttemptUpdateManyWithoutUserNestedInputFields = (t: any) => ({
  create: t.field({"required":false,"type":[QuizAttemptCreateWithoutUserInput]}),
  connectOrCreate: t.field({"required":false,"type":[QuizAttemptCreateOrConnectWithoutUserInput]}),
  upsert: t.field({"required":false,"type":[QuizAttemptUpsertWithWhereUniqueWithoutUserInput]}),
  createMany: t.field({"required":false,"type":QuizAttemptCreateManyUserInputEnvelope}),
  set: t.field({"required":false,"type":[QuizAttemptWhereUniqueInput]}),
  disconnect: t.field({"required":false,"type":[QuizAttemptWhereUniqueInput]}),
  delete: t.field({"required":false,"type":[QuizAttemptWhereUniqueInput]}),
  connect: t.field({"required":false,"type":[QuizAttemptWhereUniqueInput]}),
  update: t.field({"required":false,"type":[QuizAttemptUpdateWithWhereUniqueWithoutUserInput]}),
  updateMany: t.field({"required":false,"type":[QuizAttemptUpdateManyWithWhereWithoutUserInput]}),
  deleteMany: t.field({"required":false,"type":[QuizAttemptScalarWhereInput]}),
});
export const QuizAttemptUpdateManyWithoutUserNestedInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptUpdateManyWithoutUserNestedInput>, false>('QuizAttemptUpdateManyWithoutUserNestedInput').implement({
  fields: QuizAttemptUpdateManyWithoutUserNestedInputFields,
});

export const UserCreateNestedOneWithoutCoursesAuthoredInputFields = (t: any) => ({
  create: t.field({"required":false,"type":UserCreateWithoutCoursesAuthoredInput}),
  connectOrCreate: t.field({"required":false,"type":UserCreateOrConnectWithoutCoursesAuthoredInput}),
  connect: t.field({"required":false,"type":UserWhereUniqueInput}),
});
export const UserCreateNestedOneWithoutCoursesAuthoredInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserCreateNestedOneWithoutCoursesAuthoredInput>, false>('UserCreateNestedOneWithoutCoursesAuthoredInput').implement({
  fields: UserCreateNestedOneWithoutCoursesAuthoredInputFields,
});

export const SkillTreeCreateNestedManyWithoutCourseInputFields = (t: any) => ({
  create: t.field({"required":false,"type":[SkillTreeCreateWithoutCourseInput]}),
  connectOrCreate: t.field({"required":false,"type":[SkillTreeCreateOrConnectWithoutCourseInput]}),
  createMany: t.field({"required":false,"type":SkillTreeCreateManyCourseInputEnvelope}),
  connect: t.field({"required":false,"type":[SkillTreeWhereUniqueInput]}),
});
export const SkillTreeCreateNestedManyWithoutCourseInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillTreeCreateNestedManyWithoutCourseInput>, false>('SkillTreeCreateNestedManyWithoutCourseInput').implement({
  fields: SkillTreeCreateNestedManyWithoutCourseInputFields,
});

export const EnumCourseStatusFieldUpdateOperationsInputFields = (t: any) => ({
  set: t.field({"required":false,"type":CourseStatus}),
});
export const EnumCourseStatusFieldUpdateOperationsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.EnumCourseStatusFieldUpdateOperationsInput>, false>('EnumCourseStatusFieldUpdateOperationsInput').implement({
  fields: EnumCourseStatusFieldUpdateOperationsInputFields,
});

export const NullableDateTimeFieldUpdateOperationsInputFields = (t: any) => ({
  set: t.field({"required":false,"type":DateTime}),
});
export const NullableDateTimeFieldUpdateOperationsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NullableDateTimeFieldUpdateOperationsInput>, false>('NullableDateTimeFieldUpdateOperationsInput').implement({
  fields: NullableDateTimeFieldUpdateOperationsInputFields,
});

export const UserUpdateOneRequiredWithoutCoursesAuthoredNestedInputFields = (t: any) => ({
  create: t.field({"required":false,"type":UserCreateWithoutCoursesAuthoredInput}),
  connectOrCreate: t.field({"required":false,"type":UserCreateOrConnectWithoutCoursesAuthoredInput}),
  upsert: t.field({"required":false,"type":UserUpsertWithoutCoursesAuthoredInput}),
  connect: t.field({"required":false,"type":UserWhereUniqueInput}),
  update: t.field({"required":false,"type":UserUpdateToOneWithWhereWithoutCoursesAuthoredInput}),
});
export const UserUpdateOneRequiredWithoutCoursesAuthoredNestedInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserUpdateOneRequiredWithoutCoursesAuthoredNestedInput>, false>('UserUpdateOneRequiredWithoutCoursesAuthoredNestedInput').implement({
  fields: UserUpdateOneRequiredWithoutCoursesAuthoredNestedInputFields,
});

export const SkillTreeUpdateManyWithoutCourseNestedInputFields = (t: any) => ({
  create: t.field({"required":false,"type":[SkillTreeCreateWithoutCourseInput]}),
  connectOrCreate: t.field({"required":false,"type":[SkillTreeCreateOrConnectWithoutCourseInput]}),
  upsert: t.field({"required":false,"type":[SkillTreeUpsertWithWhereUniqueWithoutCourseInput]}),
  createMany: t.field({"required":false,"type":SkillTreeCreateManyCourseInputEnvelope}),
  set: t.field({"required":false,"type":[SkillTreeWhereUniqueInput]}),
  disconnect: t.field({"required":false,"type":[SkillTreeWhereUniqueInput]}),
  delete: t.field({"required":false,"type":[SkillTreeWhereUniqueInput]}),
  connect: t.field({"required":false,"type":[SkillTreeWhereUniqueInput]}),
  update: t.field({"required":false,"type":[SkillTreeUpdateWithWhereUniqueWithoutCourseInput]}),
  updateMany: t.field({"required":false,"type":[SkillTreeUpdateManyWithWhereWithoutCourseInput]}),
  deleteMany: t.field({"required":false,"type":[SkillTreeScalarWhereInput]}),
});
export const SkillTreeUpdateManyWithoutCourseNestedInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillTreeUpdateManyWithoutCourseNestedInput>, false>('SkillTreeUpdateManyWithoutCourseNestedInput').implement({
  fields: SkillTreeUpdateManyWithoutCourseNestedInputFields,
});

export const CourseCreateNestedOneWithoutTreesInputFields = (t: any) => ({
  create: t.field({"required":false,"type":CourseCreateWithoutTreesInput}),
  connectOrCreate: t.field({"required":false,"type":CourseCreateOrConnectWithoutTreesInput}),
  connect: t.field({"required":false,"type":CourseWhereUniqueInput}),
});
export const CourseCreateNestedOneWithoutTreesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CourseCreateNestedOneWithoutTreesInput>, false>('CourseCreateNestedOneWithoutTreesInput').implement({
  fields: CourseCreateNestedOneWithoutTreesInputFields,
});

export const SkillNodeCreateNestedManyWithoutTreeInputFields = (t: any) => ({
  create: t.field({"required":false,"type":[SkillNodeCreateWithoutTreeInput]}),
  connectOrCreate: t.field({"required":false,"type":[SkillNodeCreateOrConnectWithoutTreeInput]}),
  createMany: t.field({"required":false,"type":SkillNodeCreateManyTreeInputEnvelope}),
  connect: t.field({"required":false,"type":[SkillNodeWhereUniqueInput]}),
});
export const SkillNodeCreateNestedManyWithoutTreeInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeCreateNestedManyWithoutTreeInput>, false>('SkillNodeCreateNestedManyWithoutTreeInput').implement({
  fields: SkillNodeCreateNestedManyWithoutTreeInputFields,
});

export const CourseUpdateOneRequiredWithoutTreesNestedInputFields = (t: any) => ({
  create: t.field({"required":false,"type":CourseCreateWithoutTreesInput}),
  connectOrCreate: t.field({"required":false,"type":CourseCreateOrConnectWithoutTreesInput}),
  upsert: t.field({"required":false,"type":CourseUpsertWithoutTreesInput}),
  connect: t.field({"required":false,"type":CourseWhereUniqueInput}),
  update: t.field({"required":false,"type":CourseUpdateToOneWithWhereWithoutTreesInput}),
});
export const CourseUpdateOneRequiredWithoutTreesNestedInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CourseUpdateOneRequiredWithoutTreesNestedInput>, false>('CourseUpdateOneRequiredWithoutTreesNestedInput').implement({
  fields: CourseUpdateOneRequiredWithoutTreesNestedInputFields,
});

export const SkillNodeUpdateManyWithoutTreeNestedInputFields = (t: any) => ({
  create: t.field({"required":false,"type":[SkillNodeCreateWithoutTreeInput]}),
  connectOrCreate: t.field({"required":false,"type":[SkillNodeCreateOrConnectWithoutTreeInput]}),
  upsert: t.field({"required":false,"type":[SkillNodeUpsertWithWhereUniqueWithoutTreeInput]}),
  createMany: t.field({"required":false,"type":SkillNodeCreateManyTreeInputEnvelope}),
  set: t.field({"required":false,"type":[SkillNodeWhereUniqueInput]}),
  disconnect: t.field({"required":false,"type":[SkillNodeWhereUniqueInput]}),
  delete: t.field({"required":false,"type":[SkillNodeWhereUniqueInput]}),
  connect: t.field({"required":false,"type":[SkillNodeWhereUniqueInput]}),
  update: t.field({"required":false,"type":[SkillNodeUpdateWithWhereUniqueWithoutTreeInput]}),
  updateMany: t.field({"required":false,"type":[SkillNodeUpdateManyWithWhereWithoutTreeInput]}),
  deleteMany: t.field({"required":false,"type":[SkillNodeScalarWhereInput]}),
});
export const SkillNodeUpdateManyWithoutTreeNestedInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeUpdateManyWithoutTreeNestedInput>, false>('SkillNodeUpdateManyWithoutTreeNestedInput').implement({
  fields: SkillNodeUpdateManyWithoutTreeNestedInputFields,
});

export const SkillTreeCreateNestedOneWithoutNodesInputFields = (t: any) => ({
  create: t.field({"required":false,"type":SkillTreeCreateWithoutNodesInput}),
  connectOrCreate: t.field({"required":false,"type":SkillTreeCreateOrConnectWithoutNodesInput}),
  connect: t.field({"required":false,"type":SkillTreeWhereUniqueInput}),
});
export const SkillTreeCreateNestedOneWithoutNodesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillTreeCreateNestedOneWithoutNodesInput>, false>('SkillTreeCreateNestedOneWithoutNodesInput').implement({
  fields: SkillTreeCreateNestedOneWithoutNodesInputFields,
});

export const LessonBlocksCreateNestedManyWithoutNodeInputFields = (t: any) => ({
  create: t.field({"required":false,"type":[LessonBlocksCreateWithoutNodeInput]}),
  connectOrCreate: t.field({"required":false,"type":[LessonBlocksCreateOrConnectWithoutNodeInput]}),
  createMany: t.field({"required":false,"type":LessonBlocksCreateManyNodeInputEnvelope}),
  connect: t.field({"required":false,"type":[LessonBlocksWhereUniqueInput]}),
});
export const LessonBlocksCreateNestedManyWithoutNodeInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.LessonBlocksCreateNestedManyWithoutNodeInput>, false>('LessonBlocksCreateNestedManyWithoutNodeInput').implement({
  fields: LessonBlocksCreateNestedManyWithoutNodeInputFields,
});

export const QuizCreateNestedOneWithoutNodeInputFields = (t: any) => ({
  create: t.field({"required":false,"type":QuizCreateWithoutNodeInput}),
  connectOrCreate: t.field({"required":false,"type":QuizCreateOrConnectWithoutNodeInput}),
  connect: t.field({"required":false,"type":QuizWhereUniqueInput}),
});
export const QuizCreateNestedOneWithoutNodeInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizCreateNestedOneWithoutNodeInput>, false>('QuizCreateNestedOneWithoutNodeInput').implement({
  fields: QuizCreateNestedOneWithoutNodeInputFields,
});

export const SkillNodePrerequisiteCreateNestedManyWithoutNodeInputFields = (t: any) => ({
  create: t.field({"required":false,"type":[SkillNodePrerequisiteCreateWithoutNodeInput]}),
  connectOrCreate: t.field({"required":false,"type":[SkillNodePrerequisiteCreateOrConnectWithoutNodeInput]}),
  createMany: t.field({"required":false,"type":SkillNodePrerequisiteCreateManyNodeInputEnvelope}),
  connect: t.field({"required":false,"type":[SkillNodePrerequisiteWhereUniqueInput]}),
});
export const SkillNodePrerequisiteCreateNestedManyWithoutNodeInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodePrerequisiteCreateNestedManyWithoutNodeInput>, false>('SkillNodePrerequisiteCreateNestedManyWithoutNodeInput').implement({
  fields: SkillNodePrerequisiteCreateNestedManyWithoutNodeInputFields,
});

export const SkillNodePrerequisiteCreateNestedManyWithoutDependsOnInputFields = (t: any) => ({
  create: t.field({"required":false,"type":[SkillNodePrerequisiteCreateWithoutDependsOnInput]}),
  connectOrCreate: t.field({"required":false,"type":[SkillNodePrerequisiteCreateOrConnectWithoutDependsOnInput]}),
  createMany: t.field({"required":false,"type":SkillNodePrerequisiteCreateManyDependsOnInputEnvelope}),
  connect: t.field({"required":false,"type":[SkillNodePrerequisiteWhereUniqueInput]}),
});
export const SkillNodePrerequisiteCreateNestedManyWithoutDependsOnInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodePrerequisiteCreateNestedManyWithoutDependsOnInput>, false>('SkillNodePrerequisiteCreateNestedManyWithoutDependsOnInput').implement({
  fields: SkillNodePrerequisiteCreateNestedManyWithoutDependsOnInputFields,
});

export const UserNodeProgressCreateNestedManyWithoutNodeInputFields = (t: any) => ({
  create: t.field({"required":false,"type":[UserNodeProgressCreateWithoutNodeInput]}),
  connectOrCreate: t.field({"required":false,"type":[UserNodeProgressCreateOrConnectWithoutNodeInput]}),
  createMany: t.field({"required":false,"type":UserNodeProgressCreateManyNodeInputEnvelope}),
  connect: t.field({"required":false,"type":[UserNodeProgressWhereUniqueInput]}),
});
export const UserNodeProgressCreateNestedManyWithoutNodeInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserNodeProgressCreateNestedManyWithoutNodeInput>, false>('UserNodeProgressCreateNestedManyWithoutNodeInput').implement({
  fields: UserNodeProgressCreateNestedManyWithoutNodeInputFields,
});

export const IntFieldUpdateOperationsInputFields = (t: any) => ({
  set: t.int({"required":false}),
  increment: t.int({"required":false}),
  decrement: t.int({"required":false}),
  multiply: t.int({"required":false}),
  divide: t.int({"required":false}),
});
export const IntFieldUpdateOperationsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.IntFieldUpdateOperationsInput>, false>('IntFieldUpdateOperationsInput').implement({
  fields: IntFieldUpdateOperationsInputFields,
});

export const NullableIntFieldUpdateOperationsInputFields = (t: any) => ({
  set: t.int({"required":false}),
  increment: t.int({"required":false}),
  decrement: t.int({"required":false}),
  multiply: t.int({"required":false}),
  divide: t.int({"required":false}),
});
export const NullableIntFieldUpdateOperationsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NullableIntFieldUpdateOperationsInput>, false>('NullableIntFieldUpdateOperationsInput').implement({
  fields: NullableIntFieldUpdateOperationsInputFields,
});

export const SkillTreeUpdateOneRequiredWithoutNodesNestedInputFields = (t: any) => ({
  create: t.field({"required":false,"type":SkillTreeCreateWithoutNodesInput}),
  connectOrCreate: t.field({"required":false,"type":SkillTreeCreateOrConnectWithoutNodesInput}),
  upsert: t.field({"required":false,"type":SkillTreeUpsertWithoutNodesInput}),
  connect: t.field({"required":false,"type":SkillTreeWhereUniqueInput}),
  update: t.field({"required":false,"type":SkillTreeUpdateToOneWithWhereWithoutNodesInput}),
});
export const SkillTreeUpdateOneRequiredWithoutNodesNestedInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillTreeUpdateOneRequiredWithoutNodesNestedInput>, false>('SkillTreeUpdateOneRequiredWithoutNodesNestedInput').implement({
  fields: SkillTreeUpdateOneRequiredWithoutNodesNestedInputFields,
});

export const LessonBlocksUpdateManyWithoutNodeNestedInputFields = (t: any) => ({
  create: t.field({"required":false,"type":[LessonBlocksCreateWithoutNodeInput]}),
  connectOrCreate: t.field({"required":false,"type":[LessonBlocksCreateOrConnectWithoutNodeInput]}),
  upsert: t.field({"required":false,"type":[LessonBlocksUpsertWithWhereUniqueWithoutNodeInput]}),
  createMany: t.field({"required":false,"type":LessonBlocksCreateManyNodeInputEnvelope}),
  set: t.field({"required":false,"type":[LessonBlocksWhereUniqueInput]}),
  disconnect: t.field({"required":false,"type":[LessonBlocksWhereUniqueInput]}),
  delete: t.field({"required":false,"type":[LessonBlocksWhereUniqueInput]}),
  connect: t.field({"required":false,"type":[LessonBlocksWhereUniqueInput]}),
  update: t.field({"required":false,"type":[LessonBlocksUpdateWithWhereUniqueWithoutNodeInput]}),
  updateMany: t.field({"required":false,"type":[LessonBlocksUpdateManyWithWhereWithoutNodeInput]}),
  deleteMany: t.field({"required":false,"type":[LessonBlocksScalarWhereInput]}),
});
export const LessonBlocksUpdateManyWithoutNodeNestedInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.LessonBlocksUpdateManyWithoutNodeNestedInput>, false>('LessonBlocksUpdateManyWithoutNodeNestedInput').implement({
  fields: LessonBlocksUpdateManyWithoutNodeNestedInputFields,
});

export const QuizUpdateOneWithoutNodeNestedInputFields = (t: any) => ({
  create: t.field({"required":false,"type":QuizCreateWithoutNodeInput}),
  connectOrCreate: t.field({"required":false,"type":QuizCreateOrConnectWithoutNodeInput}),
  upsert: t.field({"required":false,"type":QuizUpsertWithoutNodeInput}),
  disconnect: t.field({"required":false,"type":QuizWhereInput}),
  delete: t.field({"required":false,"type":QuizWhereInput}),
  connect: t.field({"required":false,"type":QuizWhereUniqueInput}),
  update: t.field({"required":false,"type":QuizUpdateToOneWithWhereWithoutNodeInput}),
});
export const QuizUpdateOneWithoutNodeNestedInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizUpdateOneWithoutNodeNestedInput>, false>('QuizUpdateOneWithoutNodeNestedInput').implement({
  fields: QuizUpdateOneWithoutNodeNestedInputFields,
});

export const SkillNodePrerequisiteUpdateManyWithoutNodeNestedInputFields = (t: any) => ({
  create: t.field({"required":false,"type":[SkillNodePrerequisiteCreateWithoutNodeInput]}),
  connectOrCreate: t.field({"required":false,"type":[SkillNodePrerequisiteCreateOrConnectWithoutNodeInput]}),
  upsert: t.field({"required":false,"type":[SkillNodePrerequisiteUpsertWithWhereUniqueWithoutNodeInput]}),
  createMany: t.field({"required":false,"type":SkillNodePrerequisiteCreateManyNodeInputEnvelope}),
  set: t.field({"required":false,"type":[SkillNodePrerequisiteWhereUniqueInput]}),
  disconnect: t.field({"required":false,"type":[SkillNodePrerequisiteWhereUniqueInput]}),
  delete: t.field({"required":false,"type":[SkillNodePrerequisiteWhereUniqueInput]}),
  connect: t.field({"required":false,"type":[SkillNodePrerequisiteWhereUniqueInput]}),
  update: t.field({"required":false,"type":[SkillNodePrerequisiteUpdateWithWhereUniqueWithoutNodeInput]}),
  updateMany: t.field({"required":false,"type":[SkillNodePrerequisiteUpdateManyWithWhereWithoutNodeInput]}),
  deleteMany: t.field({"required":false,"type":[SkillNodePrerequisiteScalarWhereInput]}),
});
export const SkillNodePrerequisiteUpdateManyWithoutNodeNestedInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodePrerequisiteUpdateManyWithoutNodeNestedInput>, false>('SkillNodePrerequisiteUpdateManyWithoutNodeNestedInput').implement({
  fields: SkillNodePrerequisiteUpdateManyWithoutNodeNestedInputFields,
});

export const SkillNodePrerequisiteUpdateManyWithoutDependsOnNestedInputFields = (t: any) => ({
  create: t.field({"required":false,"type":[SkillNodePrerequisiteCreateWithoutDependsOnInput]}),
  connectOrCreate: t.field({"required":false,"type":[SkillNodePrerequisiteCreateOrConnectWithoutDependsOnInput]}),
  upsert: t.field({"required":false,"type":[SkillNodePrerequisiteUpsertWithWhereUniqueWithoutDependsOnInput]}),
  createMany: t.field({"required":false,"type":SkillNodePrerequisiteCreateManyDependsOnInputEnvelope}),
  set: t.field({"required":false,"type":[SkillNodePrerequisiteWhereUniqueInput]}),
  disconnect: t.field({"required":false,"type":[SkillNodePrerequisiteWhereUniqueInput]}),
  delete: t.field({"required":false,"type":[SkillNodePrerequisiteWhereUniqueInput]}),
  connect: t.field({"required":false,"type":[SkillNodePrerequisiteWhereUniqueInput]}),
  update: t.field({"required":false,"type":[SkillNodePrerequisiteUpdateWithWhereUniqueWithoutDependsOnInput]}),
  updateMany: t.field({"required":false,"type":[SkillNodePrerequisiteUpdateManyWithWhereWithoutDependsOnInput]}),
  deleteMany: t.field({"required":false,"type":[SkillNodePrerequisiteScalarWhereInput]}),
});
export const SkillNodePrerequisiteUpdateManyWithoutDependsOnNestedInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodePrerequisiteUpdateManyWithoutDependsOnNestedInput>, false>('SkillNodePrerequisiteUpdateManyWithoutDependsOnNestedInput').implement({
  fields: SkillNodePrerequisiteUpdateManyWithoutDependsOnNestedInputFields,
});

export const UserNodeProgressUpdateManyWithoutNodeNestedInputFields = (t: any) => ({
  create: t.field({"required":false,"type":[UserNodeProgressCreateWithoutNodeInput]}),
  connectOrCreate: t.field({"required":false,"type":[UserNodeProgressCreateOrConnectWithoutNodeInput]}),
  upsert: t.field({"required":false,"type":[UserNodeProgressUpsertWithWhereUniqueWithoutNodeInput]}),
  createMany: t.field({"required":false,"type":UserNodeProgressCreateManyNodeInputEnvelope}),
  set: t.field({"required":false,"type":[UserNodeProgressWhereUniqueInput]}),
  disconnect: t.field({"required":false,"type":[UserNodeProgressWhereUniqueInput]}),
  delete: t.field({"required":false,"type":[UserNodeProgressWhereUniqueInput]}),
  connect: t.field({"required":false,"type":[UserNodeProgressWhereUniqueInput]}),
  update: t.field({"required":false,"type":[UserNodeProgressUpdateWithWhereUniqueWithoutNodeInput]}),
  updateMany: t.field({"required":false,"type":[UserNodeProgressUpdateManyWithWhereWithoutNodeInput]}),
  deleteMany: t.field({"required":false,"type":[UserNodeProgressScalarWhereInput]}),
});
export const UserNodeProgressUpdateManyWithoutNodeNestedInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserNodeProgressUpdateManyWithoutNodeNestedInput>, false>('UserNodeProgressUpdateManyWithoutNodeNestedInput').implement({
  fields: UserNodeProgressUpdateManyWithoutNodeNestedInputFields,
});

export const SkillNodeCreateNestedOneWithoutPrerequisitesInputFields = (t: any) => ({
  create: t.field({"required":false,"type":SkillNodeCreateWithoutPrerequisitesInput}),
  connectOrCreate: t.field({"required":false,"type":SkillNodeCreateOrConnectWithoutPrerequisitesInput}),
  connect: t.field({"required":false,"type":SkillNodeWhereUniqueInput}),
});
export const SkillNodeCreateNestedOneWithoutPrerequisitesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeCreateNestedOneWithoutPrerequisitesInput>, false>('SkillNodeCreateNestedOneWithoutPrerequisitesInput').implement({
  fields: SkillNodeCreateNestedOneWithoutPrerequisitesInputFields,
});

export const SkillNodeCreateNestedOneWithoutRequiredForInputFields = (t: any) => ({
  create: t.field({"required":false,"type":SkillNodeCreateWithoutRequiredForInput}),
  connectOrCreate: t.field({"required":false,"type":SkillNodeCreateOrConnectWithoutRequiredForInput}),
  connect: t.field({"required":false,"type":SkillNodeWhereUniqueInput}),
});
export const SkillNodeCreateNestedOneWithoutRequiredForInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeCreateNestedOneWithoutRequiredForInput>, false>('SkillNodeCreateNestedOneWithoutRequiredForInput').implement({
  fields: SkillNodeCreateNestedOneWithoutRequiredForInputFields,
});

export const SkillNodeUpdateOneRequiredWithoutPrerequisitesNestedInputFields = (t: any) => ({
  create: t.field({"required":false,"type":SkillNodeCreateWithoutPrerequisitesInput}),
  connectOrCreate: t.field({"required":false,"type":SkillNodeCreateOrConnectWithoutPrerequisitesInput}),
  upsert: t.field({"required":false,"type":SkillNodeUpsertWithoutPrerequisitesInput}),
  connect: t.field({"required":false,"type":SkillNodeWhereUniqueInput}),
  update: t.field({"required":false,"type":SkillNodeUpdateToOneWithWhereWithoutPrerequisitesInput}),
});
export const SkillNodeUpdateOneRequiredWithoutPrerequisitesNestedInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeUpdateOneRequiredWithoutPrerequisitesNestedInput>, false>('SkillNodeUpdateOneRequiredWithoutPrerequisitesNestedInput').implement({
  fields: SkillNodeUpdateOneRequiredWithoutPrerequisitesNestedInputFields,
});

export const SkillNodeUpdateOneRequiredWithoutRequiredForNestedInputFields = (t: any) => ({
  create: t.field({"required":false,"type":SkillNodeCreateWithoutRequiredForInput}),
  connectOrCreate: t.field({"required":false,"type":SkillNodeCreateOrConnectWithoutRequiredForInput}),
  upsert: t.field({"required":false,"type":SkillNodeUpsertWithoutRequiredForInput}),
  connect: t.field({"required":false,"type":SkillNodeWhereUniqueInput}),
  update: t.field({"required":false,"type":SkillNodeUpdateToOneWithWhereWithoutRequiredForInput}),
});
export const SkillNodeUpdateOneRequiredWithoutRequiredForNestedInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeUpdateOneRequiredWithoutRequiredForNestedInput>, false>('SkillNodeUpdateOneRequiredWithoutRequiredForNestedInput').implement({
  fields: SkillNodeUpdateOneRequiredWithoutRequiredForNestedInputFields,
});

export const SkillNodeCreateNestedOneWithoutLessonsInputFields = (t: any) => ({
  create: t.field({"required":false,"type":SkillNodeCreateWithoutLessonsInput}),
  connectOrCreate: t.field({"required":false,"type":SkillNodeCreateOrConnectWithoutLessonsInput}),
  connect: t.field({"required":false,"type":SkillNodeWhereUniqueInput}),
});
export const SkillNodeCreateNestedOneWithoutLessonsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeCreateNestedOneWithoutLessonsInput>, false>('SkillNodeCreateNestedOneWithoutLessonsInput').implement({
  fields: SkillNodeCreateNestedOneWithoutLessonsInputFields,
});

export const EnumContentTypeFieldUpdateOperationsInputFields = (t: any) => ({
  set: t.field({"required":false,"type":ContentType}),
});
export const EnumContentTypeFieldUpdateOperationsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.EnumContentTypeFieldUpdateOperationsInput>, false>('EnumContentTypeFieldUpdateOperationsInput').implement({
  fields: EnumContentTypeFieldUpdateOperationsInputFields,
});

export const EnumLessonStatusFieldUpdateOperationsInputFields = (t: any) => ({
  set: t.field({"required":false,"type":LessonStatus}),
});
export const EnumLessonStatusFieldUpdateOperationsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.EnumLessonStatusFieldUpdateOperationsInput>, false>('EnumLessonStatusFieldUpdateOperationsInput').implement({
  fields: EnumLessonStatusFieldUpdateOperationsInputFields,
});

export const SkillNodeUpdateOneRequiredWithoutLessonsNestedInputFields = (t: any) => ({
  create: t.field({"required":false,"type":SkillNodeCreateWithoutLessonsInput}),
  connectOrCreate: t.field({"required":false,"type":SkillNodeCreateOrConnectWithoutLessonsInput}),
  upsert: t.field({"required":false,"type":SkillNodeUpsertWithoutLessonsInput}),
  connect: t.field({"required":false,"type":SkillNodeWhereUniqueInput}),
  update: t.field({"required":false,"type":SkillNodeUpdateToOneWithWhereWithoutLessonsInput}),
});
export const SkillNodeUpdateOneRequiredWithoutLessonsNestedInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeUpdateOneRequiredWithoutLessonsNestedInput>, false>('SkillNodeUpdateOneRequiredWithoutLessonsNestedInput').implement({
  fields: SkillNodeUpdateOneRequiredWithoutLessonsNestedInputFields,
});

export const SkillNodeCreateNestedOneWithoutQuizInputFields = (t: any) => ({
  create: t.field({"required":false,"type":SkillNodeCreateWithoutQuizInput}),
  connectOrCreate: t.field({"required":false,"type":SkillNodeCreateOrConnectWithoutQuizInput}),
  connect: t.field({"required":false,"type":SkillNodeWhereUniqueInput}),
});
export const SkillNodeCreateNestedOneWithoutQuizInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeCreateNestedOneWithoutQuizInput>, false>('SkillNodeCreateNestedOneWithoutQuizInput').implement({
  fields: SkillNodeCreateNestedOneWithoutQuizInputFields,
});

export const QuizQuestionCreateNestedManyWithoutQuizInputFields = (t: any) => ({
  create: t.field({"required":false,"type":[QuizQuestionCreateWithoutQuizInput]}),
  connectOrCreate: t.field({"required":false,"type":[QuizQuestionCreateOrConnectWithoutQuizInput]}),
  createMany: t.field({"required":false,"type":QuizQuestionCreateManyQuizInputEnvelope}),
  connect: t.field({"required":false,"type":[QuizQuestionWhereUniqueInput]}),
});
export const QuizQuestionCreateNestedManyWithoutQuizInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizQuestionCreateNestedManyWithoutQuizInput>, false>('QuizQuestionCreateNestedManyWithoutQuizInput').implement({
  fields: QuizQuestionCreateNestedManyWithoutQuizInputFields,
});

export const QuizAttemptCreateNestedManyWithoutQuizInputFields = (t: any) => ({
  create: t.field({"required":false,"type":[QuizAttemptCreateWithoutQuizInput]}),
  connectOrCreate: t.field({"required":false,"type":[QuizAttemptCreateOrConnectWithoutQuizInput]}),
  createMany: t.field({"required":false,"type":QuizAttemptCreateManyQuizInputEnvelope}),
  connect: t.field({"required":false,"type":[QuizAttemptWhereUniqueInput]}),
});
export const QuizAttemptCreateNestedManyWithoutQuizInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptCreateNestedManyWithoutQuizInput>, false>('QuizAttemptCreateNestedManyWithoutQuizInput').implement({
  fields: QuizAttemptCreateNestedManyWithoutQuizInputFields,
});

export const BoolFieldUpdateOperationsInputFields = (t: any) => ({
  set: t.boolean({"required":false}),
});
export const BoolFieldUpdateOperationsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.BoolFieldUpdateOperationsInput>, false>('BoolFieldUpdateOperationsInput').implement({
  fields: BoolFieldUpdateOperationsInputFields,
});

export const SkillNodeUpdateOneRequiredWithoutQuizNestedInputFields = (t: any) => ({
  create: t.field({"required":false,"type":SkillNodeCreateWithoutQuizInput}),
  connectOrCreate: t.field({"required":false,"type":SkillNodeCreateOrConnectWithoutQuizInput}),
  upsert: t.field({"required":false,"type":SkillNodeUpsertWithoutQuizInput}),
  connect: t.field({"required":false,"type":SkillNodeWhereUniqueInput}),
  update: t.field({"required":false,"type":SkillNodeUpdateToOneWithWhereWithoutQuizInput}),
});
export const SkillNodeUpdateOneRequiredWithoutQuizNestedInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeUpdateOneRequiredWithoutQuizNestedInput>, false>('SkillNodeUpdateOneRequiredWithoutQuizNestedInput').implement({
  fields: SkillNodeUpdateOneRequiredWithoutQuizNestedInputFields,
});

export const QuizQuestionUpdateManyWithoutQuizNestedInputFields = (t: any) => ({
  create: t.field({"required":false,"type":[QuizQuestionCreateWithoutQuizInput]}),
  connectOrCreate: t.field({"required":false,"type":[QuizQuestionCreateOrConnectWithoutQuizInput]}),
  upsert: t.field({"required":false,"type":[QuizQuestionUpsertWithWhereUniqueWithoutQuizInput]}),
  createMany: t.field({"required":false,"type":QuizQuestionCreateManyQuizInputEnvelope}),
  set: t.field({"required":false,"type":[QuizQuestionWhereUniqueInput]}),
  disconnect: t.field({"required":false,"type":[QuizQuestionWhereUniqueInput]}),
  delete: t.field({"required":false,"type":[QuizQuestionWhereUniqueInput]}),
  connect: t.field({"required":false,"type":[QuizQuestionWhereUniqueInput]}),
  update: t.field({"required":false,"type":[QuizQuestionUpdateWithWhereUniqueWithoutQuizInput]}),
  updateMany: t.field({"required":false,"type":[QuizQuestionUpdateManyWithWhereWithoutQuizInput]}),
  deleteMany: t.field({"required":false,"type":[QuizQuestionScalarWhereInput]}),
});
export const QuizQuestionUpdateManyWithoutQuizNestedInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizQuestionUpdateManyWithoutQuizNestedInput>, false>('QuizQuestionUpdateManyWithoutQuizNestedInput').implement({
  fields: QuizQuestionUpdateManyWithoutQuizNestedInputFields,
});

export const QuizAttemptUpdateManyWithoutQuizNestedInputFields = (t: any) => ({
  create: t.field({"required":false,"type":[QuizAttemptCreateWithoutQuizInput]}),
  connectOrCreate: t.field({"required":false,"type":[QuizAttemptCreateOrConnectWithoutQuizInput]}),
  upsert: t.field({"required":false,"type":[QuizAttemptUpsertWithWhereUniqueWithoutQuizInput]}),
  createMany: t.field({"required":false,"type":QuizAttemptCreateManyQuizInputEnvelope}),
  set: t.field({"required":false,"type":[QuizAttemptWhereUniqueInput]}),
  disconnect: t.field({"required":false,"type":[QuizAttemptWhereUniqueInput]}),
  delete: t.field({"required":false,"type":[QuizAttemptWhereUniqueInput]}),
  connect: t.field({"required":false,"type":[QuizAttemptWhereUniqueInput]}),
  update: t.field({"required":false,"type":[QuizAttemptUpdateWithWhereUniqueWithoutQuizInput]}),
  updateMany: t.field({"required":false,"type":[QuizAttemptUpdateManyWithWhereWithoutQuizInput]}),
  deleteMany: t.field({"required":false,"type":[QuizAttemptScalarWhereInput]}),
});
export const QuizAttemptUpdateManyWithoutQuizNestedInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptUpdateManyWithoutQuizNestedInput>, false>('QuizAttemptUpdateManyWithoutQuizNestedInput').implement({
  fields: QuizAttemptUpdateManyWithoutQuizNestedInputFields,
});

export const QuizCreateNestedOneWithoutQuestionsInputFields = (t: any) => ({
  create: t.field({"required":false,"type":QuizCreateWithoutQuestionsInput}),
  connectOrCreate: t.field({"required":false,"type":QuizCreateOrConnectWithoutQuestionsInput}),
  connect: t.field({"required":false,"type":QuizWhereUniqueInput}),
});
export const QuizCreateNestedOneWithoutQuestionsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizCreateNestedOneWithoutQuestionsInput>, false>('QuizCreateNestedOneWithoutQuestionsInput').implement({
  fields: QuizCreateNestedOneWithoutQuestionsInputFields,
});

export const QuizOptionCreateNestedManyWithoutQuestionInputFields = (t: any) => ({
  create: t.field({"required":false,"type":[QuizOptionCreateWithoutQuestionInput]}),
  connectOrCreate: t.field({"required":false,"type":[QuizOptionCreateOrConnectWithoutQuestionInput]}),
  createMany: t.field({"required":false,"type":QuizOptionCreateManyQuestionInputEnvelope}),
  connect: t.field({"required":false,"type":[QuizOptionWhereUniqueInput]}),
});
export const QuizOptionCreateNestedManyWithoutQuestionInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizOptionCreateNestedManyWithoutQuestionInput>, false>('QuizOptionCreateNestedManyWithoutQuestionInput').implement({
  fields: QuizOptionCreateNestedManyWithoutQuestionInputFields,
});

export const QuizAttemptAnswerCreateNestedManyWithoutQuestionInputFields = (t: any) => ({
  create: t.field({"required":false,"type":[QuizAttemptAnswerCreateWithoutQuestionInput]}),
  connectOrCreate: t.field({"required":false,"type":[QuizAttemptAnswerCreateOrConnectWithoutQuestionInput]}),
  createMany: t.field({"required":false,"type":QuizAttemptAnswerCreateManyQuestionInputEnvelope}),
  connect: t.field({"required":false,"type":[QuizAttemptAnswerWhereUniqueInput]}),
});
export const QuizAttemptAnswerCreateNestedManyWithoutQuestionInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptAnswerCreateNestedManyWithoutQuestionInput>, false>('QuizAttemptAnswerCreateNestedManyWithoutQuestionInput').implement({
  fields: QuizAttemptAnswerCreateNestedManyWithoutQuestionInputFields,
});

export const EnumQuestionTypeFieldUpdateOperationsInputFields = (t: any) => ({
  set: t.field({"required":false,"type":QuestionType}),
});
export const EnumQuestionTypeFieldUpdateOperationsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.EnumQuestionTypeFieldUpdateOperationsInput>, false>('EnumQuestionTypeFieldUpdateOperationsInput').implement({
  fields: EnumQuestionTypeFieldUpdateOperationsInputFields,
});

export const QuizUpdateOneRequiredWithoutQuestionsNestedInputFields = (t: any) => ({
  create: t.field({"required":false,"type":QuizCreateWithoutQuestionsInput}),
  connectOrCreate: t.field({"required":false,"type":QuizCreateOrConnectWithoutQuestionsInput}),
  upsert: t.field({"required":false,"type":QuizUpsertWithoutQuestionsInput}),
  connect: t.field({"required":false,"type":QuizWhereUniqueInput}),
  update: t.field({"required":false,"type":QuizUpdateToOneWithWhereWithoutQuestionsInput}),
});
export const QuizUpdateOneRequiredWithoutQuestionsNestedInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizUpdateOneRequiredWithoutQuestionsNestedInput>, false>('QuizUpdateOneRequiredWithoutQuestionsNestedInput').implement({
  fields: QuizUpdateOneRequiredWithoutQuestionsNestedInputFields,
});

export const QuizOptionUpdateManyWithoutQuestionNestedInputFields = (t: any) => ({
  create: t.field({"required":false,"type":[QuizOptionCreateWithoutQuestionInput]}),
  connectOrCreate: t.field({"required":false,"type":[QuizOptionCreateOrConnectWithoutQuestionInput]}),
  upsert: t.field({"required":false,"type":[QuizOptionUpsertWithWhereUniqueWithoutQuestionInput]}),
  createMany: t.field({"required":false,"type":QuizOptionCreateManyQuestionInputEnvelope}),
  set: t.field({"required":false,"type":[QuizOptionWhereUniqueInput]}),
  disconnect: t.field({"required":false,"type":[QuizOptionWhereUniqueInput]}),
  delete: t.field({"required":false,"type":[QuizOptionWhereUniqueInput]}),
  connect: t.field({"required":false,"type":[QuizOptionWhereUniqueInput]}),
  update: t.field({"required":false,"type":[QuizOptionUpdateWithWhereUniqueWithoutQuestionInput]}),
  updateMany: t.field({"required":false,"type":[QuizOptionUpdateManyWithWhereWithoutQuestionInput]}),
  deleteMany: t.field({"required":false,"type":[QuizOptionScalarWhereInput]}),
});
export const QuizOptionUpdateManyWithoutQuestionNestedInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizOptionUpdateManyWithoutQuestionNestedInput>, false>('QuizOptionUpdateManyWithoutQuestionNestedInput').implement({
  fields: QuizOptionUpdateManyWithoutQuestionNestedInputFields,
});

export const QuizAttemptAnswerUpdateManyWithoutQuestionNestedInputFields = (t: any) => ({
  create: t.field({"required":false,"type":[QuizAttemptAnswerCreateWithoutQuestionInput]}),
  connectOrCreate: t.field({"required":false,"type":[QuizAttemptAnswerCreateOrConnectWithoutQuestionInput]}),
  upsert: t.field({"required":false,"type":[QuizAttemptAnswerUpsertWithWhereUniqueWithoutQuestionInput]}),
  createMany: t.field({"required":false,"type":QuizAttemptAnswerCreateManyQuestionInputEnvelope}),
  set: t.field({"required":false,"type":[QuizAttemptAnswerWhereUniqueInput]}),
  disconnect: t.field({"required":false,"type":[QuizAttemptAnswerWhereUniqueInput]}),
  delete: t.field({"required":false,"type":[QuizAttemptAnswerWhereUniqueInput]}),
  connect: t.field({"required":false,"type":[QuizAttemptAnswerWhereUniqueInput]}),
  update: t.field({"required":false,"type":[QuizAttemptAnswerUpdateWithWhereUniqueWithoutQuestionInput]}),
  updateMany: t.field({"required":false,"type":[QuizAttemptAnswerUpdateManyWithWhereWithoutQuestionInput]}),
  deleteMany: t.field({"required":false,"type":[QuizAttemptAnswerScalarWhereInput]}),
});
export const QuizAttemptAnswerUpdateManyWithoutQuestionNestedInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptAnswerUpdateManyWithoutQuestionNestedInput>, false>('QuizAttemptAnswerUpdateManyWithoutQuestionNestedInput').implement({
  fields: QuizAttemptAnswerUpdateManyWithoutQuestionNestedInputFields,
});

export const QuizQuestionCreateNestedOneWithoutOptionsInputFields = (t: any) => ({
  create: t.field({"required":false,"type":QuizQuestionCreateWithoutOptionsInput}),
  connectOrCreate: t.field({"required":false,"type":QuizQuestionCreateOrConnectWithoutOptionsInput}),
  connect: t.field({"required":false,"type":QuizQuestionWhereUniqueInput}),
});
export const QuizQuestionCreateNestedOneWithoutOptionsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizQuestionCreateNestedOneWithoutOptionsInput>, false>('QuizQuestionCreateNestedOneWithoutOptionsInput').implement({
  fields: QuizQuestionCreateNestedOneWithoutOptionsInputFields,
});

export const QuizQuestionUpdateOneRequiredWithoutOptionsNestedInputFields = (t: any) => ({
  create: t.field({"required":false,"type":QuizQuestionCreateWithoutOptionsInput}),
  connectOrCreate: t.field({"required":false,"type":QuizQuestionCreateOrConnectWithoutOptionsInput}),
  upsert: t.field({"required":false,"type":QuizQuestionUpsertWithoutOptionsInput}),
  connect: t.field({"required":false,"type":QuizQuestionWhereUniqueInput}),
  update: t.field({"required":false,"type":QuizQuestionUpdateToOneWithWhereWithoutOptionsInput}),
});
export const QuizQuestionUpdateOneRequiredWithoutOptionsNestedInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizQuestionUpdateOneRequiredWithoutOptionsNestedInput>, false>('QuizQuestionUpdateOneRequiredWithoutOptionsNestedInput').implement({
  fields: QuizQuestionUpdateOneRequiredWithoutOptionsNestedInputFields,
});

export const QuizCreateNestedOneWithoutAttemptsInputFields = (t: any) => ({
  create: t.field({"required":false,"type":QuizCreateWithoutAttemptsInput}),
  connectOrCreate: t.field({"required":false,"type":QuizCreateOrConnectWithoutAttemptsInput}),
  connect: t.field({"required":false,"type":QuizWhereUniqueInput}),
});
export const QuizCreateNestedOneWithoutAttemptsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizCreateNestedOneWithoutAttemptsInput>, false>('QuizCreateNestedOneWithoutAttemptsInput').implement({
  fields: QuizCreateNestedOneWithoutAttemptsInputFields,
});

export const UserCreateNestedOneWithoutQuizAttemptsInputFields = (t: any) => ({
  create: t.field({"required":false,"type":UserCreateWithoutQuizAttemptsInput}),
  connectOrCreate: t.field({"required":false,"type":UserCreateOrConnectWithoutQuizAttemptsInput}),
  connect: t.field({"required":false,"type":UserWhereUniqueInput}),
});
export const UserCreateNestedOneWithoutQuizAttemptsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserCreateNestedOneWithoutQuizAttemptsInput>, false>('UserCreateNestedOneWithoutQuizAttemptsInput').implement({
  fields: UserCreateNestedOneWithoutQuizAttemptsInputFields,
});

export const QuizAttemptAnswerCreateNestedManyWithoutAttemptInputFields = (t: any) => ({
  create: t.field({"required":false,"type":[QuizAttemptAnswerCreateWithoutAttemptInput]}),
  connectOrCreate: t.field({"required":false,"type":[QuizAttemptAnswerCreateOrConnectWithoutAttemptInput]}),
  createMany: t.field({"required":false,"type":QuizAttemptAnswerCreateManyAttemptInputEnvelope}),
  connect: t.field({"required":false,"type":[QuizAttemptAnswerWhereUniqueInput]}),
});
export const QuizAttemptAnswerCreateNestedManyWithoutAttemptInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptAnswerCreateNestedManyWithoutAttemptInput>, false>('QuizAttemptAnswerCreateNestedManyWithoutAttemptInput').implement({
  fields: QuizAttemptAnswerCreateNestedManyWithoutAttemptInputFields,
});

export const QuizUpdateOneRequiredWithoutAttemptsNestedInputFields = (t: any) => ({
  create: t.field({"required":false,"type":QuizCreateWithoutAttemptsInput}),
  connectOrCreate: t.field({"required":false,"type":QuizCreateOrConnectWithoutAttemptsInput}),
  upsert: t.field({"required":false,"type":QuizUpsertWithoutAttemptsInput}),
  connect: t.field({"required":false,"type":QuizWhereUniqueInput}),
  update: t.field({"required":false,"type":QuizUpdateToOneWithWhereWithoutAttemptsInput}),
});
export const QuizUpdateOneRequiredWithoutAttemptsNestedInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizUpdateOneRequiredWithoutAttemptsNestedInput>, false>('QuizUpdateOneRequiredWithoutAttemptsNestedInput').implement({
  fields: QuizUpdateOneRequiredWithoutAttemptsNestedInputFields,
});

export const UserUpdateOneRequiredWithoutQuizAttemptsNestedInputFields = (t: any) => ({
  create: t.field({"required":false,"type":UserCreateWithoutQuizAttemptsInput}),
  connectOrCreate: t.field({"required":false,"type":UserCreateOrConnectWithoutQuizAttemptsInput}),
  upsert: t.field({"required":false,"type":UserUpsertWithoutQuizAttemptsInput}),
  connect: t.field({"required":false,"type":UserWhereUniqueInput}),
  update: t.field({"required":false,"type":UserUpdateToOneWithWhereWithoutQuizAttemptsInput}),
});
export const UserUpdateOneRequiredWithoutQuizAttemptsNestedInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserUpdateOneRequiredWithoutQuizAttemptsNestedInput>, false>('UserUpdateOneRequiredWithoutQuizAttemptsNestedInput').implement({
  fields: UserUpdateOneRequiredWithoutQuizAttemptsNestedInputFields,
});

export const QuizAttemptAnswerUpdateManyWithoutAttemptNestedInputFields = (t: any) => ({
  create: t.field({"required":false,"type":[QuizAttemptAnswerCreateWithoutAttemptInput]}),
  connectOrCreate: t.field({"required":false,"type":[QuizAttemptAnswerCreateOrConnectWithoutAttemptInput]}),
  upsert: t.field({"required":false,"type":[QuizAttemptAnswerUpsertWithWhereUniqueWithoutAttemptInput]}),
  createMany: t.field({"required":false,"type":QuizAttemptAnswerCreateManyAttemptInputEnvelope}),
  set: t.field({"required":false,"type":[QuizAttemptAnswerWhereUniqueInput]}),
  disconnect: t.field({"required":false,"type":[QuizAttemptAnswerWhereUniqueInput]}),
  delete: t.field({"required":false,"type":[QuizAttemptAnswerWhereUniqueInput]}),
  connect: t.field({"required":false,"type":[QuizAttemptAnswerWhereUniqueInput]}),
  update: t.field({"required":false,"type":[QuizAttemptAnswerUpdateWithWhereUniqueWithoutAttemptInput]}),
  updateMany: t.field({"required":false,"type":[QuizAttemptAnswerUpdateManyWithWhereWithoutAttemptInput]}),
  deleteMany: t.field({"required":false,"type":[QuizAttemptAnswerScalarWhereInput]}),
});
export const QuizAttemptAnswerUpdateManyWithoutAttemptNestedInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptAnswerUpdateManyWithoutAttemptNestedInput>, false>('QuizAttemptAnswerUpdateManyWithoutAttemptNestedInput').implement({
  fields: QuizAttemptAnswerUpdateManyWithoutAttemptNestedInputFields,
});

export const QuizAttemptCreateNestedOneWithoutAnswersInputFields = (t: any) => ({
  create: t.field({"required":false,"type":QuizAttemptCreateWithoutAnswersInput}),
  connectOrCreate: t.field({"required":false,"type":QuizAttemptCreateOrConnectWithoutAnswersInput}),
  connect: t.field({"required":false,"type":QuizAttemptWhereUniqueInput}),
});
export const QuizAttemptCreateNestedOneWithoutAnswersInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptCreateNestedOneWithoutAnswersInput>, false>('QuizAttemptCreateNestedOneWithoutAnswersInput').implement({
  fields: QuizAttemptCreateNestedOneWithoutAnswersInputFields,
});

export const QuizQuestionCreateNestedOneWithoutAnswersInputFields = (t: any) => ({
  create: t.field({"required":false,"type":QuizQuestionCreateWithoutAnswersInput}),
  connectOrCreate: t.field({"required":false,"type":QuizQuestionCreateOrConnectWithoutAnswersInput}),
  connect: t.field({"required":false,"type":QuizQuestionWhereUniqueInput}),
});
export const QuizQuestionCreateNestedOneWithoutAnswersInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizQuestionCreateNestedOneWithoutAnswersInput>, false>('QuizQuestionCreateNestedOneWithoutAnswersInput').implement({
  fields: QuizQuestionCreateNestedOneWithoutAnswersInputFields,
});

export const NullableBoolFieldUpdateOperationsInputFields = (t: any) => ({
  set: t.boolean({"required":false}),
});
export const NullableBoolFieldUpdateOperationsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NullableBoolFieldUpdateOperationsInput>, false>('NullableBoolFieldUpdateOperationsInput').implement({
  fields: NullableBoolFieldUpdateOperationsInputFields,
});

export const QuizAttemptUpdateOneRequiredWithoutAnswersNestedInputFields = (t: any) => ({
  create: t.field({"required":false,"type":QuizAttemptCreateWithoutAnswersInput}),
  connectOrCreate: t.field({"required":false,"type":QuizAttemptCreateOrConnectWithoutAnswersInput}),
  upsert: t.field({"required":false,"type":QuizAttemptUpsertWithoutAnswersInput}),
  connect: t.field({"required":false,"type":QuizAttemptWhereUniqueInput}),
  update: t.field({"required":false,"type":QuizAttemptUpdateToOneWithWhereWithoutAnswersInput}),
});
export const QuizAttemptUpdateOneRequiredWithoutAnswersNestedInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptUpdateOneRequiredWithoutAnswersNestedInput>, false>('QuizAttemptUpdateOneRequiredWithoutAnswersNestedInput').implement({
  fields: QuizAttemptUpdateOneRequiredWithoutAnswersNestedInputFields,
});

export const QuizQuestionUpdateOneRequiredWithoutAnswersNestedInputFields = (t: any) => ({
  create: t.field({"required":false,"type":QuizQuestionCreateWithoutAnswersInput}),
  connectOrCreate: t.field({"required":false,"type":QuizQuestionCreateOrConnectWithoutAnswersInput}),
  upsert: t.field({"required":false,"type":QuizQuestionUpsertWithoutAnswersInput}),
  connect: t.field({"required":false,"type":QuizQuestionWhereUniqueInput}),
  update: t.field({"required":false,"type":QuizQuestionUpdateToOneWithWhereWithoutAnswersInput}),
});
export const QuizQuestionUpdateOneRequiredWithoutAnswersNestedInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizQuestionUpdateOneRequiredWithoutAnswersNestedInput>, false>('QuizQuestionUpdateOneRequiredWithoutAnswersNestedInput').implement({
  fields: QuizQuestionUpdateOneRequiredWithoutAnswersNestedInputFields,
});

export const UserCreateNestedOneWithoutNodeProgressInputFields = (t: any) => ({
  create: t.field({"required":false,"type":UserCreateWithoutNodeProgressInput}),
  connectOrCreate: t.field({"required":false,"type":UserCreateOrConnectWithoutNodeProgressInput}),
  connect: t.field({"required":false,"type":UserWhereUniqueInput}),
});
export const UserCreateNestedOneWithoutNodeProgressInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserCreateNestedOneWithoutNodeProgressInput>, false>('UserCreateNestedOneWithoutNodeProgressInput').implement({
  fields: UserCreateNestedOneWithoutNodeProgressInputFields,
});

export const SkillNodeCreateNestedOneWithoutProgressesInputFields = (t: any) => ({
  create: t.field({"required":false,"type":SkillNodeCreateWithoutProgressesInput}),
  connectOrCreate: t.field({"required":false,"type":SkillNodeCreateOrConnectWithoutProgressesInput}),
  connect: t.field({"required":false,"type":SkillNodeWhereUniqueInput}),
});
export const SkillNodeCreateNestedOneWithoutProgressesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeCreateNestedOneWithoutProgressesInput>, false>('SkillNodeCreateNestedOneWithoutProgressesInput').implement({
  fields: SkillNodeCreateNestedOneWithoutProgressesInputFields,
});

export const EnumProgressStatusFieldUpdateOperationsInputFields = (t: any) => ({
  set: t.field({"required":false,"type":ProgressStatus}),
});
export const EnumProgressStatusFieldUpdateOperationsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.EnumProgressStatusFieldUpdateOperationsInput>, false>('EnumProgressStatusFieldUpdateOperationsInput').implement({
  fields: EnumProgressStatusFieldUpdateOperationsInputFields,
});

export const UserUpdateOneRequiredWithoutNodeProgressNestedInputFields = (t: any) => ({
  create: t.field({"required":false,"type":UserCreateWithoutNodeProgressInput}),
  connectOrCreate: t.field({"required":false,"type":UserCreateOrConnectWithoutNodeProgressInput}),
  upsert: t.field({"required":false,"type":UserUpsertWithoutNodeProgressInput}),
  connect: t.field({"required":false,"type":UserWhereUniqueInput}),
  update: t.field({"required":false,"type":UserUpdateToOneWithWhereWithoutNodeProgressInput}),
});
export const UserUpdateOneRequiredWithoutNodeProgressNestedInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserUpdateOneRequiredWithoutNodeProgressNestedInput>, false>('UserUpdateOneRequiredWithoutNodeProgressNestedInput').implement({
  fields: UserUpdateOneRequiredWithoutNodeProgressNestedInputFields,
});

export const SkillNodeUpdateOneRequiredWithoutProgressesNestedInputFields = (t: any) => ({
  create: t.field({"required":false,"type":SkillNodeCreateWithoutProgressesInput}),
  connectOrCreate: t.field({"required":false,"type":SkillNodeCreateOrConnectWithoutProgressesInput}),
  upsert: t.field({"required":false,"type":SkillNodeUpsertWithoutProgressesInput}),
  connect: t.field({"required":false,"type":SkillNodeWhereUniqueInput}),
  update: t.field({"required":false,"type":SkillNodeUpdateToOneWithWhereWithoutProgressesInput}),
});
export const SkillNodeUpdateOneRequiredWithoutProgressesNestedInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeUpdateOneRequiredWithoutProgressesNestedInput>, false>('SkillNodeUpdateOneRequiredWithoutProgressesNestedInput').implement({
  fields: SkillNodeUpdateOneRequiredWithoutProgressesNestedInputFields,
});

export const NestedStringFilterFields = (t: any) => ({
  equals: t.string({"required":false}),
  in: t.stringList({"required":false}),
  notIn: t.stringList({"required":false}),
  lt: t.string({"required":false}),
  lte: t.string({"required":false}),
  gt: t.string({"required":false}),
  gte: t.string({"required":false}),
  contains: t.string({"required":false}),
  startsWith: t.string({"required":false}),
  endsWith: t.string({"required":false}),
  not: t.field({"required":false,"type":NestedStringFilter}),
});
export const NestedStringFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedStringFilter>, false>('NestedStringFilter').implement({
  fields: NestedStringFilterFields,
});

export const NestedStringNullableFilterFields = (t: any) => ({
  equals: t.string({"required":false}),
  in: t.stringList({"required":false}),
  notIn: t.stringList({"required":false}),
  lt: t.string({"required":false}),
  lte: t.string({"required":false}),
  gt: t.string({"required":false}),
  gte: t.string({"required":false}),
  contains: t.string({"required":false}),
  startsWith: t.string({"required":false}),
  endsWith: t.string({"required":false}),
  not: t.field({"required":false,"type":NestedStringNullableFilter}),
});
export const NestedStringNullableFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedStringNullableFilter>, false>('NestedStringNullableFilter').implement({
  fields: NestedStringNullableFilterFields,
});

export const NestedEnumRoleFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":Role}),
  in: t.field({"required":false,"type":[Role]}),
  notIn: t.field({"required":false,"type":[Role]}),
  not: t.field({"required":false,"type":Role}),
});
export const NestedEnumRoleFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedEnumRoleFilter>, false>('NestedEnumRoleFilter').implement({
  fields: NestedEnumRoleFilterFields,
});

export const NestedDateTimeFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":DateTime}),
  in: t.field({"required":false,"type":[DateTime]}),
  notIn: t.field({"required":false,"type":[DateTime]}),
  lt: t.field({"required":false,"type":DateTime}),
  lte: t.field({"required":false,"type":DateTime}),
  gt: t.field({"required":false,"type":DateTime}),
  gte: t.field({"required":false,"type":DateTime}),
  not: t.field({"required":false,"type":NestedDateTimeFilter}),
});
export const NestedDateTimeFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedDateTimeFilter>, false>('NestedDateTimeFilter').implement({
  fields: NestedDateTimeFilterFields,
});

export const NestedStringWithAggregatesFilterFields = (t: any) => ({
  equals: t.string({"required":false}),
  in: t.stringList({"required":false}),
  notIn: t.stringList({"required":false}),
  lt: t.string({"required":false}),
  lte: t.string({"required":false}),
  gt: t.string({"required":false}),
  gte: t.string({"required":false}),
  contains: t.string({"required":false}),
  startsWith: t.string({"required":false}),
  endsWith: t.string({"required":false}),
  not: t.field({"required":false,"type":NestedStringWithAggregatesFilter}),
  _count: t.field({"required":false,"type":NestedIntFilter}),
  _min: t.field({"required":false,"type":NestedStringFilter}),
  _max: t.field({"required":false,"type":NestedStringFilter}),
});
export const NestedStringWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedStringWithAggregatesFilter>, false>('NestedStringWithAggregatesFilter').implement({
  fields: NestedStringWithAggregatesFilterFields,
});

export const NestedIntFilterFields = (t: any) => ({
  equals: t.int({"required":false}),
  in: t.intList({"required":false}),
  notIn: t.intList({"required":false}),
  lt: t.int({"required":false}),
  lte: t.int({"required":false}),
  gt: t.int({"required":false}),
  gte: t.int({"required":false}),
  not: t.field({"required":false,"type":NestedIntFilter}),
});
export const NestedIntFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedIntFilter>, false>('NestedIntFilter').implement({
  fields: NestedIntFilterFields,
});

export const NestedStringNullableWithAggregatesFilterFields = (t: any) => ({
  equals: t.string({"required":false}),
  in: t.stringList({"required":false}),
  notIn: t.stringList({"required":false}),
  lt: t.string({"required":false}),
  lte: t.string({"required":false}),
  gt: t.string({"required":false}),
  gte: t.string({"required":false}),
  contains: t.string({"required":false}),
  startsWith: t.string({"required":false}),
  endsWith: t.string({"required":false}),
  not: t.field({"required":false,"type":NestedStringNullableWithAggregatesFilter}),
  _count: t.field({"required":false,"type":NestedIntNullableFilter}),
  _min: t.field({"required":false,"type":NestedStringNullableFilter}),
  _max: t.field({"required":false,"type":NestedStringNullableFilter}),
});
export const NestedStringNullableWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedStringNullableWithAggregatesFilter>, false>('NestedStringNullableWithAggregatesFilter').implement({
  fields: NestedStringNullableWithAggregatesFilterFields,
});

export const NestedIntNullableFilterFields = (t: any) => ({
  equals: t.int({"required":false}),
  in: t.intList({"required":false}),
  notIn: t.intList({"required":false}),
  lt: t.int({"required":false}),
  lte: t.int({"required":false}),
  gt: t.int({"required":false}),
  gte: t.int({"required":false}),
  not: t.field({"required":false,"type":NestedIntNullableFilter}),
});
export const NestedIntNullableFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedIntNullableFilter>, false>('NestedIntNullableFilter').implement({
  fields: NestedIntNullableFilterFields,
});

export const NestedEnumRoleWithAggregatesFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":Role}),
  in: t.field({"required":false,"type":[Role]}),
  notIn: t.field({"required":false,"type":[Role]}),
  not: t.field({"required":false,"type":Role}),
  _count: t.field({"required":false,"type":NestedIntFilter}),
  _min: t.field({"required":false,"type":NestedEnumRoleFilter}),
  _max: t.field({"required":false,"type":NestedEnumRoleFilter}),
});
export const NestedEnumRoleWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedEnumRoleWithAggregatesFilter>, false>('NestedEnumRoleWithAggregatesFilter').implement({
  fields: NestedEnumRoleWithAggregatesFilterFields,
});

export const NestedDateTimeWithAggregatesFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":DateTime}),
  in: t.field({"required":false,"type":[DateTime]}),
  notIn: t.field({"required":false,"type":[DateTime]}),
  lt: t.field({"required":false,"type":DateTime}),
  lte: t.field({"required":false,"type":DateTime}),
  gt: t.field({"required":false,"type":DateTime}),
  gte: t.field({"required":false,"type":DateTime}),
  not: t.field({"required":false,"type":NestedDateTimeWithAggregatesFilter}),
  _count: t.field({"required":false,"type":NestedIntFilter}),
  _min: t.field({"required":false,"type":NestedDateTimeFilter}),
  _max: t.field({"required":false,"type":NestedDateTimeFilter}),
});
export const NestedDateTimeWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedDateTimeWithAggregatesFilter>, false>('NestedDateTimeWithAggregatesFilter').implement({
  fields: NestedDateTimeWithAggregatesFilterFields,
});

export const NestedUuidFilterFields = (t: any) => ({
  equals: t.string({"required":false}),
  in: t.stringList({"required":false}),
  notIn: t.stringList({"required":false}),
  lt: t.string({"required":false}),
  lte: t.string({"required":false}),
  gt: t.string({"required":false}),
  gte: t.string({"required":false}),
  not: t.field({"required":false,"type":NestedUuidFilter}),
});
export const NestedUuidFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedUuidFilter>, false>('NestedUuidFilter').implement({
  fields: NestedUuidFilterFields,
});

export const NestedEnumCourseStatusFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":CourseStatus}),
  in: t.field({"required":false,"type":[CourseStatus]}),
  notIn: t.field({"required":false,"type":[CourseStatus]}),
  not: t.field({"required":false,"type":CourseStatus}),
});
export const NestedEnumCourseStatusFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedEnumCourseStatusFilter>, false>('NestedEnumCourseStatusFilter').implement({
  fields: NestedEnumCourseStatusFilterFields,
});

export const NestedDateTimeNullableFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":DateTime}),
  in: t.field({"required":false,"type":[DateTime]}),
  notIn: t.field({"required":false,"type":[DateTime]}),
  lt: t.field({"required":false,"type":DateTime}),
  lte: t.field({"required":false,"type":DateTime}),
  gt: t.field({"required":false,"type":DateTime}),
  gte: t.field({"required":false,"type":DateTime}),
  not: t.field({"required":false,"type":NestedDateTimeNullableFilter}),
});
export const NestedDateTimeNullableFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedDateTimeNullableFilter>, false>('NestedDateTimeNullableFilter').implement({
  fields: NestedDateTimeNullableFilterFields,
});

export const NestedUuidWithAggregatesFilterFields = (t: any) => ({
  equals: t.string({"required":false}),
  in: t.stringList({"required":false}),
  notIn: t.stringList({"required":false}),
  lt: t.string({"required":false}),
  lte: t.string({"required":false}),
  gt: t.string({"required":false}),
  gte: t.string({"required":false}),
  not: t.field({"required":false,"type":NestedUuidWithAggregatesFilter}),
  _count: t.field({"required":false,"type":NestedIntFilter}),
  _min: t.field({"required":false,"type":NestedStringFilter}),
  _max: t.field({"required":false,"type":NestedStringFilter}),
});
export const NestedUuidWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedUuidWithAggregatesFilter>, false>('NestedUuidWithAggregatesFilter').implement({
  fields: NestedUuidWithAggregatesFilterFields,
});

export const NestedEnumCourseStatusWithAggregatesFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":CourseStatus}),
  in: t.field({"required":false,"type":[CourseStatus]}),
  notIn: t.field({"required":false,"type":[CourseStatus]}),
  not: t.field({"required":false,"type":CourseStatus}),
  _count: t.field({"required":false,"type":NestedIntFilter}),
  _min: t.field({"required":false,"type":NestedEnumCourseStatusFilter}),
  _max: t.field({"required":false,"type":NestedEnumCourseStatusFilter}),
});
export const NestedEnumCourseStatusWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedEnumCourseStatusWithAggregatesFilter>, false>('NestedEnumCourseStatusWithAggregatesFilter').implement({
  fields: NestedEnumCourseStatusWithAggregatesFilterFields,
});

export const NestedDateTimeNullableWithAggregatesFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":DateTime}),
  in: t.field({"required":false,"type":[DateTime]}),
  notIn: t.field({"required":false,"type":[DateTime]}),
  lt: t.field({"required":false,"type":DateTime}),
  lte: t.field({"required":false,"type":DateTime}),
  gt: t.field({"required":false,"type":DateTime}),
  gte: t.field({"required":false,"type":DateTime}),
  not: t.field({"required":false,"type":NestedDateTimeNullableWithAggregatesFilter}),
  _count: t.field({"required":false,"type":NestedIntNullableFilter}),
  _min: t.field({"required":false,"type":NestedDateTimeNullableFilter}),
  _max: t.field({"required":false,"type":NestedDateTimeNullableFilter}),
});
export const NestedDateTimeNullableWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedDateTimeNullableWithAggregatesFilter>, false>('NestedDateTimeNullableWithAggregatesFilter').implement({
  fields: NestedDateTimeNullableWithAggregatesFilterFields,
});

export const NestedIntWithAggregatesFilterFields = (t: any) => ({
  equals: t.int({"required":false}),
  in: t.intList({"required":false}),
  notIn: t.intList({"required":false}),
  lt: t.int({"required":false}),
  lte: t.int({"required":false}),
  gt: t.int({"required":false}),
  gte: t.int({"required":false}),
  not: t.field({"required":false,"type":NestedIntWithAggregatesFilter}),
  _count: t.field({"required":false,"type":NestedIntFilter}),
  _avg: t.field({"required":false,"type":NestedFloatFilter}),
  _sum: t.field({"required":false,"type":NestedIntFilter}),
  _min: t.field({"required":false,"type":NestedIntFilter}),
  _max: t.field({"required":false,"type":NestedIntFilter}),
});
export const NestedIntWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedIntWithAggregatesFilter>, false>('NestedIntWithAggregatesFilter').implement({
  fields: NestedIntWithAggregatesFilterFields,
});

export const NestedFloatFilterFields = (t: any) => ({
  equals: t.float({"required":false}),
  in: t.floatList({"required":false}),
  notIn: t.floatList({"required":false}),
  lt: t.float({"required":false}),
  lte: t.float({"required":false}),
  gt: t.float({"required":false}),
  gte: t.float({"required":false}),
  not: t.field({"required":false,"type":NestedFloatFilter}),
});
export const NestedFloatFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedFloatFilter>, false>('NestedFloatFilter').implement({
  fields: NestedFloatFilterFields,
});

export const NestedIntNullableWithAggregatesFilterFields = (t: any) => ({
  equals: t.int({"required":false}),
  in: t.intList({"required":false}),
  notIn: t.intList({"required":false}),
  lt: t.int({"required":false}),
  lte: t.int({"required":false}),
  gt: t.int({"required":false}),
  gte: t.int({"required":false}),
  not: t.field({"required":false,"type":NestedIntNullableWithAggregatesFilter}),
  _count: t.field({"required":false,"type":NestedIntNullableFilter}),
  _avg: t.field({"required":false,"type":NestedFloatNullableFilter}),
  _sum: t.field({"required":false,"type":NestedIntNullableFilter}),
  _min: t.field({"required":false,"type":NestedIntNullableFilter}),
  _max: t.field({"required":false,"type":NestedIntNullableFilter}),
});
export const NestedIntNullableWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedIntNullableWithAggregatesFilter>, false>('NestedIntNullableWithAggregatesFilter').implement({
  fields: NestedIntNullableWithAggregatesFilterFields,
});

export const NestedFloatNullableFilterFields = (t: any) => ({
  equals: t.float({"required":false}),
  in: t.floatList({"required":false}),
  notIn: t.floatList({"required":false}),
  lt: t.float({"required":false}),
  lte: t.float({"required":false}),
  gt: t.float({"required":false}),
  gte: t.float({"required":false}),
  not: t.field({"required":false,"type":NestedFloatNullableFilter}),
});
export const NestedFloatNullableFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedFloatNullableFilter>, false>('NestedFloatNullableFilter').implement({
  fields: NestedFloatNullableFilterFields,
});

export const NestedEnumContentTypeFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":ContentType}),
  in: t.field({"required":false,"type":[ContentType]}),
  notIn: t.field({"required":false,"type":[ContentType]}),
  not: t.field({"required":false,"type":ContentType}),
});
export const NestedEnumContentTypeFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedEnumContentTypeFilter>, false>('NestedEnumContentTypeFilter').implement({
  fields: NestedEnumContentTypeFilterFields,
});

export const NestedEnumLessonStatusFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":LessonStatus}),
  in: t.field({"required":false,"type":[LessonStatus]}),
  notIn: t.field({"required":false,"type":[LessonStatus]}),
  not: t.field({"required":false,"type":LessonStatus}),
});
export const NestedEnumLessonStatusFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedEnumLessonStatusFilter>, false>('NestedEnumLessonStatusFilter').implement({
  fields: NestedEnumLessonStatusFilterFields,
});

export const NestedEnumContentTypeWithAggregatesFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":ContentType}),
  in: t.field({"required":false,"type":[ContentType]}),
  notIn: t.field({"required":false,"type":[ContentType]}),
  not: t.field({"required":false,"type":ContentType}),
  _count: t.field({"required":false,"type":NestedIntFilter}),
  _min: t.field({"required":false,"type":NestedEnumContentTypeFilter}),
  _max: t.field({"required":false,"type":NestedEnumContentTypeFilter}),
});
export const NestedEnumContentTypeWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedEnumContentTypeWithAggregatesFilter>, false>('NestedEnumContentTypeWithAggregatesFilter').implement({
  fields: NestedEnumContentTypeWithAggregatesFilterFields,
});

export const NestedJsonNullableFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":Json}),
  path: t.stringList({"required":false}),
  mode: t.field({"required":false,"type":QueryMode}),
  string_contains: t.string({"required":false}),
  string_starts_with: t.string({"required":false}),
  string_ends_with: t.string({"required":false}),
  array_starts_with: t.field({"required":false,"type":Json}),
  array_ends_with: t.field({"required":false,"type":Json}),
  array_contains: t.field({"required":false,"type":Json}),
  lt: t.field({"required":false,"type":Json}),
  lte: t.field({"required":false,"type":Json}),
  gt: t.field({"required":false,"type":Json}),
  gte: t.field({"required":false,"type":Json}),
  not: t.field({"required":false,"type":Json}),
});
export const NestedJsonNullableFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedJsonNullableFilter>, false>('NestedJsonNullableFilter').implement({
  fields: NestedJsonNullableFilterFields,
});

export const NestedEnumLessonStatusWithAggregatesFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":LessonStatus}),
  in: t.field({"required":false,"type":[LessonStatus]}),
  notIn: t.field({"required":false,"type":[LessonStatus]}),
  not: t.field({"required":false,"type":LessonStatus}),
  _count: t.field({"required":false,"type":NestedIntFilter}),
  _min: t.field({"required":false,"type":NestedEnumLessonStatusFilter}),
  _max: t.field({"required":false,"type":NestedEnumLessonStatusFilter}),
});
export const NestedEnumLessonStatusWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedEnumLessonStatusWithAggregatesFilter>, false>('NestedEnumLessonStatusWithAggregatesFilter').implement({
  fields: NestedEnumLessonStatusWithAggregatesFilterFields,
});

export const NestedBoolFilterFields = (t: any) => ({
  equals: t.boolean({"required":false}),
  not: t.field({"required":false,"type":NestedBoolFilter}),
});
export const NestedBoolFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedBoolFilter>, false>('NestedBoolFilter').implement({
  fields: NestedBoolFilterFields,
});

export const NestedBoolWithAggregatesFilterFields = (t: any) => ({
  equals: t.boolean({"required":false}),
  not: t.field({"required":false,"type":NestedBoolWithAggregatesFilter}),
  _count: t.field({"required":false,"type":NestedIntFilter}),
  _min: t.field({"required":false,"type":NestedBoolFilter}),
  _max: t.field({"required":false,"type":NestedBoolFilter}),
});
export const NestedBoolWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedBoolWithAggregatesFilter>, false>('NestedBoolWithAggregatesFilter').implement({
  fields: NestedBoolWithAggregatesFilterFields,
});

export const NestedEnumQuestionTypeFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":QuestionType}),
  in: t.field({"required":false,"type":[QuestionType]}),
  notIn: t.field({"required":false,"type":[QuestionType]}),
  not: t.field({"required":false,"type":QuestionType}),
});
export const NestedEnumQuestionTypeFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedEnumQuestionTypeFilter>, false>('NestedEnumQuestionTypeFilter').implement({
  fields: NestedEnumQuestionTypeFilterFields,
});

export const NestedEnumQuestionTypeWithAggregatesFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":QuestionType}),
  in: t.field({"required":false,"type":[QuestionType]}),
  notIn: t.field({"required":false,"type":[QuestionType]}),
  not: t.field({"required":false,"type":QuestionType}),
  _count: t.field({"required":false,"type":NestedIntFilter}),
  _min: t.field({"required":false,"type":NestedEnumQuestionTypeFilter}),
  _max: t.field({"required":false,"type":NestedEnumQuestionTypeFilter}),
});
export const NestedEnumQuestionTypeWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedEnumQuestionTypeWithAggregatesFilter>, false>('NestedEnumQuestionTypeWithAggregatesFilter').implement({
  fields: NestedEnumQuestionTypeWithAggregatesFilterFields,
});

export const NestedBoolNullableFilterFields = (t: any) => ({
  equals: t.boolean({"required":false}),
  not: t.field({"required":false,"type":NestedBoolNullableFilter}),
});
export const NestedBoolNullableFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedBoolNullableFilter>, false>('NestedBoolNullableFilter').implement({
  fields: NestedBoolNullableFilterFields,
});

export const NestedBoolNullableWithAggregatesFilterFields = (t: any) => ({
  equals: t.boolean({"required":false}),
  not: t.field({"required":false,"type":NestedBoolNullableWithAggregatesFilter}),
  _count: t.field({"required":false,"type":NestedIntNullableFilter}),
  _min: t.field({"required":false,"type":NestedBoolNullableFilter}),
  _max: t.field({"required":false,"type":NestedBoolNullableFilter}),
});
export const NestedBoolNullableWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedBoolNullableWithAggregatesFilter>, false>('NestedBoolNullableWithAggregatesFilter').implement({
  fields: NestedBoolNullableWithAggregatesFilterFields,
});

export const NestedEnumProgressStatusFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":ProgressStatus}),
  in: t.field({"required":false,"type":[ProgressStatus]}),
  notIn: t.field({"required":false,"type":[ProgressStatus]}),
  not: t.field({"required":false,"type":ProgressStatus}),
});
export const NestedEnumProgressStatusFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedEnumProgressStatusFilter>, false>('NestedEnumProgressStatusFilter').implement({
  fields: NestedEnumProgressStatusFilterFields,
});

export const NestedEnumProgressStatusWithAggregatesFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":ProgressStatus}),
  in: t.field({"required":false,"type":[ProgressStatus]}),
  notIn: t.field({"required":false,"type":[ProgressStatus]}),
  not: t.field({"required":false,"type":ProgressStatus}),
  _count: t.field({"required":false,"type":NestedIntFilter}),
  _min: t.field({"required":false,"type":NestedEnumProgressStatusFilter}),
  _max: t.field({"required":false,"type":NestedEnumProgressStatusFilter}),
});
export const NestedEnumProgressStatusWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedEnumProgressStatusWithAggregatesFilter>, false>('NestedEnumProgressStatusWithAggregatesFilter').implement({
  fields: NestedEnumProgressStatusWithAggregatesFilterFields,
});

export const CourseCreateWithoutAuthorInputFields = (t: any) => ({
  id: t.string({"required":false}),
  title: t.string({"required":true}),
  description: t.string({"required":false}),
  status: t.field({"required":false,"type":CourseStatus}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  deletedAt: t.field({"required":false,"type":DateTime}),
  trees: t.field({"required":false,"type":SkillTreeCreateNestedManyWithoutCourseInput}),
});
export const CourseCreateWithoutAuthorInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CourseCreateWithoutAuthorInput>, false>('CourseCreateWithoutAuthorInput').implement({
  fields: CourseCreateWithoutAuthorInputFields,
});

export const CourseCreateOrConnectWithoutAuthorInputFields = (t: any) => ({
  where: t.field({"required":true,"type":CourseWhereUniqueInput}),
  create: t.field({"required":true,"type":CourseCreateWithoutAuthorInput}),
});
export const CourseCreateOrConnectWithoutAuthorInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CourseCreateOrConnectWithoutAuthorInput>, false>('CourseCreateOrConnectWithoutAuthorInput').implement({
  fields: CourseCreateOrConnectWithoutAuthorInputFields,
});

export const CourseCreateManyAuthorInputEnvelopeFields = (t: any) => ({
  data: t.field({"required":true,"type":[CourseCreateManyAuthorInput]}),
  skipDuplicates: t.boolean({"required":false}),
});
export const CourseCreateManyAuthorInputEnvelope = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CourseCreateManyAuthorInputEnvelope>, false>('CourseCreateManyAuthorInputEnvelope').implement({
  fields: CourseCreateManyAuthorInputEnvelopeFields,
});

export const UserNodeProgressCreateWithoutUserInputFields = (t: any) => ({
  id: t.string({"required":false}),
  status: t.field({"required":false,"type":ProgressStatus}),
  completedAt: t.field({"required":false,"type":DateTime}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  node: t.field({"required":true,"type":SkillNodeCreateNestedOneWithoutProgressesInput}),
});
export const UserNodeProgressCreateWithoutUserInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserNodeProgressCreateWithoutUserInput>, false>('UserNodeProgressCreateWithoutUserInput').implement({
  fields: UserNodeProgressCreateWithoutUserInputFields,
});

export const UserNodeProgressCreateOrConnectWithoutUserInputFields = (t: any) => ({
  where: t.field({"required":true,"type":UserNodeProgressWhereUniqueInput}),
  create: t.field({"required":true,"type":UserNodeProgressCreateWithoutUserInput}),
});
export const UserNodeProgressCreateOrConnectWithoutUserInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserNodeProgressCreateOrConnectWithoutUserInput>, false>('UserNodeProgressCreateOrConnectWithoutUserInput').implement({
  fields: UserNodeProgressCreateOrConnectWithoutUserInputFields,
});

export const UserNodeProgressCreateManyUserInputEnvelopeFields = (t: any) => ({
  data: t.field({"required":true,"type":[UserNodeProgressCreateManyUserInput]}),
  skipDuplicates: t.boolean({"required":false}),
});
export const UserNodeProgressCreateManyUserInputEnvelope = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserNodeProgressCreateManyUserInputEnvelope>, false>('UserNodeProgressCreateManyUserInputEnvelope').implement({
  fields: UserNodeProgressCreateManyUserInputEnvelopeFields,
});

export const QuizAttemptCreateWithoutUserInputFields = (t: any) => ({
  id: t.string({"required":false}),
  passed: t.boolean({"required":true}),
  takenAt: t.field({"required":false,"type":DateTime}),
  quiz: t.field({"required":true,"type":QuizCreateNestedOneWithoutAttemptsInput}),
  answers: t.field({"required":false,"type":QuizAttemptAnswerCreateNestedManyWithoutAttemptInput}),
});
export const QuizAttemptCreateWithoutUserInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptCreateWithoutUserInput>, false>('QuizAttemptCreateWithoutUserInput').implement({
  fields: QuizAttemptCreateWithoutUserInputFields,
});

export const QuizAttemptCreateOrConnectWithoutUserInputFields = (t: any) => ({
  where: t.field({"required":true,"type":QuizAttemptWhereUniqueInput}),
  create: t.field({"required":true,"type":QuizAttemptCreateWithoutUserInput}),
});
export const QuizAttemptCreateOrConnectWithoutUserInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptCreateOrConnectWithoutUserInput>, false>('QuizAttemptCreateOrConnectWithoutUserInput').implement({
  fields: QuizAttemptCreateOrConnectWithoutUserInputFields,
});

export const QuizAttemptCreateManyUserInputEnvelopeFields = (t: any) => ({
  data: t.field({"required":true,"type":[QuizAttemptCreateManyUserInput]}),
  skipDuplicates: t.boolean({"required":false}),
});
export const QuizAttemptCreateManyUserInputEnvelope = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptCreateManyUserInputEnvelope>, false>('QuizAttemptCreateManyUserInputEnvelope').implement({
  fields: QuizAttemptCreateManyUserInputEnvelopeFields,
});

export const CourseUpsertWithWhereUniqueWithoutAuthorInputFields = (t: any) => ({
  where: t.field({"required":true,"type":CourseWhereUniqueInput}),
  update: t.field({"required":true,"type":CourseUpdateWithoutAuthorInput}),
  create: t.field({"required":true,"type":CourseCreateWithoutAuthorInput}),
});
export const CourseUpsertWithWhereUniqueWithoutAuthorInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CourseUpsertWithWhereUniqueWithoutAuthorInput>, false>('CourseUpsertWithWhereUniqueWithoutAuthorInput').implement({
  fields: CourseUpsertWithWhereUniqueWithoutAuthorInputFields,
});

export const CourseUpdateWithWhereUniqueWithoutAuthorInputFields = (t: any) => ({
  where: t.field({"required":true,"type":CourseWhereUniqueInput}),
  data: t.field({"required":true,"type":CourseUpdateWithoutAuthorInput}),
});
export const CourseUpdateWithWhereUniqueWithoutAuthorInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CourseUpdateWithWhereUniqueWithoutAuthorInput>, false>('CourseUpdateWithWhereUniqueWithoutAuthorInput').implement({
  fields: CourseUpdateWithWhereUniqueWithoutAuthorInputFields,
});

export const CourseUpdateManyWithWhereWithoutAuthorInputFields = (t: any) => ({
  where: t.field({"required":true,"type":CourseScalarWhereInput}),
  data: t.field({"required":true,"type":CourseUpdateManyMutationInput}),
});
export const CourseUpdateManyWithWhereWithoutAuthorInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CourseUpdateManyWithWhereWithoutAuthorInput>, false>('CourseUpdateManyWithWhereWithoutAuthorInput').implement({
  fields: CourseUpdateManyWithWhereWithoutAuthorInputFields,
});

export const CourseScalarWhereInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[CourseScalarWhereInput]}),
  OR: t.field({"required":false,"type":[CourseScalarWhereInput]}),
  NOT: t.field({"required":false,"type":[CourseScalarWhereInput]}),
  id: t.field({"required":false,"type":UuidFilter}),
  title: t.field({"required":false,"type":StringFilter}),
  description: t.field({"required":false,"type":StringNullableFilter}),
  authorId: t.field({"required":false,"type":StringFilter}),
  status: t.field({"required":false,"type":EnumCourseStatusFilter}),
  createdAt: t.field({"required":false,"type":DateTimeFilter}),
  updatedAt: t.field({"required":false,"type":DateTimeFilter}),
  deletedAt: t.field({"required":false,"type":DateTimeNullableFilter}),
});
export const CourseScalarWhereInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CourseScalarWhereInput>, false>('CourseScalarWhereInput').implement({
  fields: CourseScalarWhereInputFields,
});

export const UserNodeProgressUpsertWithWhereUniqueWithoutUserInputFields = (t: any) => ({
  where: t.field({"required":true,"type":UserNodeProgressWhereUniqueInput}),
  update: t.field({"required":true,"type":UserNodeProgressUpdateWithoutUserInput}),
  create: t.field({"required":true,"type":UserNodeProgressCreateWithoutUserInput}),
});
export const UserNodeProgressUpsertWithWhereUniqueWithoutUserInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserNodeProgressUpsertWithWhereUniqueWithoutUserInput>, false>('UserNodeProgressUpsertWithWhereUniqueWithoutUserInput').implement({
  fields: UserNodeProgressUpsertWithWhereUniqueWithoutUserInputFields,
});

export const UserNodeProgressUpdateWithWhereUniqueWithoutUserInputFields = (t: any) => ({
  where: t.field({"required":true,"type":UserNodeProgressWhereUniqueInput}),
  data: t.field({"required":true,"type":UserNodeProgressUpdateWithoutUserInput}),
});
export const UserNodeProgressUpdateWithWhereUniqueWithoutUserInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserNodeProgressUpdateWithWhereUniqueWithoutUserInput>, false>('UserNodeProgressUpdateWithWhereUniqueWithoutUserInput').implement({
  fields: UserNodeProgressUpdateWithWhereUniqueWithoutUserInputFields,
});

export const UserNodeProgressUpdateManyWithWhereWithoutUserInputFields = (t: any) => ({
  where: t.field({"required":true,"type":UserNodeProgressScalarWhereInput}),
  data: t.field({"required":true,"type":UserNodeProgressUpdateManyMutationInput}),
});
export const UserNodeProgressUpdateManyWithWhereWithoutUserInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserNodeProgressUpdateManyWithWhereWithoutUserInput>, false>('UserNodeProgressUpdateManyWithWhereWithoutUserInput').implement({
  fields: UserNodeProgressUpdateManyWithWhereWithoutUserInputFields,
});

export const UserNodeProgressScalarWhereInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[UserNodeProgressScalarWhereInput]}),
  OR: t.field({"required":false,"type":[UserNodeProgressScalarWhereInput]}),
  NOT: t.field({"required":false,"type":[UserNodeProgressScalarWhereInput]}),
  id: t.field({"required":false,"type":UuidFilter}),
  userId: t.field({"required":false,"type":StringFilter}),
  nodeId: t.field({"required":false,"type":UuidFilter}),
  status: t.field({"required":false,"type":EnumProgressStatusFilter}),
  completedAt: t.field({"required":false,"type":DateTimeNullableFilter}),
  createdAt: t.field({"required":false,"type":DateTimeFilter}),
  updatedAt: t.field({"required":false,"type":DateTimeFilter}),
});
export const UserNodeProgressScalarWhereInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserNodeProgressScalarWhereInput>, false>('UserNodeProgressScalarWhereInput').implement({
  fields: UserNodeProgressScalarWhereInputFields,
});

export const QuizAttemptUpsertWithWhereUniqueWithoutUserInputFields = (t: any) => ({
  where: t.field({"required":true,"type":QuizAttemptWhereUniqueInput}),
  update: t.field({"required":true,"type":QuizAttemptUpdateWithoutUserInput}),
  create: t.field({"required":true,"type":QuizAttemptCreateWithoutUserInput}),
});
export const QuizAttemptUpsertWithWhereUniqueWithoutUserInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptUpsertWithWhereUniqueWithoutUserInput>, false>('QuizAttemptUpsertWithWhereUniqueWithoutUserInput').implement({
  fields: QuizAttemptUpsertWithWhereUniqueWithoutUserInputFields,
});

export const QuizAttemptUpdateWithWhereUniqueWithoutUserInputFields = (t: any) => ({
  where: t.field({"required":true,"type":QuizAttemptWhereUniqueInput}),
  data: t.field({"required":true,"type":QuizAttemptUpdateWithoutUserInput}),
});
export const QuizAttemptUpdateWithWhereUniqueWithoutUserInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptUpdateWithWhereUniqueWithoutUserInput>, false>('QuizAttemptUpdateWithWhereUniqueWithoutUserInput').implement({
  fields: QuizAttemptUpdateWithWhereUniqueWithoutUserInputFields,
});

export const QuizAttemptUpdateManyWithWhereWithoutUserInputFields = (t: any) => ({
  where: t.field({"required":true,"type":QuizAttemptScalarWhereInput}),
  data: t.field({"required":true,"type":QuizAttemptUpdateManyMutationInput}),
});
export const QuizAttemptUpdateManyWithWhereWithoutUserInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptUpdateManyWithWhereWithoutUserInput>, false>('QuizAttemptUpdateManyWithWhereWithoutUserInput').implement({
  fields: QuizAttemptUpdateManyWithWhereWithoutUserInputFields,
});

export const QuizAttemptScalarWhereInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[QuizAttemptScalarWhereInput]}),
  OR: t.field({"required":false,"type":[QuizAttemptScalarWhereInput]}),
  NOT: t.field({"required":false,"type":[QuizAttemptScalarWhereInput]}),
  id: t.field({"required":false,"type":UuidFilter}),
  quizId: t.field({"required":false,"type":UuidFilter}),
  userId: t.field({"required":false,"type":StringFilter}),
  passed: t.field({"required":false,"type":BoolFilter}),
  takenAt: t.field({"required":false,"type":DateTimeFilter}),
});
export const QuizAttemptScalarWhereInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptScalarWhereInput>, false>('QuizAttemptScalarWhereInput').implement({
  fields: QuizAttemptScalarWhereInputFields,
});

export const UserCreateWithoutCoursesAuthoredInputFields = (t: any) => ({
  id: t.string({"required":true}),
  email: t.string({"required":true}),
  name: t.string({"required":false}),
  photoUrl: t.string({"required":false}),
  role: t.field({"required":false,"type":Role}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  nodeProgress: t.field({"required":false,"type":UserNodeProgressCreateNestedManyWithoutUserInput}),
  quizAttempts: t.field({"required":false,"type":QuizAttemptCreateNestedManyWithoutUserInput}),
});
export const UserCreateWithoutCoursesAuthoredInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserCreateWithoutCoursesAuthoredInput>, false>('UserCreateWithoutCoursesAuthoredInput').implement({
  fields: UserCreateWithoutCoursesAuthoredInputFields,
});

export const UserCreateOrConnectWithoutCoursesAuthoredInputFields = (t: any) => ({
  where: t.field({"required":true,"type":UserWhereUniqueInput}),
  create: t.field({"required":true,"type":UserCreateWithoutCoursesAuthoredInput}),
});
export const UserCreateOrConnectWithoutCoursesAuthoredInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserCreateOrConnectWithoutCoursesAuthoredInput>, false>('UserCreateOrConnectWithoutCoursesAuthoredInput').implement({
  fields: UserCreateOrConnectWithoutCoursesAuthoredInputFields,
});

export const SkillTreeCreateWithoutCourseInputFields = (t: any) => ({
  id: t.string({"required":false}),
  title: t.string({"required":true}),
  description: t.string({"required":false}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  deletedAt: t.field({"required":false,"type":DateTime}),
  nodes: t.field({"required":false,"type":SkillNodeCreateNestedManyWithoutTreeInput}),
});
export const SkillTreeCreateWithoutCourseInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillTreeCreateWithoutCourseInput>, false>('SkillTreeCreateWithoutCourseInput').implement({
  fields: SkillTreeCreateWithoutCourseInputFields,
});

export const SkillTreeCreateOrConnectWithoutCourseInputFields = (t: any) => ({
  where: t.field({"required":true,"type":SkillTreeWhereUniqueInput}),
  create: t.field({"required":true,"type":SkillTreeCreateWithoutCourseInput}),
});
export const SkillTreeCreateOrConnectWithoutCourseInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillTreeCreateOrConnectWithoutCourseInput>, false>('SkillTreeCreateOrConnectWithoutCourseInput').implement({
  fields: SkillTreeCreateOrConnectWithoutCourseInputFields,
});

export const SkillTreeCreateManyCourseInputEnvelopeFields = (t: any) => ({
  data: t.field({"required":true,"type":[SkillTreeCreateManyCourseInput]}),
  skipDuplicates: t.boolean({"required":false}),
});
export const SkillTreeCreateManyCourseInputEnvelope = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillTreeCreateManyCourseInputEnvelope>, false>('SkillTreeCreateManyCourseInputEnvelope').implement({
  fields: SkillTreeCreateManyCourseInputEnvelopeFields,
});

export const UserUpsertWithoutCoursesAuthoredInputFields = (t: any) => ({
  update: t.field({"required":true,"type":UserUpdateWithoutCoursesAuthoredInput}),
  create: t.field({"required":true,"type":UserCreateWithoutCoursesAuthoredInput}),
  where: t.field({"required":false,"type":UserWhereInput}),
});
export const UserUpsertWithoutCoursesAuthoredInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserUpsertWithoutCoursesAuthoredInput>, false>('UserUpsertWithoutCoursesAuthoredInput').implement({
  fields: UserUpsertWithoutCoursesAuthoredInputFields,
});

export const UserUpdateToOneWithWhereWithoutCoursesAuthoredInputFields = (t: any) => ({
  where: t.field({"required":false,"type":UserWhereInput}),
  data: t.field({"required":true,"type":UserUpdateWithoutCoursesAuthoredInput}),
});
export const UserUpdateToOneWithWhereWithoutCoursesAuthoredInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserUpdateToOneWithWhereWithoutCoursesAuthoredInput>, false>('UserUpdateToOneWithWhereWithoutCoursesAuthoredInput').implement({
  fields: UserUpdateToOneWithWhereWithoutCoursesAuthoredInputFields,
});

export const UserUpdateWithoutCoursesAuthoredInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  email: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  name: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  photoUrl: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  role: t.field({"required":false,"type":EnumRoleFieldUpdateOperationsInput}),
  createdAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updatedAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  nodeProgress: t.field({"required":false,"type":UserNodeProgressUpdateManyWithoutUserNestedInput}),
  quizAttempts: t.field({"required":false,"type":QuizAttemptUpdateManyWithoutUserNestedInput}),
});
export const UserUpdateWithoutCoursesAuthoredInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserUpdateWithoutCoursesAuthoredInput>, false>('UserUpdateWithoutCoursesAuthoredInput').implement({
  fields: UserUpdateWithoutCoursesAuthoredInputFields,
});

export const SkillTreeUpsertWithWhereUniqueWithoutCourseInputFields = (t: any) => ({
  where: t.field({"required":true,"type":SkillTreeWhereUniqueInput}),
  update: t.field({"required":true,"type":SkillTreeUpdateWithoutCourseInput}),
  create: t.field({"required":true,"type":SkillTreeCreateWithoutCourseInput}),
});
export const SkillTreeUpsertWithWhereUniqueWithoutCourseInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillTreeUpsertWithWhereUniqueWithoutCourseInput>, false>('SkillTreeUpsertWithWhereUniqueWithoutCourseInput').implement({
  fields: SkillTreeUpsertWithWhereUniqueWithoutCourseInputFields,
});

export const SkillTreeUpdateWithWhereUniqueWithoutCourseInputFields = (t: any) => ({
  where: t.field({"required":true,"type":SkillTreeWhereUniqueInput}),
  data: t.field({"required":true,"type":SkillTreeUpdateWithoutCourseInput}),
});
export const SkillTreeUpdateWithWhereUniqueWithoutCourseInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillTreeUpdateWithWhereUniqueWithoutCourseInput>, false>('SkillTreeUpdateWithWhereUniqueWithoutCourseInput').implement({
  fields: SkillTreeUpdateWithWhereUniqueWithoutCourseInputFields,
});

export const SkillTreeUpdateManyWithWhereWithoutCourseInputFields = (t: any) => ({
  where: t.field({"required":true,"type":SkillTreeScalarWhereInput}),
  data: t.field({"required":true,"type":SkillTreeUpdateManyMutationInput}),
});
export const SkillTreeUpdateManyWithWhereWithoutCourseInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillTreeUpdateManyWithWhereWithoutCourseInput>, false>('SkillTreeUpdateManyWithWhereWithoutCourseInput').implement({
  fields: SkillTreeUpdateManyWithWhereWithoutCourseInputFields,
});

export const SkillTreeScalarWhereInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[SkillTreeScalarWhereInput]}),
  OR: t.field({"required":false,"type":[SkillTreeScalarWhereInput]}),
  NOT: t.field({"required":false,"type":[SkillTreeScalarWhereInput]}),
  id: t.field({"required":false,"type":UuidFilter}),
  courseId: t.field({"required":false,"type":UuidFilter}),
  title: t.field({"required":false,"type":StringFilter}),
  description: t.field({"required":false,"type":StringNullableFilter}),
  createdAt: t.field({"required":false,"type":DateTimeFilter}),
  updatedAt: t.field({"required":false,"type":DateTimeFilter}),
  deletedAt: t.field({"required":false,"type":DateTimeNullableFilter}),
});
export const SkillTreeScalarWhereInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillTreeScalarWhereInput>, false>('SkillTreeScalarWhereInput').implement({
  fields: SkillTreeScalarWhereInputFields,
});

export const CourseCreateWithoutTreesInputFields = (t: any) => ({
  id: t.string({"required":false}),
  title: t.string({"required":true}),
  description: t.string({"required":false}),
  status: t.field({"required":false,"type":CourseStatus}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  deletedAt: t.field({"required":false,"type":DateTime}),
  author: t.field({"required":true,"type":UserCreateNestedOneWithoutCoursesAuthoredInput}),
});
export const CourseCreateWithoutTreesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CourseCreateWithoutTreesInput>, false>('CourseCreateWithoutTreesInput').implement({
  fields: CourseCreateWithoutTreesInputFields,
});

export const CourseCreateOrConnectWithoutTreesInputFields = (t: any) => ({
  where: t.field({"required":true,"type":CourseWhereUniqueInput}),
  create: t.field({"required":true,"type":CourseCreateWithoutTreesInput}),
});
export const CourseCreateOrConnectWithoutTreesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CourseCreateOrConnectWithoutTreesInput>, false>('CourseCreateOrConnectWithoutTreesInput').implement({
  fields: CourseCreateOrConnectWithoutTreesInputFields,
});

export const SkillNodeCreateWithoutTreeInputFields = (t: any) => ({
  id: t.string({"required":false}),
  title: t.string({"required":true}),
  step: t.int({"required":false}),
  orderInStep: t.int({"required":false}),
  posX: t.int({"required":false}),
  posY: t.int({"required":false}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  deletedAt: t.field({"required":false,"type":DateTime}),
  lessons: t.field({"required":false,"type":LessonBlocksCreateNestedManyWithoutNodeInput}),
  quiz: t.field({"required":false,"type":QuizCreateNestedOneWithoutNodeInput}),
  prerequisites: t.field({"required":false,"type":SkillNodePrerequisiteCreateNestedManyWithoutNodeInput}),
  requiredFor: t.field({"required":false,"type":SkillNodePrerequisiteCreateNestedManyWithoutDependsOnInput}),
  progresses: t.field({"required":false,"type":UserNodeProgressCreateNestedManyWithoutNodeInput}),
});
export const SkillNodeCreateWithoutTreeInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeCreateWithoutTreeInput>, false>('SkillNodeCreateWithoutTreeInput').implement({
  fields: SkillNodeCreateWithoutTreeInputFields,
});

export const SkillNodeCreateOrConnectWithoutTreeInputFields = (t: any) => ({
  where: t.field({"required":true,"type":SkillNodeWhereUniqueInput}),
  create: t.field({"required":true,"type":SkillNodeCreateWithoutTreeInput}),
});
export const SkillNodeCreateOrConnectWithoutTreeInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeCreateOrConnectWithoutTreeInput>, false>('SkillNodeCreateOrConnectWithoutTreeInput').implement({
  fields: SkillNodeCreateOrConnectWithoutTreeInputFields,
});

export const SkillNodeCreateManyTreeInputEnvelopeFields = (t: any) => ({
  data: t.field({"required":true,"type":[SkillNodeCreateManyTreeInput]}),
  skipDuplicates: t.boolean({"required":false}),
});
export const SkillNodeCreateManyTreeInputEnvelope = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeCreateManyTreeInputEnvelope>, false>('SkillNodeCreateManyTreeInputEnvelope').implement({
  fields: SkillNodeCreateManyTreeInputEnvelopeFields,
});

export const CourseUpsertWithoutTreesInputFields = (t: any) => ({
  update: t.field({"required":true,"type":CourseUpdateWithoutTreesInput}),
  create: t.field({"required":true,"type":CourseCreateWithoutTreesInput}),
  where: t.field({"required":false,"type":CourseWhereInput}),
});
export const CourseUpsertWithoutTreesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CourseUpsertWithoutTreesInput>, false>('CourseUpsertWithoutTreesInput').implement({
  fields: CourseUpsertWithoutTreesInputFields,
});

export const CourseUpdateToOneWithWhereWithoutTreesInputFields = (t: any) => ({
  where: t.field({"required":false,"type":CourseWhereInput}),
  data: t.field({"required":true,"type":CourseUpdateWithoutTreesInput}),
});
export const CourseUpdateToOneWithWhereWithoutTreesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CourseUpdateToOneWithWhereWithoutTreesInput>, false>('CourseUpdateToOneWithWhereWithoutTreesInput').implement({
  fields: CourseUpdateToOneWithWhereWithoutTreesInputFields,
});

export const CourseUpdateWithoutTreesInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  title: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  description: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  status: t.field({"required":false,"type":EnumCourseStatusFieldUpdateOperationsInput}),
  createdAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updatedAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  deletedAt: t.field({"required":false,"type":NullableDateTimeFieldUpdateOperationsInput}),
  author: t.field({"required":false,"type":UserUpdateOneRequiredWithoutCoursesAuthoredNestedInput}),
});
export const CourseUpdateWithoutTreesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CourseUpdateWithoutTreesInput>, false>('CourseUpdateWithoutTreesInput').implement({
  fields: CourseUpdateWithoutTreesInputFields,
});

export const SkillNodeUpsertWithWhereUniqueWithoutTreeInputFields = (t: any) => ({
  where: t.field({"required":true,"type":SkillNodeWhereUniqueInput}),
  update: t.field({"required":true,"type":SkillNodeUpdateWithoutTreeInput}),
  create: t.field({"required":true,"type":SkillNodeCreateWithoutTreeInput}),
});
export const SkillNodeUpsertWithWhereUniqueWithoutTreeInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeUpsertWithWhereUniqueWithoutTreeInput>, false>('SkillNodeUpsertWithWhereUniqueWithoutTreeInput').implement({
  fields: SkillNodeUpsertWithWhereUniqueWithoutTreeInputFields,
});

export const SkillNodeUpdateWithWhereUniqueWithoutTreeInputFields = (t: any) => ({
  where: t.field({"required":true,"type":SkillNodeWhereUniqueInput}),
  data: t.field({"required":true,"type":SkillNodeUpdateWithoutTreeInput}),
});
export const SkillNodeUpdateWithWhereUniqueWithoutTreeInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeUpdateWithWhereUniqueWithoutTreeInput>, false>('SkillNodeUpdateWithWhereUniqueWithoutTreeInput').implement({
  fields: SkillNodeUpdateWithWhereUniqueWithoutTreeInputFields,
});

export const SkillNodeUpdateManyWithWhereWithoutTreeInputFields = (t: any) => ({
  where: t.field({"required":true,"type":SkillNodeScalarWhereInput}),
  data: t.field({"required":true,"type":SkillNodeUpdateManyMutationInput}),
});
export const SkillNodeUpdateManyWithWhereWithoutTreeInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeUpdateManyWithWhereWithoutTreeInput>, false>('SkillNodeUpdateManyWithWhereWithoutTreeInput').implement({
  fields: SkillNodeUpdateManyWithWhereWithoutTreeInputFields,
});

export const SkillNodeScalarWhereInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[SkillNodeScalarWhereInput]}),
  OR: t.field({"required":false,"type":[SkillNodeScalarWhereInput]}),
  NOT: t.field({"required":false,"type":[SkillNodeScalarWhereInput]}),
  id: t.field({"required":false,"type":UuidFilter}),
  treeId: t.field({"required":false,"type":UuidFilter}),
  title: t.field({"required":false,"type":StringFilter}),
  step: t.field({"required":false,"type":IntFilter}),
  orderInStep: t.field({"required":false,"type":IntFilter}),
  posX: t.field({"required":false,"type":IntNullableFilter}),
  posY: t.field({"required":false,"type":IntNullableFilter}),
  createdAt: t.field({"required":false,"type":DateTimeFilter}),
  updatedAt: t.field({"required":false,"type":DateTimeFilter}),
  deletedAt: t.field({"required":false,"type":DateTimeNullableFilter}),
});
export const SkillNodeScalarWhereInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeScalarWhereInput>, false>('SkillNodeScalarWhereInput').implement({
  fields: SkillNodeScalarWhereInputFields,
});

export const SkillTreeCreateWithoutNodesInputFields = (t: any) => ({
  id: t.string({"required":false}),
  title: t.string({"required":true}),
  description: t.string({"required":false}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  deletedAt: t.field({"required":false,"type":DateTime}),
  course: t.field({"required":true,"type":CourseCreateNestedOneWithoutTreesInput}),
});
export const SkillTreeCreateWithoutNodesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillTreeCreateWithoutNodesInput>, false>('SkillTreeCreateWithoutNodesInput').implement({
  fields: SkillTreeCreateWithoutNodesInputFields,
});

export const SkillTreeCreateOrConnectWithoutNodesInputFields = (t: any) => ({
  where: t.field({"required":true,"type":SkillTreeWhereUniqueInput}),
  create: t.field({"required":true,"type":SkillTreeCreateWithoutNodesInput}),
});
export const SkillTreeCreateOrConnectWithoutNodesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillTreeCreateOrConnectWithoutNodesInput>, false>('SkillTreeCreateOrConnectWithoutNodesInput').implement({
  fields: SkillTreeCreateOrConnectWithoutNodesInputFields,
});

export const LessonBlocksCreateWithoutNodeInputFields = (t: any) => ({
  id: t.string({"required":false}),
  type: t.field({"required":true,"type":ContentType}),
  url: t.string({"required":false}),
  html: t.string({"required":false}),
  caption: t.string({"required":false}),
  order: t.int({"required":false}),
  meta: t.field({"required":false,"type":Json}),
  status: t.field({"required":false,"type":LessonStatus}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  deletedAt: t.field({"required":false,"type":DateTime}),
});
export const LessonBlocksCreateWithoutNodeInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.LessonBlocksCreateWithoutNodeInput>, false>('LessonBlocksCreateWithoutNodeInput').implement({
  fields: LessonBlocksCreateWithoutNodeInputFields,
});

export const LessonBlocksCreateOrConnectWithoutNodeInputFields = (t: any) => ({
  where: t.field({"required":true,"type":LessonBlocksWhereUniqueInput}),
  create: t.field({"required":true,"type":LessonBlocksCreateWithoutNodeInput}),
});
export const LessonBlocksCreateOrConnectWithoutNodeInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.LessonBlocksCreateOrConnectWithoutNodeInput>, false>('LessonBlocksCreateOrConnectWithoutNodeInput').implement({
  fields: LessonBlocksCreateOrConnectWithoutNodeInputFields,
});

export const LessonBlocksCreateManyNodeInputEnvelopeFields = (t: any) => ({
  data: t.field({"required":true,"type":[LessonBlocksCreateManyNodeInput]}),
  skipDuplicates: t.boolean({"required":false}),
});
export const LessonBlocksCreateManyNodeInputEnvelope = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.LessonBlocksCreateManyNodeInputEnvelope>, false>('LessonBlocksCreateManyNodeInputEnvelope').implement({
  fields: LessonBlocksCreateManyNodeInputEnvelopeFields,
});

export const QuizCreateWithoutNodeInputFields = (t: any) => ({
  id: t.string({"required":false}),
  title: t.string({"required":false}),
  required: t.boolean({"required":false}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  deletedAt: t.field({"required":false,"type":DateTime}),
  questions: t.field({"required":false,"type":QuizQuestionCreateNestedManyWithoutQuizInput}),
  attempts: t.field({"required":false,"type":QuizAttemptCreateNestedManyWithoutQuizInput}),
});
export const QuizCreateWithoutNodeInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizCreateWithoutNodeInput>, false>('QuizCreateWithoutNodeInput').implement({
  fields: QuizCreateWithoutNodeInputFields,
});

export const QuizCreateOrConnectWithoutNodeInputFields = (t: any) => ({
  where: t.field({"required":true,"type":QuizWhereUniqueInput}),
  create: t.field({"required":true,"type":QuizCreateWithoutNodeInput}),
});
export const QuizCreateOrConnectWithoutNodeInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizCreateOrConnectWithoutNodeInput>, false>('QuizCreateOrConnectWithoutNodeInput').implement({
  fields: QuizCreateOrConnectWithoutNodeInputFields,
});

export const SkillNodePrerequisiteCreateWithoutNodeInputFields = (t: any) => ({
  dependsOn: t.field({"required":true,"type":SkillNodeCreateNestedOneWithoutRequiredForInput}),
});
export const SkillNodePrerequisiteCreateWithoutNodeInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodePrerequisiteCreateWithoutNodeInput>, false>('SkillNodePrerequisiteCreateWithoutNodeInput').implement({
  fields: SkillNodePrerequisiteCreateWithoutNodeInputFields,
});

export const SkillNodePrerequisiteCreateOrConnectWithoutNodeInputFields = (t: any) => ({
  where: t.field({"required":true,"type":SkillNodePrerequisiteWhereUniqueInput}),
  create: t.field({"required":true,"type":SkillNodePrerequisiteCreateWithoutNodeInput}),
});
export const SkillNodePrerequisiteCreateOrConnectWithoutNodeInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodePrerequisiteCreateOrConnectWithoutNodeInput>, false>('SkillNodePrerequisiteCreateOrConnectWithoutNodeInput').implement({
  fields: SkillNodePrerequisiteCreateOrConnectWithoutNodeInputFields,
});

export const SkillNodePrerequisiteCreateManyNodeInputEnvelopeFields = (t: any) => ({
  data: t.field({"required":true,"type":[SkillNodePrerequisiteCreateManyNodeInput]}),
  skipDuplicates: t.boolean({"required":false}),
});
export const SkillNodePrerequisiteCreateManyNodeInputEnvelope = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodePrerequisiteCreateManyNodeInputEnvelope>, false>('SkillNodePrerequisiteCreateManyNodeInputEnvelope').implement({
  fields: SkillNodePrerequisiteCreateManyNodeInputEnvelopeFields,
});

export const SkillNodePrerequisiteCreateWithoutDependsOnInputFields = (t: any) => ({
  node: t.field({"required":true,"type":SkillNodeCreateNestedOneWithoutPrerequisitesInput}),
});
export const SkillNodePrerequisiteCreateWithoutDependsOnInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodePrerequisiteCreateWithoutDependsOnInput>, false>('SkillNodePrerequisiteCreateWithoutDependsOnInput').implement({
  fields: SkillNodePrerequisiteCreateWithoutDependsOnInputFields,
});

export const SkillNodePrerequisiteCreateOrConnectWithoutDependsOnInputFields = (t: any) => ({
  where: t.field({"required":true,"type":SkillNodePrerequisiteWhereUniqueInput}),
  create: t.field({"required":true,"type":SkillNodePrerequisiteCreateWithoutDependsOnInput}),
});
export const SkillNodePrerequisiteCreateOrConnectWithoutDependsOnInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodePrerequisiteCreateOrConnectWithoutDependsOnInput>, false>('SkillNodePrerequisiteCreateOrConnectWithoutDependsOnInput').implement({
  fields: SkillNodePrerequisiteCreateOrConnectWithoutDependsOnInputFields,
});

export const SkillNodePrerequisiteCreateManyDependsOnInputEnvelopeFields = (t: any) => ({
  data: t.field({"required":true,"type":[SkillNodePrerequisiteCreateManyDependsOnInput]}),
  skipDuplicates: t.boolean({"required":false}),
});
export const SkillNodePrerequisiteCreateManyDependsOnInputEnvelope = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodePrerequisiteCreateManyDependsOnInputEnvelope>, false>('SkillNodePrerequisiteCreateManyDependsOnInputEnvelope').implement({
  fields: SkillNodePrerequisiteCreateManyDependsOnInputEnvelopeFields,
});

export const UserNodeProgressCreateWithoutNodeInputFields = (t: any) => ({
  id: t.string({"required":false}),
  status: t.field({"required":false,"type":ProgressStatus}),
  completedAt: t.field({"required":false,"type":DateTime}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  user: t.field({"required":true,"type":UserCreateNestedOneWithoutNodeProgressInput}),
});
export const UserNodeProgressCreateWithoutNodeInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserNodeProgressCreateWithoutNodeInput>, false>('UserNodeProgressCreateWithoutNodeInput').implement({
  fields: UserNodeProgressCreateWithoutNodeInputFields,
});

export const UserNodeProgressCreateOrConnectWithoutNodeInputFields = (t: any) => ({
  where: t.field({"required":true,"type":UserNodeProgressWhereUniqueInput}),
  create: t.field({"required":true,"type":UserNodeProgressCreateWithoutNodeInput}),
});
export const UserNodeProgressCreateOrConnectWithoutNodeInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserNodeProgressCreateOrConnectWithoutNodeInput>, false>('UserNodeProgressCreateOrConnectWithoutNodeInput').implement({
  fields: UserNodeProgressCreateOrConnectWithoutNodeInputFields,
});

export const UserNodeProgressCreateManyNodeInputEnvelopeFields = (t: any) => ({
  data: t.field({"required":true,"type":[UserNodeProgressCreateManyNodeInput]}),
  skipDuplicates: t.boolean({"required":false}),
});
export const UserNodeProgressCreateManyNodeInputEnvelope = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserNodeProgressCreateManyNodeInputEnvelope>, false>('UserNodeProgressCreateManyNodeInputEnvelope').implement({
  fields: UserNodeProgressCreateManyNodeInputEnvelopeFields,
});

export const SkillTreeUpsertWithoutNodesInputFields = (t: any) => ({
  update: t.field({"required":true,"type":SkillTreeUpdateWithoutNodesInput}),
  create: t.field({"required":true,"type":SkillTreeCreateWithoutNodesInput}),
  where: t.field({"required":false,"type":SkillTreeWhereInput}),
});
export const SkillTreeUpsertWithoutNodesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillTreeUpsertWithoutNodesInput>, false>('SkillTreeUpsertWithoutNodesInput').implement({
  fields: SkillTreeUpsertWithoutNodesInputFields,
});

export const SkillTreeUpdateToOneWithWhereWithoutNodesInputFields = (t: any) => ({
  where: t.field({"required":false,"type":SkillTreeWhereInput}),
  data: t.field({"required":true,"type":SkillTreeUpdateWithoutNodesInput}),
});
export const SkillTreeUpdateToOneWithWhereWithoutNodesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillTreeUpdateToOneWithWhereWithoutNodesInput>, false>('SkillTreeUpdateToOneWithWhereWithoutNodesInput').implement({
  fields: SkillTreeUpdateToOneWithWhereWithoutNodesInputFields,
});

export const SkillTreeUpdateWithoutNodesInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  title: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  description: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  createdAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updatedAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  deletedAt: t.field({"required":false,"type":NullableDateTimeFieldUpdateOperationsInput}),
  course: t.field({"required":false,"type":CourseUpdateOneRequiredWithoutTreesNestedInput}),
});
export const SkillTreeUpdateWithoutNodesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillTreeUpdateWithoutNodesInput>, false>('SkillTreeUpdateWithoutNodesInput').implement({
  fields: SkillTreeUpdateWithoutNodesInputFields,
});

export const LessonBlocksUpsertWithWhereUniqueWithoutNodeInputFields = (t: any) => ({
  where: t.field({"required":true,"type":LessonBlocksWhereUniqueInput}),
  update: t.field({"required":true,"type":LessonBlocksUpdateWithoutNodeInput}),
  create: t.field({"required":true,"type":LessonBlocksCreateWithoutNodeInput}),
});
export const LessonBlocksUpsertWithWhereUniqueWithoutNodeInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.LessonBlocksUpsertWithWhereUniqueWithoutNodeInput>, false>('LessonBlocksUpsertWithWhereUniqueWithoutNodeInput').implement({
  fields: LessonBlocksUpsertWithWhereUniqueWithoutNodeInputFields,
});

export const LessonBlocksUpdateWithWhereUniqueWithoutNodeInputFields = (t: any) => ({
  where: t.field({"required":true,"type":LessonBlocksWhereUniqueInput}),
  data: t.field({"required":true,"type":LessonBlocksUpdateWithoutNodeInput}),
});
export const LessonBlocksUpdateWithWhereUniqueWithoutNodeInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.LessonBlocksUpdateWithWhereUniqueWithoutNodeInput>, false>('LessonBlocksUpdateWithWhereUniqueWithoutNodeInput').implement({
  fields: LessonBlocksUpdateWithWhereUniqueWithoutNodeInputFields,
});

export const LessonBlocksUpdateManyWithWhereWithoutNodeInputFields = (t: any) => ({
  where: t.field({"required":true,"type":LessonBlocksScalarWhereInput}),
  data: t.field({"required":true,"type":LessonBlocksUpdateManyMutationInput}),
});
export const LessonBlocksUpdateManyWithWhereWithoutNodeInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.LessonBlocksUpdateManyWithWhereWithoutNodeInput>, false>('LessonBlocksUpdateManyWithWhereWithoutNodeInput').implement({
  fields: LessonBlocksUpdateManyWithWhereWithoutNodeInputFields,
});

export const LessonBlocksScalarWhereInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[LessonBlocksScalarWhereInput]}),
  OR: t.field({"required":false,"type":[LessonBlocksScalarWhereInput]}),
  NOT: t.field({"required":false,"type":[LessonBlocksScalarWhereInput]}),
  id: t.field({"required":false,"type":UuidFilter}),
  nodeId: t.field({"required":false,"type":UuidFilter}),
  type: t.field({"required":false,"type":EnumContentTypeFilter}),
  url: t.field({"required":false,"type":StringNullableFilter}),
  html: t.field({"required":false,"type":StringNullableFilter}),
  caption: t.field({"required":false,"type":StringNullableFilter}),
  order: t.field({"required":false,"type":IntFilter}),
  meta: t.field({"required":false,"type":JsonNullableFilter}),
  status: t.field({"required":false,"type":EnumLessonStatusFilter}),
  createdAt: t.field({"required":false,"type":DateTimeFilter}),
  updatedAt: t.field({"required":false,"type":DateTimeFilter}),
  deletedAt: t.field({"required":false,"type":DateTimeNullableFilter}),
});
export const LessonBlocksScalarWhereInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.LessonBlocksScalarWhereInput>, false>('LessonBlocksScalarWhereInput').implement({
  fields: LessonBlocksScalarWhereInputFields,
});

export const QuizUpsertWithoutNodeInputFields = (t: any) => ({
  update: t.field({"required":true,"type":QuizUpdateWithoutNodeInput}),
  create: t.field({"required":true,"type":QuizCreateWithoutNodeInput}),
  where: t.field({"required":false,"type":QuizWhereInput}),
});
export const QuizUpsertWithoutNodeInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizUpsertWithoutNodeInput>, false>('QuizUpsertWithoutNodeInput').implement({
  fields: QuizUpsertWithoutNodeInputFields,
});

export const QuizUpdateToOneWithWhereWithoutNodeInputFields = (t: any) => ({
  where: t.field({"required":false,"type":QuizWhereInput}),
  data: t.field({"required":true,"type":QuizUpdateWithoutNodeInput}),
});
export const QuizUpdateToOneWithWhereWithoutNodeInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizUpdateToOneWithWhereWithoutNodeInput>, false>('QuizUpdateToOneWithWhereWithoutNodeInput').implement({
  fields: QuizUpdateToOneWithWhereWithoutNodeInputFields,
});

export const QuizUpdateWithoutNodeInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  title: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  required: t.field({"required":false,"type":BoolFieldUpdateOperationsInput}),
  createdAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updatedAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  deletedAt: t.field({"required":false,"type":NullableDateTimeFieldUpdateOperationsInput}),
  questions: t.field({"required":false,"type":QuizQuestionUpdateManyWithoutQuizNestedInput}),
  attempts: t.field({"required":false,"type":QuizAttemptUpdateManyWithoutQuizNestedInput}),
});
export const QuizUpdateWithoutNodeInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizUpdateWithoutNodeInput>, false>('QuizUpdateWithoutNodeInput').implement({
  fields: QuizUpdateWithoutNodeInputFields,
});

export const SkillNodePrerequisiteUpsertWithWhereUniqueWithoutNodeInputFields = (t: any) => ({
  where: t.field({"required":true,"type":SkillNodePrerequisiteWhereUniqueInput}),
  update: t.field({"required":true,"type":SkillNodePrerequisiteUpdateWithoutNodeInput}),
  create: t.field({"required":true,"type":SkillNodePrerequisiteCreateWithoutNodeInput}),
});
export const SkillNodePrerequisiteUpsertWithWhereUniqueWithoutNodeInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodePrerequisiteUpsertWithWhereUniqueWithoutNodeInput>, false>('SkillNodePrerequisiteUpsertWithWhereUniqueWithoutNodeInput').implement({
  fields: SkillNodePrerequisiteUpsertWithWhereUniqueWithoutNodeInputFields,
});

export const SkillNodePrerequisiteUpdateWithWhereUniqueWithoutNodeInputFields = (t: any) => ({
  where: t.field({"required":true,"type":SkillNodePrerequisiteWhereUniqueInput}),
  data: t.field({"required":true,"type":SkillNodePrerequisiteUpdateWithoutNodeInput}),
});
export const SkillNodePrerequisiteUpdateWithWhereUniqueWithoutNodeInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodePrerequisiteUpdateWithWhereUniqueWithoutNodeInput>, false>('SkillNodePrerequisiteUpdateWithWhereUniqueWithoutNodeInput').implement({
  fields: SkillNodePrerequisiteUpdateWithWhereUniqueWithoutNodeInputFields,
});

export const SkillNodePrerequisiteUpdateManyWithWhereWithoutNodeInputFields = (t: any) => ({
  where: t.field({"required":true,"type":SkillNodePrerequisiteScalarWhereInput}),
  data: t.field({"required":true,"type":SkillNodePrerequisiteUpdateManyMutationInput}),
});
export const SkillNodePrerequisiteUpdateManyWithWhereWithoutNodeInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodePrerequisiteUpdateManyWithWhereWithoutNodeInput>, false>('SkillNodePrerequisiteUpdateManyWithWhereWithoutNodeInput').implement({
  fields: SkillNodePrerequisiteUpdateManyWithWhereWithoutNodeInputFields,
});

export const SkillNodePrerequisiteScalarWhereInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[SkillNodePrerequisiteScalarWhereInput]}),
  OR: t.field({"required":false,"type":[SkillNodePrerequisiteScalarWhereInput]}),
  NOT: t.field({"required":false,"type":[SkillNodePrerequisiteScalarWhereInput]}),
  nodeId: t.field({"required":false,"type":UuidFilter}),
  dependsOnNodeId: t.field({"required":false,"type":UuidFilter}),
});
export const SkillNodePrerequisiteScalarWhereInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodePrerequisiteScalarWhereInput>, false>('SkillNodePrerequisiteScalarWhereInput').implement({
  fields: SkillNodePrerequisiteScalarWhereInputFields,
});

export const SkillNodePrerequisiteUpsertWithWhereUniqueWithoutDependsOnInputFields = (t: any) => ({
  where: t.field({"required":true,"type":SkillNodePrerequisiteWhereUniqueInput}),
  update: t.field({"required":true,"type":SkillNodePrerequisiteUpdateWithoutDependsOnInput}),
  create: t.field({"required":true,"type":SkillNodePrerequisiteCreateWithoutDependsOnInput}),
});
export const SkillNodePrerequisiteUpsertWithWhereUniqueWithoutDependsOnInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodePrerequisiteUpsertWithWhereUniqueWithoutDependsOnInput>, false>('SkillNodePrerequisiteUpsertWithWhereUniqueWithoutDependsOnInput').implement({
  fields: SkillNodePrerequisiteUpsertWithWhereUniqueWithoutDependsOnInputFields,
});

export const SkillNodePrerequisiteUpdateWithWhereUniqueWithoutDependsOnInputFields = (t: any) => ({
  where: t.field({"required":true,"type":SkillNodePrerequisiteWhereUniqueInput}),
  data: t.field({"required":true,"type":SkillNodePrerequisiteUpdateWithoutDependsOnInput}),
});
export const SkillNodePrerequisiteUpdateWithWhereUniqueWithoutDependsOnInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodePrerequisiteUpdateWithWhereUniqueWithoutDependsOnInput>, false>('SkillNodePrerequisiteUpdateWithWhereUniqueWithoutDependsOnInput').implement({
  fields: SkillNodePrerequisiteUpdateWithWhereUniqueWithoutDependsOnInputFields,
});

export const SkillNodePrerequisiteUpdateManyWithWhereWithoutDependsOnInputFields = (t: any) => ({
  where: t.field({"required":true,"type":SkillNodePrerequisiteScalarWhereInput}),
  data: t.field({"required":true,"type":SkillNodePrerequisiteUpdateManyMutationInput}),
});
export const SkillNodePrerequisiteUpdateManyWithWhereWithoutDependsOnInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodePrerequisiteUpdateManyWithWhereWithoutDependsOnInput>, false>('SkillNodePrerequisiteUpdateManyWithWhereWithoutDependsOnInput').implement({
  fields: SkillNodePrerequisiteUpdateManyWithWhereWithoutDependsOnInputFields,
});

export const UserNodeProgressUpsertWithWhereUniqueWithoutNodeInputFields = (t: any) => ({
  where: t.field({"required":true,"type":UserNodeProgressWhereUniqueInput}),
  update: t.field({"required":true,"type":UserNodeProgressUpdateWithoutNodeInput}),
  create: t.field({"required":true,"type":UserNodeProgressCreateWithoutNodeInput}),
});
export const UserNodeProgressUpsertWithWhereUniqueWithoutNodeInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserNodeProgressUpsertWithWhereUniqueWithoutNodeInput>, false>('UserNodeProgressUpsertWithWhereUniqueWithoutNodeInput').implement({
  fields: UserNodeProgressUpsertWithWhereUniqueWithoutNodeInputFields,
});

export const UserNodeProgressUpdateWithWhereUniqueWithoutNodeInputFields = (t: any) => ({
  where: t.field({"required":true,"type":UserNodeProgressWhereUniqueInput}),
  data: t.field({"required":true,"type":UserNodeProgressUpdateWithoutNodeInput}),
});
export const UserNodeProgressUpdateWithWhereUniqueWithoutNodeInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserNodeProgressUpdateWithWhereUniqueWithoutNodeInput>, false>('UserNodeProgressUpdateWithWhereUniqueWithoutNodeInput').implement({
  fields: UserNodeProgressUpdateWithWhereUniqueWithoutNodeInputFields,
});

export const UserNodeProgressUpdateManyWithWhereWithoutNodeInputFields = (t: any) => ({
  where: t.field({"required":true,"type":UserNodeProgressScalarWhereInput}),
  data: t.field({"required":true,"type":UserNodeProgressUpdateManyMutationInput}),
});
export const UserNodeProgressUpdateManyWithWhereWithoutNodeInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserNodeProgressUpdateManyWithWhereWithoutNodeInput>, false>('UserNodeProgressUpdateManyWithWhereWithoutNodeInput').implement({
  fields: UserNodeProgressUpdateManyWithWhereWithoutNodeInputFields,
});

export const SkillNodeCreateWithoutPrerequisitesInputFields = (t: any) => ({
  id: t.string({"required":false}),
  title: t.string({"required":true}),
  step: t.int({"required":false}),
  orderInStep: t.int({"required":false}),
  posX: t.int({"required":false}),
  posY: t.int({"required":false}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  deletedAt: t.field({"required":false,"type":DateTime}),
  tree: t.field({"required":true,"type":SkillTreeCreateNestedOneWithoutNodesInput}),
  lessons: t.field({"required":false,"type":LessonBlocksCreateNestedManyWithoutNodeInput}),
  quiz: t.field({"required":false,"type":QuizCreateNestedOneWithoutNodeInput}),
  requiredFor: t.field({"required":false,"type":SkillNodePrerequisiteCreateNestedManyWithoutDependsOnInput}),
  progresses: t.field({"required":false,"type":UserNodeProgressCreateNestedManyWithoutNodeInput}),
});
export const SkillNodeCreateWithoutPrerequisitesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeCreateWithoutPrerequisitesInput>, false>('SkillNodeCreateWithoutPrerequisitesInput').implement({
  fields: SkillNodeCreateWithoutPrerequisitesInputFields,
});

export const SkillNodeCreateOrConnectWithoutPrerequisitesInputFields = (t: any) => ({
  where: t.field({"required":true,"type":SkillNodeWhereUniqueInput}),
  create: t.field({"required":true,"type":SkillNodeCreateWithoutPrerequisitesInput}),
});
export const SkillNodeCreateOrConnectWithoutPrerequisitesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeCreateOrConnectWithoutPrerequisitesInput>, false>('SkillNodeCreateOrConnectWithoutPrerequisitesInput').implement({
  fields: SkillNodeCreateOrConnectWithoutPrerequisitesInputFields,
});

export const SkillNodeCreateWithoutRequiredForInputFields = (t: any) => ({
  id: t.string({"required":false}),
  title: t.string({"required":true}),
  step: t.int({"required":false}),
  orderInStep: t.int({"required":false}),
  posX: t.int({"required":false}),
  posY: t.int({"required":false}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  deletedAt: t.field({"required":false,"type":DateTime}),
  tree: t.field({"required":true,"type":SkillTreeCreateNestedOneWithoutNodesInput}),
  lessons: t.field({"required":false,"type":LessonBlocksCreateNestedManyWithoutNodeInput}),
  quiz: t.field({"required":false,"type":QuizCreateNestedOneWithoutNodeInput}),
  prerequisites: t.field({"required":false,"type":SkillNodePrerequisiteCreateNestedManyWithoutNodeInput}),
  progresses: t.field({"required":false,"type":UserNodeProgressCreateNestedManyWithoutNodeInput}),
});
export const SkillNodeCreateWithoutRequiredForInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeCreateWithoutRequiredForInput>, false>('SkillNodeCreateWithoutRequiredForInput').implement({
  fields: SkillNodeCreateWithoutRequiredForInputFields,
});

export const SkillNodeCreateOrConnectWithoutRequiredForInputFields = (t: any) => ({
  where: t.field({"required":true,"type":SkillNodeWhereUniqueInput}),
  create: t.field({"required":true,"type":SkillNodeCreateWithoutRequiredForInput}),
});
export const SkillNodeCreateOrConnectWithoutRequiredForInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeCreateOrConnectWithoutRequiredForInput>, false>('SkillNodeCreateOrConnectWithoutRequiredForInput').implement({
  fields: SkillNodeCreateOrConnectWithoutRequiredForInputFields,
});

export const SkillNodeUpsertWithoutPrerequisitesInputFields = (t: any) => ({
  update: t.field({"required":true,"type":SkillNodeUpdateWithoutPrerequisitesInput}),
  create: t.field({"required":true,"type":SkillNodeCreateWithoutPrerequisitesInput}),
  where: t.field({"required":false,"type":SkillNodeWhereInput}),
});
export const SkillNodeUpsertWithoutPrerequisitesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeUpsertWithoutPrerequisitesInput>, false>('SkillNodeUpsertWithoutPrerequisitesInput').implement({
  fields: SkillNodeUpsertWithoutPrerequisitesInputFields,
});

export const SkillNodeUpdateToOneWithWhereWithoutPrerequisitesInputFields = (t: any) => ({
  where: t.field({"required":false,"type":SkillNodeWhereInput}),
  data: t.field({"required":true,"type":SkillNodeUpdateWithoutPrerequisitesInput}),
});
export const SkillNodeUpdateToOneWithWhereWithoutPrerequisitesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeUpdateToOneWithWhereWithoutPrerequisitesInput>, false>('SkillNodeUpdateToOneWithWhereWithoutPrerequisitesInput').implement({
  fields: SkillNodeUpdateToOneWithWhereWithoutPrerequisitesInputFields,
});

export const SkillNodeUpdateWithoutPrerequisitesInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  title: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  step: t.field({"required":false,"type":IntFieldUpdateOperationsInput}),
  orderInStep: t.field({"required":false,"type":IntFieldUpdateOperationsInput}),
  posX: t.field({"required":false,"type":NullableIntFieldUpdateOperationsInput}),
  posY: t.field({"required":false,"type":NullableIntFieldUpdateOperationsInput}),
  createdAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updatedAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  deletedAt: t.field({"required":false,"type":NullableDateTimeFieldUpdateOperationsInput}),
  tree: t.field({"required":false,"type":SkillTreeUpdateOneRequiredWithoutNodesNestedInput}),
  lessons: t.field({"required":false,"type":LessonBlocksUpdateManyWithoutNodeNestedInput}),
  quiz: t.field({"required":false,"type":QuizUpdateOneWithoutNodeNestedInput}),
  requiredFor: t.field({"required":false,"type":SkillNodePrerequisiteUpdateManyWithoutDependsOnNestedInput}),
  progresses: t.field({"required":false,"type":UserNodeProgressUpdateManyWithoutNodeNestedInput}),
});
export const SkillNodeUpdateWithoutPrerequisitesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeUpdateWithoutPrerequisitesInput>, false>('SkillNodeUpdateWithoutPrerequisitesInput').implement({
  fields: SkillNodeUpdateWithoutPrerequisitesInputFields,
});

export const SkillNodeUpsertWithoutRequiredForInputFields = (t: any) => ({
  update: t.field({"required":true,"type":SkillNodeUpdateWithoutRequiredForInput}),
  create: t.field({"required":true,"type":SkillNodeCreateWithoutRequiredForInput}),
  where: t.field({"required":false,"type":SkillNodeWhereInput}),
});
export const SkillNodeUpsertWithoutRequiredForInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeUpsertWithoutRequiredForInput>, false>('SkillNodeUpsertWithoutRequiredForInput').implement({
  fields: SkillNodeUpsertWithoutRequiredForInputFields,
});

export const SkillNodeUpdateToOneWithWhereWithoutRequiredForInputFields = (t: any) => ({
  where: t.field({"required":false,"type":SkillNodeWhereInput}),
  data: t.field({"required":true,"type":SkillNodeUpdateWithoutRequiredForInput}),
});
export const SkillNodeUpdateToOneWithWhereWithoutRequiredForInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeUpdateToOneWithWhereWithoutRequiredForInput>, false>('SkillNodeUpdateToOneWithWhereWithoutRequiredForInput').implement({
  fields: SkillNodeUpdateToOneWithWhereWithoutRequiredForInputFields,
});

export const SkillNodeUpdateWithoutRequiredForInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  title: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  step: t.field({"required":false,"type":IntFieldUpdateOperationsInput}),
  orderInStep: t.field({"required":false,"type":IntFieldUpdateOperationsInput}),
  posX: t.field({"required":false,"type":NullableIntFieldUpdateOperationsInput}),
  posY: t.field({"required":false,"type":NullableIntFieldUpdateOperationsInput}),
  createdAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updatedAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  deletedAt: t.field({"required":false,"type":NullableDateTimeFieldUpdateOperationsInput}),
  tree: t.field({"required":false,"type":SkillTreeUpdateOneRequiredWithoutNodesNestedInput}),
  lessons: t.field({"required":false,"type":LessonBlocksUpdateManyWithoutNodeNestedInput}),
  quiz: t.field({"required":false,"type":QuizUpdateOneWithoutNodeNestedInput}),
  prerequisites: t.field({"required":false,"type":SkillNodePrerequisiteUpdateManyWithoutNodeNestedInput}),
  progresses: t.field({"required":false,"type":UserNodeProgressUpdateManyWithoutNodeNestedInput}),
});
export const SkillNodeUpdateWithoutRequiredForInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeUpdateWithoutRequiredForInput>, false>('SkillNodeUpdateWithoutRequiredForInput').implement({
  fields: SkillNodeUpdateWithoutRequiredForInputFields,
});

export const SkillNodeCreateWithoutLessonsInputFields = (t: any) => ({
  id: t.string({"required":false}),
  title: t.string({"required":true}),
  step: t.int({"required":false}),
  orderInStep: t.int({"required":false}),
  posX: t.int({"required":false}),
  posY: t.int({"required":false}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  deletedAt: t.field({"required":false,"type":DateTime}),
  tree: t.field({"required":true,"type":SkillTreeCreateNestedOneWithoutNodesInput}),
  quiz: t.field({"required":false,"type":QuizCreateNestedOneWithoutNodeInput}),
  prerequisites: t.field({"required":false,"type":SkillNodePrerequisiteCreateNestedManyWithoutNodeInput}),
  requiredFor: t.field({"required":false,"type":SkillNodePrerequisiteCreateNestedManyWithoutDependsOnInput}),
  progresses: t.field({"required":false,"type":UserNodeProgressCreateNestedManyWithoutNodeInput}),
});
export const SkillNodeCreateWithoutLessonsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeCreateWithoutLessonsInput>, false>('SkillNodeCreateWithoutLessonsInput').implement({
  fields: SkillNodeCreateWithoutLessonsInputFields,
});

export const SkillNodeCreateOrConnectWithoutLessonsInputFields = (t: any) => ({
  where: t.field({"required":true,"type":SkillNodeWhereUniqueInput}),
  create: t.field({"required":true,"type":SkillNodeCreateWithoutLessonsInput}),
});
export const SkillNodeCreateOrConnectWithoutLessonsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeCreateOrConnectWithoutLessonsInput>, false>('SkillNodeCreateOrConnectWithoutLessonsInput').implement({
  fields: SkillNodeCreateOrConnectWithoutLessonsInputFields,
});

export const SkillNodeUpsertWithoutLessonsInputFields = (t: any) => ({
  update: t.field({"required":true,"type":SkillNodeUpdateWithoutLessonsInput}),
  create: t.field({"required":true,"type":SkillNodeCreateWithoutLessonsInput}),
  where: t.field({"required":false,"type":SkillNodeWhereInput}),
});
export const SkillNodeUpsertWithoutLessonsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeUpsertWithoutLessonsInput>, false>('SkillNodeUpsertWithoutLessonsInput').implement({
  fields: SkillNodeUpsertWithoutLessonsInputFields,
});

export const SkillNodeUpdateToOneWithWhereWithoutLessonsInputFields = (t: any) => ({
  where: t.field({"required":false,"type":SkillNodeWhereInput}),
  data: t.field({"required":true,"type":SkillNodeUpdateWithoutLessonsInput}),
});
export const SkillNodeUpdateToOneWithWhereWithoutLessonsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeUpdateToOneWithWhereWithoutLessonsInput>, false>('SkillNodeUpdateToOneWithWhereWithoutLessonsInput').implement({
  fields: SkillNodeUpdateToOneWithWhereWithoutLessonsInputFields,
});

export const SkillNodeUpdateWithoutLessonsInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  title: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  step: t.field({"required":false,"type":IntFieldUpdateOperationsInput}),
  orderInStep: t.field({"required":false,"type":IntFieldUpdateOperationsInput}),
  posX: t.field({"required":false,"type":NullableIntFieldUpdateOperationsInput}),
  posY: t.field({"required":false,"type":NullableIntFieldUpdateOperationsInput}),
  createdAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updatedAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  deletedAt: t.field({"required":false,"type":NullableDateTimeFieldUpdateOperationsInput}),
  tree: t.field({"required":false,"type":SkillTreeUpdateOneRequiredWithoutNodesNestedInput}),
  quiz: t.field({"required":false,"type":QuizUpdateOneWithoutNodeNestedInput}),
  prerequisites: t.field({"required":false,"type":SkillNodePrerequisiteUpdateManyWithoutNodeNestedInput}),
  requiredFor: t.field({"required":false,"type":SkillNodePrerequisiteUpdateManyWithoutDependsOnNestedInput}),
  progresses: t.field({"required":false,"type":UserNodeProgressUpdateManyWithoutNodeNestedInput}),
});
export const SkillNodeUpdateWithoutLessonsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeUpdateWithoutLessonsInput>, false>('SkillNodeUpdateWithoutLessonsInput').implement({
  fields: SkillNodeUpdateWithoutLessonsInputFields,
});

export const SkillNodeCreateWithoutQuizInputFields = (t: any) => ({
  id: t.string({"required":false}),
  title: t.string({"required":true}),
  step: t.int({"required":false}),
  orderInStep: t.int({"required":false}),
  posX: t.int({"required":false}),
  posY: t.int({"required":false}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  deletedAt: t.field({"required":false,"type":DateTime}),
  tree: t.field({"required":true,"type":SkillTreeCreateNestedOneWithoutNodesInput}),
  lessons: t.field({"required":false,"type":LessonBlocksCreateNestedManyWithoutNodeInput}),
  prerequisites: t.field({"required":false,"type":SkillNodePrerequisiteCreateNestedManyWithoutNodeInput}),
  requiredFor: t.field({"required":false,"type":SkillNodePrerequisiteCreateNestedManyWithoutDependsOnInput}),
  progresses: t.field({"required":false,"type":UserNodeProgressCreateNestedManyWithoutNodeInput}),
});
export const SkillNodeCreateWithoutQuizInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeCreateWithoutQuizInput>, false>('SkillNodeCreateWithoutQuizInput').implement({
  fields: SkillNodeCreateWithoutQuizInputFields,
});

export const SkillNodeCreateOrConnectWithoutQuizInputFields = (t: any) => ({
  where: t.field({"required":true,"type":SkillNodeWhereUniqueInput}),
  create: t.field({"required":true,"type":SkillNodeCreateWithoutQuizInput}),
});
export const SkillNodeCreateOrConnectWithoutQuizInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeCreateOrConnectWithoutQuizInput>, false>('SkillNodeCreateOrConnectWithoutQuizInput').implement({
  fields: SkillNodeCreateOrConnectWithoutQuizInputFields,
});

export const QuizQuestionCreateWithoutQuizInputFields = (t: any) => ({
  id: t.string({"required":false}),
  type: t.field({"required":true,"type":QuestionType}),
  prompt: t.string({"required":true}),
  order: t.int({"required":false}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  options: t.field({"required":false,"type":QuizOptionCreateNestedManyWithoutQuestionInput}),
  answers: t.field({"required":false,"type":QuizAttemptAnswerCreateNestedManyWithoutQuestionInput}),
});
export const QuizQuestionCreateWithoutQuizInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizQuestionCreateWithoutQuizInput>, false>('QuizQuestionCreateWithoutQuizInput').implement({
  fields: QuizQuestionCreateWithoutQuizInputFields,
});

export const QuizQuestionCreateOrConnectWithoutQuizInputFields = (t: any) => ({
  where: t.field({"required":true,"type":QuizQuestionWhereUniqueInput}),
  create: t.field({"required":true,"type":QuizQuestionCreateWithoutQuizInput}),
});
export const QuizQuestionCreateOrConnectWithoutQuizInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizQuestionCreateOrConnectWithoutQuizInput>, false>('QuizQuestionCreateOrConnectWithoutQuizInput').implement({
  fields: QuizQuestionCreateOrConnectWithoutQuizInputFields,
});

export const QuizQuestionCreateManyQuizInputEnvelopeFields = (t: any) => ({
  data: t.field({"required":true,"type":[QuizQuestionCreateManyQuizInput]}),
  skipDuplicates: t.boolean({"required":false}),
});
export const QuizQuestionCreateManyQuizInputEnvelope = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizQuestionCreateManyQuizInputEnvelope>, false>('QuizQuestionCreateManyQuizInputEnvelope').implement({
  fields: QuizQuestionCreateManyQuizInputEnvelopeFields,
});

export const QuizAttemptCreateWithoutQuizInputFields = (t: any) => ({
  id: t.string({"required":false}),
  passed: t.boolean({"required":true}),
  takenAt: t.field({"required":false,"type":DateTime}),
  user: t.field({"required":true,"type":UserCreateNestedOneWithoutQuizAttemptsInput}),
  answers: t.field({"required":false,"type":QuizAttemptAnswerCreateNestedManyWithoutAttemptInput}),
});
export const QuizAttemptCreateWithoutQuizInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptCreateWithoutQuizInput>, false>('QuizAttemptCreateWithoutQuizInput').implement({
  fields: QuizAttemptCreateWithoutQuizInputFields,
});

export const QuizAttemptCreateOrConnectWithoutQuizInputFields = (t: any) => ({
  where: t.field({"required":true,"type":QuizAttemptWhereUniqueInput}),
  create: t.field({"required":true,"type":QuizAttemptCreateWithoutQuizInput}),
});
export const QuizAttemptCreateOrConnectWithoutQuizInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptCreateOrConnectWithoutQuizInput>, false>('QuizAttemptCreateOrConnectWithoutQuizInput').implement({
  fields: QuizAttemptCreateOrConnectWithoutQuizInputFields,
});

export const QuizAttemptCreateManyQuizInputEnvelopeFields = (t: any) => ({
  data: t.field({"required":true,"type":[QuizAttemptCreateManyQuizInput]}),
  skipDuplicates: t.boolean({"required":false}),
});
export const QuizAttemptCreateManyQuizInputEnvelope = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptCreateManyQuizInputEnvelope>, false>('QuizAttemptCreateManyQuizInputEnvelope').implement({
  fields: QuizAttemptCreateManyQuizInputEnvelopeFields,
});

export const SkillNodeUpsertWithoutQuizInputFields = (t: any) => ({
  update: t.field({"required":true,"type":SkillNodeUpdateWithoutQuizInput}),
  create: t.field({"required":true,"type":SkillNodeCreateWithoutQuizInput}),
  where: t.field({"required":false,"type":SkillNodeWhereInput}),
});
export const SkillNodeUpsertWithoutQuizInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeUpsertWithoutQuizInput>, false>('SkillNodeUpsertWithoutQuizInput').implement({
  fields: SkillNodeUpsertWithoutQuizInputFields,
});

export const SkillNodeUpdateToOneWithWhereWithoutQuizInputFields = (t: any) => ({
  where: t.field({"required":false,"type":SkillNodeWhereInput}),
  data: t.field({"required":true,"type":SkillNodeUpdateWithoutQuizInput}),
});
export const SkillNodeUpdateToOneWithWhereWithoutQuizInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeUpdateToOneWithWhereWithoutQuizInput>, false>('SkillNodeUpdateToOneWithWhereWithoutQuizInput').implement({
  fields: SkillNodeUpdateToOneWithWhereWithoutQuizInputFields,
});

export const SkillNodeUpdateWithoutQuizInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  title: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  step: t.field({"required":false,"type":IntFieldUpdateOperationsInput}),
  orderInStep: t.field({"required":false,"type":IntFieldUpdateOperationsInput}),
  posX: t.field({"required":false,"type":NullableIntFieldUpdateOperationsInput}),
  posY: t.field({"required":false,"type":NullableIntFieldUpdateOperationsInput}),
  createdAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updatedAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  deletedAt: t.field({"required":false,"type":NullableDateTimeFieldUpdateOperationsInput}),
  tree: t.field({"required":false,"type":SkillTreeUpdateOneRequiredWithoutNodesNestedInput}),
  lessons: t.field({"required":false,"type":LessonBlocksUpdateManyWithoutNodeNestedInput}),
  prerequisites: t.field({"required":false,"type":SkillNodePrerequisiteUpdateManyWithoutNodeNestedInput}),
  requiredFor: t.field({"required":false,"type":SkillNodePrerequisiteUpdateManyWithoutDependsOnNestedInput}),
  progresses: t.field({"required":false,"type":UserNodeProgressUpdateManyWithoutNodeNestedInput}),
});
export const SkillNodeUpdateWithoutQuizInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeUpdateWithoutQuizInput>, false>('SkillNodeUpdateWithoutQuizInput').implement({
  fields: SkillNodeUpdateWithoutQuizInputFields,
});

export const QuizQuestionUpsertWithWhereUniqueWithoutQuizInputFields = (t: any) => ({
  where: t.field({"required":true,"type":QuizQuestionWhereUniqueInput}),
  update: t.field({"required":true,"type":QuizQuestionUpdateWithoutQuizInput}),
  create: t.field({"required":true,"type":QuizQuestionCreateWithoutQuizInput}),
});
export const QuizQuestionUpsertWithWhereUniqueWithoutQuizInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizQuestionUpsertWithWhereUniqueWithoutQuizInput>, false>('QuizQuestionUpsertWithWhereUniqueWithoutQuizInput').implement({
  fields: QuizQuestionUpsertWithWhereUniqueWithoutQuizInputFields,
});

export const QuizQuestionUpdateWithWhereUniqueWithoutQuizInputFields = (t: any) => ({
  where: t.field({"required":true,"type":QuizQuestionWhereUniqueInput}),
  data: t.field({"required":true,"type":QuizQuestionUpdateWithoutQuizInput}),
});
export const QuizQuestionUpdateWithWhereUniqueWithoutQuizInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizQuestionUpdateWithWhereUniqueWithoutQuizInput>, false>('QuizQuestionUpdateWithWhereUniqueWithoutQuizInput').implement({
  fields: QuizQuestionUpdateWithWhereUniqueWithoutQuizInputFields,
});

export const QuizQuestionUpdateManyWithWhereWithoutQuizInputFields = (t: any) => ({
  where: t.field({"required":true,"type":QuizQuestionScalarWhereInput}),
  data: t.field({"required":true,"type":QuizQuestionUpdateManyMutationInput}),
});
export const QuizQuestionUpdateManyWithWhereWithoutQuizInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizQuestionUpdateManyWithWhereWithoutQuizInput>, false>('QuizQuestionUpdateManyWithWhereWithoutQuizInput').implement({
  fields: QuizQuestionUpdateManyWithWhereWithoutQuizInputFields,
});

export const QuizQuestionScalarWhereInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[QuizQuestionScalarWhereInput]}),
  OR: t.field({"required":false,"type":[QuizQuestionScalarWhereInput]}),
  NOT: t.field({"required":false,"type":[QuizQuestionScalarWhereInput]}),
  id: t.field({"required":false,"type":UuidFilter}),
  quizId: t.field({"required":false,"type":UuidFilter}),
  type: t.field({"required":false,"type":EnumQuestionTypeFilter}),
  prompt: t.field({"required":false,"type":StringFilter}),
  order: t.field({"required":false,"type":IntFilter}),
  createdAt: t.field({"required":false,"type":DateTimeFilter}),
  updatedAt: t.field({"required":false,"type":DateTimeFilter}),
});
export const QuizQuestionScalarWhereInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizQuestionScalarWhereInput>, false>('QuizQuestionScalarWhereInput').implement({
  fields: QuizQuestionScalarWhereInputFields,
});

export const QuizAttemptUpsertWithWhereUniqueWithoutQuizInputFields = (t: any) => ({
  where: t.field({"required":true,"type":QuizAttemptWhereUniqueInput}),
  update: t.field({"required":true,"type":QuizAttemptUpdateWithoutQuizInput}),
  create: t.field({"required":true,"type":QuizAttemptCreateWithoutQuizInput}),
});
export const QuizAttemptUpsertWithWhereUniqueWithoutQuizInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptUpsertWithWhereUniqueWithoutQuizInput>, false>('QuizAttemptUpsertWithWhereUniqueWithoutQuizInput').implement({
  fields: QuizAttemptUpsertWithWhereUniqueWithoutQuizInputFields,
});

export const QuizAttemptUpdateWithWhereUniqueWithoutQuizInputFields = (t: any) => ({
  where: t.field({"required":true,"type":QuizAttemptWhereUniqueInput}),
  data: t.field({"required":true,"type":QuizAttemptUpdateWithoutQuizInput}),
});
export const QuizAttemptUpdateWithWhereUniqueWithoutQuizInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptUpdateWithWhereUniqueWithoutQuizInput>, false>('QuizAttemptUpdateWithWhereUniqueWithoutQuizInput').implement({
  fields: QuizAttemptUpdateWithWhereUniqueWithoutQuizInputFields,
});

export const QuizAttemptUpdateManyWithWhereWithoutQuizInputFields = (t: any) => ({
  where: t.field({"required":true,"type":QuizAttemptScalarWhereInput}),
  data: t.field({"required":true,"type":QuizAttemptUpdateManyMutationInput}),
});
export const QuizAttemptUpdateManyWithWhereWithoutQuizInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptUpdateManyWithWhereWithoutQuizInput>, false>('QuizAttemptUpdateManyWithWhereWithoutQuizInput').implement({
  fields: QuizAttemptUpdateManyWithWhereWithoutQuizInputFields,
});

export const QuizCreateWithoutQuestionsInputFields = (t: any) => ({
  id: t.string({"required":false}),
  title: t.string({"required":false}),
  required: t.boolean({"required":false}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  deletedAt: t.field({"required":false,"type":DateTime}),
  node: t.field({"required":true,"type":SkillNodeCreateNestedOneWithoutQuizInput}),
  attempts: t.field({"required":false,"type":QuizAttemptCreateNestedManyWithoutQuizInput}),
});
export const QuizCreateWithoutQuestionsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizCreateWithoutQuestionsInput>, false>('QuizCreateWithoutQuestionsInput').implement({
  fields: QuizCreateWithoutQuestionsInputFields,
});

export const QuizCreateOrConnectWithoutQuestionsInputFields = (t: any) => ({
  where: t.field({"required":true,"type":QuizWhereUniqueInput}),
  create: t.field({"required":true,"type":QuizCreateWithoutQuestionsInput}),
});
export const QuizCreateOrConnectWithoutQuestionsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizCreateOrConnectWithoutQuestionsInput>, false>('QuizCreateOrConnectWithoutQuestionsInput').implement({
  fields: QuizCreateOrConnectWithoutQuestionsInputFields,
});

export const QuizOptionCreateWithoutQuestionInputFields = (t: any) => ({
  id: t.string({"required":false}),
  text: t.string({"required":true}),
  isCorrect: t.boolean({"required":false}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
});
export const QuizOptionCreateWithoutQuestionInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizOptionCreateWithoutQuestionInput>, false>('QuizOptionCreateWithoutQuestionInput').implement({
  fields: QuizOptionCreateWithoutQuestionInputFields,
});

export const QuizOptionCreateOrConnectWithoutQuestionInputFields = (t: any) => ({
  where: t.field({"required":true,"type":QuizOptionWhereUniqueInput}),
  create: t.field({"required":true,"type":QuizOptionCreateWithoutQuestionInput}),
});
export const QuizOptionCreateOrConnectWithoutQuestionInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizOptionCreateOrConnectWithoutQuestionInput>, false>('QuizOptionCreateOrConnectWithoutQuestionInput').implement({
  fields: QuizOptionCreateOrConnectWithoutQuestionInputFields,
});

export const QuizOptionCreateManyQuestionInputEnvelopeFields = (t: any) => ({
  data: t.field({"required":true,"type":[QuizOptionCreateManyQuestionInput]}),
  skipDuplicates: t.boolean({"required":false}),
});
export const QuizOptionCreateManyQuestionInputEnvelope = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizOptionCreateManyQuestionInputEnvelope>, false>('QuizOptionCreateManyQuestionInputEnvelope').implement({
  fields: QuizOptionCreateManyQuestionInputEnvelopeFields,
});

export const QuizAttemptAnswerCreateWithoutQuestionInputFields = (t: any) => ({
  id: t.string({"required":false}),
  answer: t.field({"required":false,"type":Json}),
  isCorrect: t.boolean({"required":false}),
  attempt: t.field({"required":true,"type":QuizAttemptCreateNestedOneWithoutAnswersInput}),
});
export const QuizAttemptAnswerCreateWithoutQuestionInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptAnswerCreateWithoutQuestionInput>, false>('QuizAttemptAnswerCreateWithoutQuestionInput').implement({
  fields: QuizAttemptAnswerCreateWithoutQuestionInputFields,
});

export const QuizAttemptAnswerCreateOrConnectWithoutQuestionInputFields = (t: any) => ({
  where: t.field({"required":true,"type":QuizAttemptAnswerWhereUniqueInput}),
  create: t.field({"required":true,"type":QuizAttemptAnswerCreateWithoutQuestionInput}),
});
export const QuizAttemptAnswerCreateOrConnectWithoutQuestionInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptAnswerCreateOrConnectWithoutQuestionInput>, false>('QuizAttemptAnswerCreateOrConnectWithoutQuestionInput').implement({
  fields: QuizAttemptAnswerCreateOrConnectWithoutQuestionInputFields,
});

export const QuizAttemptAnswerCreateManyQuestionInputEnvelopeFields = (t: any) => ({
  data: t.field({"required":true,"type":[QuizAttemptAnswerCreateManyQuestionInput]}),
  skipDuplicates: t.boolean({"required":false}),
});
export const QuizAttemptAnswerCreateManyQuestionInputEnvelope = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptAnswerCreateManyQuestionInputEnvelope>, false>('QuizAttemptAnswerCreateManyQuestionInputEnvelope').implement({
  fields: QuizAttemptAnswerCreateManyQuestionInputEnvelopeFields,
});

export const QuizUpsertWithoutQuestionsInputFields = (t: any) => ({
  update: t.field({"required":true,"type":QuizUpdateWithoutQuestionsInput}),
  create: t.field({"required":true,"type":QuizCreateWithoutQuestionsInput}),
  where: t.field({"required":false,"type":QuizWhereInput}),
});
export const QuizUpsertWithoutQuestionsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizUpsertWithoutQuestionsInput>, false>('QuizUpsertWithoutQuestionsInput').implement({
  fields: QuizUpsertWithoutQuestionsInputFields,
});

export const QuizUpdateToOneWithWhereWithoutQuestionsInputFields = (t: any) => ({
  where: t.field({"required":false,"type":QuizWhereInput}),
  data: t.field({"required":true,"type":QuizUpdateWithoutQuestionsInput}),
});
export const QuizUpdateToOneWithWhereWithoutQuestionsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizUpdateToOneWithWhereWithoutQuestionsInput>, false>('QuizUpdateToOneWithWhereWithoutQuestionsInput').implement({
  fields: QuizUpdateToOneWithWhereWithoutQuestionsInputFields,
});

export const QuizUpdateWithoutQuestionsInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  title: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  required: t.field({"required":false,"type":BoolFieldUpdateOperationsInput}),
  createdAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updatedAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  deletedAt: t.field({"required":false,"type":NullableDateTimeFieldUpdateOperationsInput}),
  node: t.field({"required":false,"type":SkillNodeUpdateOneRequiredWithoutQuizNestedInput}),
  attempts: t.field({"required":false,"type":QuizAttemptUpdateManyWithoutQuizNestedInput}),
});
export const QuizUpdateWithoutQuestionsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizUpdateWithoutQuestionsInput>, false>('QuizUpdateWithoutQuestionsInput').implement({
  fields: QuizUpdateWithoutQuestionsInputFields,
});

export const QuizOptionUpsertWithWhereUniqueWithoutQuestionInputFields = (t: any) => ({
  where: t.field({"required":true,"type":QuizOptionWhereUniqueInput}),
  update: t.field({"required":true,"type":QuizOptionUpdateWithoutQuestionInput}),
  create: t.field({"required":true,"type":QuizOptionCreateWithoutQuestionInput}),
});
export const QuizOptionUpsertWithWhereUniqueWithoutQuestionInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizOptionUpsertWithWhereUniqueWithoutQuestionInput>, false>('QuizOptionUpsertWithWhereUniqueWithoutQuestionInput').implement({
  fields: QuizOptionUpsertWithWhereUniqueWithoutQuestionInputFields,
});

export const QuizOptionUpdateWithWhereUniqueWithoutQuestionInputFields = (t: any) => ({
  where: t.field({"required":true,"type":QuizOptionWhereUniqueInput}),
  data: t.field({"required":true,"type":QuizOptionUpdateWithoutQuestionInput}),
});
export const QuizOptionUpdateWithWhereUniqueWithoutQuestionInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizOptionUpdateWithWhereUniqueWithoutQuestionInput>, false>('QuizOptionUpdateWithWhereUniqueWithoutQuestionInput').implement({
  fields: QuizOptionUpdateWithWhereUniqueWithoutQuestionInputFields,
});

export const QuizOptionUpdateManyWithWhereWithoutQuestionInputFields = (t: any) => ({
  where: t.field({"required":true,"type":QuizOptionScalarWhereInput}),
  data: t.field({"required":true,"type":QuizOptionUpdateManyMutationInput}),
});
export const QuizOptionUpdateManyWithWhereWithoutQuestionInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizOptionUpdateManyWithWhereWithoutQuestionInput>, false>('QuizOptionUpdateManyWithWhereWithoutQuestionInput').implement({
  fields: QuizOptionUpdateManyWithWhereWithoutQuestionInputFields,
});

export const QuizOptionScalarWhereInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[QuizOptionScalarWhereInput]}),
  OR: t.field({"required":false,"type":[QuizOptionScalarWhereInput]}),
  NOT: t.field({"required":false,"type":[QuizOptionScalarWhereInput]}),
  id: t.field({"required":false,"type":UuidFilter}),
  questionId: t.field({"required":false,"type":UuidFilter}),
  text: t.field({"required":false,"type":StringFilter}),
  isCorrect: t.field({"required":false,"type":BoolFilter}),
  createdAt: t.field({"required":false,"type":DateTimeFilter}),
  updatedAt: t.field({"required":false,"type":DateTimeFilter}),
});
export const QuizOptionScalarWhereInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizOptionScalarWhereInput>, false>('QuizOptionScalarWhereInput').implement({
  fields: QuizOptionScalarWhereInputFields,
});

export const QuizAttemptAnswerUpsertWithWhereUniqueWithoutQuestionInputFields = (t: any) => ({
  where: t.field({"required":true,"type":QuizAttemptAnswerWhereUniqueInput}),
  update: t.field({"required":true,"type":QuizAttemptAnswerUpdateWithoutQuestionInput}),
  create: t.field({"required":true,"type":QuizAttemptAnswerCreateWithoutQuestionInput}),
});
export const QuizAttemptAnswerUpsertWithWhereUniqueWithoutQuestionInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptAnswerUpsertWithWhereUniqueWithoutQuestionInput>, false>('QuizAttemptAnswerUpsertWithWhereUniqueWithoutQuestionInput').implement({
  fields: QuizAttemptAnswerUpsertWithWhereUniqueWithoutQuestionInputFields,
});

export const QuizAttemptAnswerUpdateWithWhereUniqueWithoutQuestionInputFields = (t: any) => ({
  where: t.field({"required":true,"type":QuizAttemptAnswerWhereUniqueInput}),
  data: t.field({"required":true,"type":QuizAttemptAnswerUpdateWithoutQuestionInput}),
});
export const QuizAttemptAnswerUpdateWithWhereUniqueWithoutQuestionInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptAnswerUpdateWithWhereUniqueWithoutQuestionInput>, false>('QuizAttemptAnswerUpdateWithWhereUniqueWithoutQuestionInput').implement({
  fields: QuizAttemptAnswerUpdateWithWhereUniqueWithoutQuestionInputFields,
});

export const QuizAttemptAnswerUpdateManyWithWhereWithoutQuestionInputFields = (t: any) => ({
  where: t.field({"required":true,"type":QuizAttemptAnswerScalarWhereInput}),
  data: t.field({"required":true,"type":QuizAttemptAnswerUpdateManyMutationInput}),
});
export const QuizAttemptAnswerUpdateManyWithWhereWithoutQuestionInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptAnswerUpdateManyWithWhereWithoutQuestionInput>, false>('QuizAttemptAnswerUpdateManyWithWhereWithoutQuestionInput').implement({
  fields: QuizAttemptAnswerUpdateManyWithWhereWithoutQuestionInputFields,
});

export const QuizAttemptAnswerScalarWhereInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[QuizAttemptAnswerScalarWhereInput]}),
  OR: t.field({"required":false,"type":[QuizAttemptAnswerScalarWhereInput]}),
  NOT: t.field({"required":false,"type":[QuizAttemptAnswerScalarWhereInput]}),
  id: t.field({"required":false,"type":UuidFilter}),
  attemptId: t.field({"required":false,"type":UuidFilter}),
  questionId: t.field({"required":false,"type":UuidFilter}),
  answer: t.field({"required":false,"type":JsonNullableFilter}),
  isCorrect: t.field({"required":false,"type":BoolNullableFilter}),
});
export const QuizAttemptAnswerScalarWhereInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptAnswerScalarWhereInput>, false>('QuizAttemptAnswerScalarWhereInput').implement({
  fields: QuizAttemptAnswerScalarWhereInputFields,
});

export const QuizQuestionCreateWithoutOptionsInputFields = (t: any) => ({
  id: t.string({"required":false}),
  type: t.field({"required":true,"type":QuestionType}),
  prompt: t.string({"required":true}),
  order: t.int({"required":false}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  quiz: t.field({"required":true,"type":QuizCreateNestedOneWithoutQuestionsInput}),
  answers: t.field({"required":false,"type":QuizAttemptAnswerCreateNestedManyWithoutQuestionInput}),
});
export const QuizQuestionCreateWithoutOptionsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizQuestionCreateWithoutOptionsInput>, false>('QuizQuestionCreateWithoutOptionsInput').implement({
  fields: QuizQuestionCreateWithoutOptionsInputFields,
});

export const QuizQuestionCreateOrConnectWithoutOptionsInputFields = (t: any) => ({
  where: t.field({"required":true,"type":QuizQuestionWhereUniqueInput}),
  create: t.field({"required":true,"type":QuizQuestionCreateWithoutOptionsInput}),
});
export const QuizQuestionCreateOrConnectWithoutOptionsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizQuestionCreateOrConnectWithoutOptionsInput>, false>('QuizQuestionCreateOrConnectWithoutOptionsInput').implement({
  fields: QuizQuestionCreateOrConnectWithoutOptionsInputFields,
});

export const QuizQuestionUpsertWithoutOptionsInputFields = (t: any) => ({
  update: t.field({"required":true,"type":QuizQuestionUpdateWithoutOptionsInput}),
  create: t.field({"required":true,"type":QuizQuestionCreateWithoutOptionsInput}),
  where: t.field({"required":false,"type":QuizQuestionWhereInput}),
});
export const QuizQuestionUpsertWithoutOptionsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizQuestionUpsertWithoutOptionsInput>, false>('QuizQuestionUpsertWithoutOptionsInput').implement({
  fields: QuizQuestionUpsertWithoutOptionsInputFields,
});

export const QuizQuestionUpdateToOneWithWhereWithoutOptionsInputFields = (t: any) => ({
  where: t.field({"required":false,"type":QuizQuestionWhereInput}),
  data: t.field({"required":true,"type":QuizQuestionUpdateWithoutOptionsInput}),
});
export const QuizQuestionUpdateToOneWithWhereWithoutOptionsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizQuestionUpdateToOneWithWhereWithoutOptionsInput>, false>('QuizQuestionUpdateToOneWithWhereWithoutOptionsInput').implement({
  fields: QuizQuestionUpdateToOneWithWhereWithoutOptionsInputFields,
});

export const QuizQuestionUpdateWithoutOptionsInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  type: t.field({"required":false,"type":EnumQuestionTypeFieldUpdateOperationsInput}),
  prompt: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  order: t.field({"required":false,"type":IntFieldUpdateOperationsInput}),
  createdAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updatedAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  quiz: t.field({"required":false,"type":QuizUpdateOneRequiredWithoutQuestionsNestedInput}),
  answers: t.field({"required":false,"type":QuizAttemptAnswerUpdateManyWithoutQuestionNestedInput}),
});
export const QuizQuestionUpdateWithoutOptionsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizQuestionUpdateWithoutOptionsInput>, false>('QuizQuestionUpdateWithoutOptionsInput').implement({
  fields: QuizQuestionUpdateWithoutOptionsInputFields,
});

export const QuizCreateWithoutAttemptsInputFields = (t: any) => ({
  id: t.string({"required":false}),
  title: t.string({"required":false}),
  required: t.boolean({"required":false}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  deletedAt: t.field({"required":false,"type":DateTime}),
  node: t.field({"required":true,"type":SkillNodeCreateNestedOneWithoutQuizInput}),
  questions: t.field({"required":false,"type":QuizQuestionCreateNestedManyWithoutQuizInput}),
});
export const QuizCreateWithoutAttemptsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizCreateWithoutAttemptsInput>, false>('QuizCreateWithoutAttemptsInput').implement({
  fields: QuizCreateWithoutAttemptsInputFields,
});

export const QuizCreateOrConnectWithoutAttemptsInputFields = (t: any) => ({
  where: t.field({"required":true,"type":QuizWhereUniqueInput}),
  create: t.field({"required":true,"type":QuizCreateWithoutAttemptsInput}),
});
export const QuizCreateOrConnectWithoutAttemptsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizCreateOrConnectWithoutAttemptsInput>, false>('QuizCreateOrConnectWithoutAttemptsInput').implement({
  fields: QuizCreateOrConnectWithoutAttemptsInputFields,
});

export const UserCreateWithoutQuizAttemptsInputFields = (t: any) => ({
  id: t.string({"required":true}),
  email: t.string({"required":true}),
  name: t.string({"required":false}),
  photoUrl: t.string({"required":false}),
  role: t.field({"required":false,"type":Role}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  coursesAuthored: t.field({"required":false,"type":CourseCreateNestedManyWithoutAuthorInput}),
  nodeProgress: t.field({"required":false,"type":UserNodeProgressCreateNestedManyWithoutUserInput}),
});
export const UserCreateWithoutQuizAttemptsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserCreateWithoutQuizAttemptsInput>, false>('UserCreateWithoutQuizAttemptsInput').implement({
  fields: UserCreateWithoutQuizAttemptsInputFields,
});

export const UserCreateOrConnectWithoutQuizAttemptsInputFields = (t: any) => ({
  where: t.field({"required":true,"type":UserWhereUniqueInput}),
  create: t.field({"required":true,"type":UserCreateWithoutQuizAttemptsInput}),
});
export const UserCreateOrConnectWithoutQuizAttemptsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserCreateOrConnectWithoutQuizAttemptsInput>, false>('UserCreateOrConnectWithoutQuizAttemptsInput').implement({
  fields: UserCreateOrConnectWithoutQuizAttemptsInputFields,
});

export const QuizAttemptAnswerCreateWithoutAttemptInputFields = (t: any) => ({
  id: t.string({"required":false}),
  answer: t.field({"required":false,"type":Json}),
  isCorrect: t.boolean({"required":false}),
  question: t.field({"required":true,"type":QuizQuestionCreateNestedOneWithoutAnswersInput}),
});
export const QuizAttemptAnswerCreateWithoutAttemptInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptAnswerCreateWithoutAttemptInput>, false>('QuizAttemptAnswerCreateWithoutAttemptInput').implement({
  fields: QuizAttemptAnswerCreateWithoutAttemptInputFields,
});

export const QuizAttemptAnswerCreateOrConnectWithoutAttemptInputFields = (t: any) => ({
  where: t.field({"required":true,"type":QuizAttemptAnswerWhereUniqueInput}),
  create: t.field({"required":true,"type":QuizAttemptAnswerCreateWithoutAttemptInput}),
});
export const QuizAttemptAnswerCreateOrConnectWithoutAttemptInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptAnswerCreateOrConnectWithoutAttemptInput>, false>('QuizAttemptAnswerCreateOrConnectWithoutAttemptInput').implement({
  fields: QuizAttemptAnswerCreateOrConnectWithoutAttemptInputFields,
});

export const QuizAttemptAnswerCreateManyAttemptInputEnvelopeFields = (t: any) => ({
  data: t.field({"required":true,"type":[QuizAttemptAnswerCreateManyAttemptInput]}),
  skipDuplicates: t.boolean({"required":false}),
});
export const QuizAttemptAnswerCreateManyAttemptInputEnvelope = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptAnswerCreateManyAttemptInputEnvelope>, false>('QuizAttemptAnswerCreateManyAttemptInputEnvelope').implement({
  fields: QuizAttemptAnswerCreateManyAttemptInputEnvelopeFields,
});

export const QuizUpsertWithoutAttemptsInputFields = (t: any) => ({
  update: t.field({"required":true,"type":QuizUpdateWithoutAttemptsInput}),
  create: t.field({"required":true,"type":QuizCreateWithoutAttemptsInput}),
  where: t.field({"required":false,"type":QuizWhereInput}),
});
export const QuizUpsertWithoutAttemptsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizUpsertWithoutAttemptsInput>, false>('QuizUpsertWithoutAttemptsInput').implement({
  fields: QuizUpsertWithoutAttemptsInputFields,
});

export const QuizUpdateToOneWithWhereWithoutAttemptsInputFields = (t: any) => ({
  where: t.field({"required":false,"type":QuizWhereInput}),
  data: t.field({"required":true,"type":QuizUpdateWithoutAttemptsInput}),
});
export const QuizUpdateToOneWithWhereWithoutAttemptsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizUpdateToOneWithWhereWithoutAttemptsInput>, false>('QuizUpdateToOneWithWhereWithoutAttemptsInput').implement({
  fields: QuizUpdateToOneWithWhereWithoutAttemptsInputFields,
});

export const QuizUpdateWithoutAttemptsInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  title: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  required: t.field({"required":false,"type":BoolFieldUpdateOperationsInput}),
  createdAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updatedAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  deletedAt: t.field({"required":false,"type":NullableDateTimeFieldUpdateOperationsInput}),
  node: t.field({"required":false,"type":SkillNodeUpdateOneRequiredWithoutQuizNestedInput}),
  questions: t.field({"required":false,"type":QuizQuestionUpdateManyWithoutQuizNestedInput}),
});
export const QuizUpdateWithoutAttemptsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizUpdateWithoutAttemptsInput>, false>('QuizUpdateWithoutAttemptsInput').implement({
  fields: QuizUpdateWithoutAttemptsInputFields,
});

export const UserUpsertWithoutQuizAttemptsInputFields = (t: any) => ({
  update: t.field({"required":true,"type":UserUpdateWithoutQuizAttemptsInput}),
  create: t.field({"required":true,"type":UserCreateWithoutQuizAttemptsInput}),
  where: t.field({"required":false,"type":UserWhereInput}),
});
export const UserUpsertWithoutQuizAttemptsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserUpsertWithoutQuizAttemptsInput>, false>('UserUpsertWithoutQuizAttemptsInput').implement({
  fields: UserUpsertWithoutQuizAttemptsInputFields,
});

export const UserUpdateToOneWithWhereWithoutQuizAttemptsInputFields = (t: any) => ({
  where: t.field({"required":false,"type":UserWhereInput}),
  data: t.field({"required":true,"type":UserUpdateWithoutQuizAttemptsInput}),
});
export const UserUpdateToOneWithWhereWithoutQuizAttemptsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserUpdateToOneWithWhereWithoutQuizAttemptsInput>, false>('UserUpdateToOneWithWhereWithoutQuizAttemptsInput').implement({
  fields: UserUpdateToOneWithWhereWithoutQuizAttemptsInputFields,
});

export const UserUpdateWithoutQuizAttemptsInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  email: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  name: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  photoUrl: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  role: t.field({"required":false,"type":EnumRoleFieldUpdateOperationsInput}),
  createdAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updatedAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  coursesAuthored: t.field({"required":false,"type":CourseUpdateManyWithoutAuthorNestedInput}),
  nodeProgress: t.field({"required":false,"type":UserNodeProgressUpdateManyWithoutUserNestedInput}),
});
export const UserUpdateWithoutQuizAttemptsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserUpdateWithoutQuizAttemptsInput>, false>('UserUpdateWithoutQuizAttemptsInput').implement({
  fields: UserUpdateWithoutQuizAttemptsInputFields,
});

export const QuizAttemptAnswerUpsertWithWhereUniqueWithoutAttemptInputFields = (t: any) => ({
  where: t.field({"required":true,"type":QuizAttemptAnswerWhereUniqueInput}),
  update: t.field({"required":true,"type":QuizAttemptAnswerUpdateWithoutAttemptInput}),
  create: t.field({"required":true,"type":QuizAttemptAnswerCreateWithoutAttemptInput}),
});
export const QuizAttemptAnswerUpsertWithWhereUniqueWithoutAttemptInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptAnswerUpsertWithWhereUniqueWithoutAttemptInput>, false>('QuizAttemptAnswerUpsertWithWhereUniqueWithoutAttemptInput').implement({
  fields: QuizAttemptAnswerUpsertWithWhereUniqueWithoutAttemptInputFields,
});

export const QuizAttemptAnswerUpdateWithWhereUniqueWithoutAttemptInputFields = (t: any) => ({
  where: t.field({"required":true,"type":QuizAttemptAnswerWhereUniqueInput}),
  data: t.field({"required":true,"type":QuizAttemptAnswerUpdateWithoutAttemptInput}),
});
export const QuizAttemptAnswerUpdateWithWhereUniqueWithoutAttemptInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptAnswerUpdateWithWhereUniqueWithoutAttemptInput>, false>('QuizAttemptAnswerUpdateWithWhereUniqueWithoutAttemptInput').implement({
  fields: QuizAttemptAnswerUpdateWithWhereUniqueWithoutAttemptInputFields,
});

export const QuizAttemptAnswerUpdateManyWithWhereWithoutAttemptInputFields = (t: any) => ({
  where: t.field({"required":true,"type":QuizAttemptAnswerScalarWhereInput}),
  data: t.field({"required":true,"type":QuizAttemptAnswerUpdateManyMutationInput}),
});
export const QuizAttemptAnswerUpdateManyWithWhereWithoutAttemptInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptAnswerUpdateManyWithWhereWithoutAttemptInput>, false>('QuizAttemptAnswerUpdateManyWithWhereWithoutAttemptInput').implement({
  fields: QuizAttemptAnswerUpdateManyWithWhereWithoutAttemptInputFields,
});

export const QuizAttemptCreateWithoutAnswersInputFields = (t: any) => ({
  id: t.string({"required":false}),
  passed: t.boolean({"required":true}),
  takenAt: t.field({"required":false,"type":DateTime}),
  quiz: t.field({"required":true,"type":QuizCreateNestedOneWithoutAttemptsInput}),
  user: t.field({"required":true,"type":UserCreateNestedOneWithoutQuizAttemptsInput}),
});
export const QuizAttemptCreateWithoutAnswersInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptCreateWithoutAnswersInput>, false>('QuizAttemptCreateWithoutAnswersInput').implement({
  fields: QuizAttemptCreateWithoutAnswersInputFields,
});

export const QuizAttemptCreateOrConnectWithoutAnswersInputFields = (t: any) => ({
  where: t.field({"required":true,"type":QuizAttemptWhereUniqueInput}),
  create: t.field({"required":true,"type":QuizAttemptCreateWithoutAnswersInput}),
});
export const QuizAttemptCreateOrConnectWithoutAnswersInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptCreateOrConnectWithoutAnswersInput>, false>('QuizAttemptCreateOrConnectWithoutAnswersInput').implement({
  fields: QuizAttemptCreateOrConnectWithoutAnswersInputFields,
});

export const QuizQuestionCreateWithoutAnswersInputFields = (t: any) => ({
  id: t.string({"required":false}),
  type: t.field({"required":true,"type":QuestionType}),
  prompt: t.string({"required":true}),
  order: t.int({"required":false}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  quiz: t.field({"required":true,"type":QuizCreateNestedOneWithoutQuestionsInput}),
  options: t.field({"required":false,"type":QuizOptionCreateNestedManyWithoutQuestionInput}),
});
export const QuizQuestionCreateWithoutAnswersInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizQuestionCreateWithoutAnswersInput>, false>('QuizQuestionCreateWithoutAnswersInput').implement({
  fields: QuizQuestionCreateWithoutAnswersInputFields,
});

export const QuizQuestionCreateOrConnectWithoutAnswersInputFields = (t: any) => ({
  where: t.field({"required":true,"type":QuizQuestionWhereUniqueInput}),
  create: t.field({"required":true,"type":QuizQuestionCreateWithoutAnswersInput}),
});
export const QuizQuestionCreateOrConnectWithoutAnswersInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizQuestionCreateOrConnectWithoutAnswersInput>, false>('QuizQuestionCreateOrConnectWithoutAnswersInput').implement({
  fields: QuizQuestionCreateOrConnectWithoutAnswersInputFields,
});

export const QuizAttemptUpsertWithoutAnswersInputFields = (t: any) => ({
  update: t.field({"required":true,"type":QuizAttemptUpdateWithoutAnswersInput}),
  create: t.field({"required":true,"type":QuizAttemptCreateWithoutAnswersInput}),
  where: t.field({"required":false,"type":QuizAttemptWhereInput}),
});
export const QuizAttemptUpsertWithoutAnswersInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptUpsertWithoutAnswersInput>, false>('QuizAttemptUpsertWithoutAnswersInput').implement({
  fields: QuizAttemptUpsertWithoutAnswersInputFields,
});

export const QuizAttemptUpdateToOneWithWhereWithoutAnswersInputFields = (t: any) => ({
  where: t.field({"required":false,"type":QuizAttemptWhereInput}),
  data: t.field({"required":true,"type":QuizAttemptUpdateWithoutAnswersInput}),
});
export const QuizAttemptUpdateToOneWithWhereWithoutAnswersInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptUpdateToOneWithWhereWithoutAnswersInput>, false>('QuizAttemptUpdateToOneWithWhereWithoutAnswersInput').implement({
  fields: QuizAttemptUpdateToOneWithWhereWithoutAnswersInputFields,
});

export const QuizAttemptUpdateWithoutAnswersInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  passed: t.field({"required":false,"type":BoolFieldUpdateOperationsInput}),
  takenAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  quiz: t.field({"required":false,"type":QuizUpdateOneRequiredWithoutAttemptsNestedInput}),
  user: t.field({"required":false,"type":UserUpdateOneRequiredWithoutQuizAttemptsNestedInput}),
});
export const QuizAttemptUpdateWithoutAnswersInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptUpdateWithoutAnswersInput>, false>('QuizAttemptUpdateWithoutAnswersInput').implement({
  fields: QuizAttemptUpdateWithoutAnswersInputFields,
});

export const QuizQuestionUpsertWithoutAnswersInputFields = (t: any) => ({
  update: t.field({"required":true,"type":QuizQuestionUpdateWithoutAnswersInput}),
  create: t.field({"required":true,"type":QuizQuestionCreateWithoutAnswersInput}),
  where: t.field({"required":false,"type":QuizQuestionWhereInput}),
});
export const QuizQuestionUpsertWithoutAnswersInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizQuestionUpsertWithoutAnswersInput>, false>('QuizQuestionUpsertWithoutAnswersInput').implement({
  fields: QuizQuestionUpsertWithoutAnswersInputFields,
});

export const QuizQuestionUpdateToOneWithWhereWithoutAnswersInputFields = (t: any) => ({
  where: t.field({"required":false,"type":QuizQuestionWhereInput}),
  data: t.field({"required":true,"type":QuizQuestionUpdateWithoutAnswersInput}),
});
export const QuizQuestionUpdateToOneWithWhereWithoutAnswersInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizQuestionUpdateToOneWithWhereWithoutAnswersInput>, false>('QuizQuestionUpdateToOneWithWhereWithoutAnswersInput').implement({
  fields: QuizQuestionUpdateToOneWithWhereWithoutAnswersInputFields,
});

export const QuizQuestionUpdateWithoutAnswersInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  type: t.field({"required":false,"type":EnumQuestionTypeFieldUpdateOperationsInput}),
  prompt: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  order: t.field({"required":false,"type":IntFieldUpdateOperationsInput}),
  createdAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updatedAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  quiz: t.field({"required":false,"type":QuizUpdateOneRequiredWithoutQuestionsNestedInput}),
  options: t.field({"required":false,"type":QuizOptionUpdateManyWithoutQuestionNestedInput}),
});
export const QuizQuestionUpdateWithoutAnswersInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizQuestionUpdateWithoutAnswersInput>, false>('QuizQuestionUpdateWithoutAnswersInput').implement({
  fields: QuizQuestionUpdateWithoutAnswersInputFields,
});

export const UserCreateWithoutNodeProgressInputFields = (t: any) => ({
  id: t.string({"required":true}),
  email: t.string({"required":true}),
  name: t.string({"required":false}),
  photoUrl: t.string({"required":false}),
  role: t.field({"required":false,"type":Role}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  coursesAuthored: t.field({"required":false,"type":CourseCreateNestedManyWithoutAuthorInput}),
  quizAttempts: t.field({"required":false,"type":QuizAttemptCreateNestedManyWithoutUserInput}),
});
export const UserCreateWithoutNodeProgressInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserCreateWithoutNodeProgressInput>, false>('UserCreateWithoutNodeProgressInput').implement({
  fields: UserCreateWithoutNodeProgressInputFields,
});

export const UserCreateOrConnectWithoutNodeProgressInputFields = (t: any) => ({
  where: t.field({"required":true,"type":UserWhereUniqueInput}),
  create: t.field({"required":true,"type":UserCreateWithoutNodeProgressInput}),
});
export const UserCreateOrConnectWithoutNodeProgressInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserCreateOrConnectWithoutNodeProgressInput>, false>('UserCreateOrConnectWithoutNodeProgressInput').implement({
  fields: UserCreateOrConnectWithoutNodeProgressInputFields,
});

export const SkillNodeCreateWithoutProgressesInputFields = (t: any) => ({
  id: t.string({"required":false}),
  title: t.string({"required":true}),
  step: t.int({"required":false}),
  orderInStep: t.int({"required":false}),
  posX: t.int({"required":false}),
  posY: t.int({"required":false}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  deletedAt: t.field({"required":false,"type":DateTime}),
  tree: t.field({"required":true,"type":SkillTreeCreateNestedOneWithoutNodesInput}),
  lessons: t.field({"required":false,"type":LessonBlocksCreateNestedManyWithoutNodeInput}),
  quiz: t.field({"required":false,"type":QuizCreateNestedOneWithoutNodeInput}),
  prerequisites: t.field({"required":false,"type":SkillNodePrerequisiteCreateNestedManyWithoutNodeInput}),
  requiredFor: t.field({"required":false,"type":SkillNodePrerequisiteCreateNestedManyWithoutDependsOnInput}),
});
export const SkillNodeCreateWithoutProgressesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeCreateWithoutProgressesInput>, false>('SkillNodeCreateWithoutProgressesInput').implement({
  fields: SkillNodeCreateWithoutProgressesInputFields,
});

export const SkillNodeCreateOrConnectWithoutProgressesInputFields = (t: any) => ({
  where: t.field({"required":true,"type":SkillNodeWhereUniqueInput}),
  create: t.field({"required":true,"type":SkillNodeCreateWithoutProgressesInput}),
});
export const SkillNodeCreateOrConnectWithoutProgressesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeCreateOrConnectWithoutProgressesInput>, false>('SkillNodeCreateOrConnectWithoutProgressesInput').implement({
  fields: SkillNodeCreateOrConnectWithoutProgressesInputFields,
});

export const UserUpsertWithoutNodeProgressInputFields = (t: any) => ({
  update: t.field({"required":true,"type":UserUpdateWithoutNodeProgressInput}),
  create: t.field({"required":true,"type":UserCreateWithoutNodeProgressInput}),
  where: t.field({"required":false,"type":UserWhereInput}),
});
export const UserUpsertWithoutNodeProgressInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserUpsertWithoutNodeProgressInput>, false>('UserUpsertWithoutNodeProgressInput').implement({
  fields: UserUpsertWithoutNodeProgressInputFields,
});

export const UserUpdateToOneWithWhereWithoutNodeProgressInputFields = (t: any) => ({
  where: t.field({"required":false,"type":UserWhereInput}),
  data: t.field({"required":true,"type":UserUpdateWithoutNodeProgressInput}),
});
export const UserUpdateToOneWithWhereWithoutNodeProgressInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserUpdateToOneWithWhereWithoutNodeProgressInput>, false>('UserUpdateToOneWithWhereWithoutNodeProgressInput').implement({
  fields: UserUpdateToOneWithWhereWithoutNodeProgressInputFields,
});

export const UserUpdateWithoutNodeProgressInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  email: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  name: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  photoUrl: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  role: t.field({"required":false,"type":EnumRoleFieldUpdateOperationsInput}),
  createdAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updatedAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  coursesAuthored: t.field({"required":false,"type":CourseUpdateManyWithoutAuthorNestedInput}),
  quizAttempts: t.field({"required":false,"type":QuizAttemptUpdateManyWithoutUserNestedInput}),
});
export const UserUpdateWithoutNodeProgressInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserUpdateWithoutNodeProgressInput>, false>('UserUpdateWithoutNodeProgressInput').implement({
  fields: UserUpdateWithoutNodeProgressInputFields,
});

export const SkillNodeUpsertWithoutProgressesInputFields = (t: any) => ({
  update: t.field({"required":true,"type":SkillNodeUpdateWithoutProgressesInput}),
  create: t.field({"required":true,"type":SkillNodeCreateWithoutProgressesInput}),
  where: t.field({"required":false,"type":SkillNodeWhereInput}),
});
export const SkillNodeUpsertWithoutProgressesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeUpsertWithoutProgressesInput>, false>('SkillNodeUpsertWithoutProgressesInput').implement({
  fields: SkillNodeUpsertWithoutProgressesInputFields,
});

export const SkillNodeUpdateToOneWithWhereWithoutProgressesInputFields = (t: any) => ({
  where: t.field({"required":false,"type":SkillNodeWhereInput}),
  data: t.field({"required":true,"type":SkillNodeUpdateWithoutProgressesInput}),
});
export const SkillNodeUpdateToOneWithWhereWithoutProgressesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeUpdateToOneWithWhereWithoutProgressesInput>, false>('SkillNodeUpdateToOneWithWhereWithoutProgressesInput').implement({
  fields: SkillNodeUpdateToOneWithWhereWithoutProgressesInputFields,
});

export const SkillNodeUpdateWithoutProgressesInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  title: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  step: t.field({"required":false,"type":IntFieldUpdateOperationsInput}),
  orderInStep: t.field({"required":false,"type":IntFieldUpdateOperationsInput}),
  posX: t.field({"required":false,"type":NullableIntFieldUpdateOperationsInput}),
  posY: t.field({"required":false,"type":NullableIntFieldUpdateOperationsInput}),
  createdAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updatedAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  deletedAt: t.field({"required":false,"type":NullableDateTimeFieldUpdateOperationsInput}),
  tree: t.field({"required":false,"type":SkillTreeUpdateOneRequiredWithoutNodesNestedInput}),
  lessons: t.field({"required":false,"type":LessonBlocksUpdateManyWithoutNodeNestedInput}),
  quiz: t.field({"required":false,"type":QuizUpdateOneWithoutNodeNestedInput}),
  prerequisites: t.field({"required":false,"type":SkillNodePrerequisiteUpdateManyWithoutNodeNestedInput}),
  requiredFor: t.field({"required":false,"type":SkillNodePrerequisiteUpdateManyWithoutDependsOnNestedInput}),
});
export const SkillNodeUpdateWithoutProgressesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeUpdateWithoutProgressesInput>, false>('SkillNodeUpdateWithoutProgressesInput').implement({
  fields: SkillNodeUpdateWithoutProgressesInputFields,
});

export const CourseCreateManyAuthorInputFields = (t: any) => ({
  id: t.string({"required":false}),
  title: t.string({"required":true}),
  description: t.string({"required":false}),
  status: t.field({"required":false,"type":CourseStatus}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  deletedAt: t.field({"required":false,"type":DateTime}),
});
export const CourseCreateManyAuthorInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CourseCreateManyAuthorInput>, false>('CourseCreateManyAuthorInput').implement({
  fields: CourseCreateManyAuthorInputFields,
});

export const UserNodeProgressCreateManyUserInputFields = (t: any) => ({
  id: t.string({"required":false}),
  nodeId: t.string({"required":true}),
  status: t.field({"required":false,"type":ProgressStatus}),
  completedAt: t.field({"required":false,"type":DateTime}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
});
export const UserNodeProgressCreateManyUserInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserNodeProgressCreateManyUserInput>, false>('UserNodeProgressCreateManyUserInput').implement({
  fields: UserNodeProgressCreateManyUserInputFields,
});

export const QuizAttemptCreateManyUserInputFields = (t: any) => ({
  id: t.string({"required":false}),
  quizId: t.string({"required":true}),
  passed: t.boolean({"required":true}),
  takenAt: t.field({"required":false,"type":DateTime}),
});
export const QuizAttemptCreateManyUserInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptCreateManyUserInput>, false>('QuizAttemptCreateManyUserInput').implement({
  fields: QuizAttemptCreateManyUserInputFields,
});

export const CourseUpdateWithoutAuthorInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  title: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  description: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  status: t.field({"required":false,"type":EnumCourseStatusFieldUpdateOperationsInput}),
  createdAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updatedAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  deletedAt: t.field({"required":false,"type":NullableDateTimeFieldUpdateOperationsInput}),
  trees: t.field({"required":false,"type":SkillTreeUpdateManyWithoutCourseNestedInput}),
});
export const CourseUpdateWithoutAuthorInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CourseUpdateWithoutAuthorInput>, false>('CourseUpdateWithoutAuthorInput').implement({
  fields: CourseUpdateWithoutAuthorInputFields,
});

export const UserNodeProgressUpdateWithoutUserInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  status: t.field({"required":false,"type":EnumProgressStatusFieldUpdateOperationsInput}),
  completedAt: t.field({"required":false,"type":NullableDateTimeFieldUpdateOperationsInput}),
  createdAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updatedAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  node: t.field({"required":false,"type":SkillNodeUpdateOneRequiredWithoutProgressesNestedInput}),
});
export const UserNodeProgressUpdateWithoutUserInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserNodeProgressUpdateWithoutUserInput>, false>('UserNodeProgressUpdateWithoutUserInput').implement({
  fields: UserNodeProgressUpdateWithoutUserInputFields,
});

export const QuizAttemptUpdateWithoutUserInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  passed: t.field({"required":false,"type":BoolFieldUpdateOperationsInput}),
  takenAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  quiz: t.field({"required":false,"type":QuizUpdateOneRequiredWithoutAttemptsNestedInput}),
  answers: t.field({"required":false,"type":QuizAttemptAnswerUpdateManyWithoutAttemptNestedInput}),
});
export const QuizAttemptUpdateWithoutUserInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptUpdateWithoutUserInput>, false>('QuizAttemptUpdateWithoutUserInput').implement({
  fields: QuizAttemptUpdateWithoutUserInputFields,
});

export const SkillTreeCreateManyCourseInputFields = (t: any) => ({
  id: t.string({"required":false}),
  title: t.string({"required":true}),
  description: t.string({"required":false}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  deletedAt: t.field({"required":false,"type":DateTime}),
});
export const SkillTreeCreateManyCourseInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillTreeCreateManyCourseInput>, false>('SkillTreeCreateManyCourseInput').implement({
  fields: SkillTreeCreateManyCourseInputFields,
});

export const SkillTreeUpdateWithoutCourseInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  title: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  description: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  createdAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updatedAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  deletedAt: t.field({"required":false,"type":NullableDateTimeFieldUpdateOperationsInput}),
  nodes: t.field({"required":false,"type":SkillNodeUpdateManyWithoutTreeNestedInput}),
});
export const SkillTreeUpdateWithoutCourseInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillTreeUpdateWithoutCourseInput>, false>('SkillTreeUpdateWithoutCourseInput').implement({
  fields: SkillTreeUpdateWithoutCourseInputFields,
});

export const SkillNodeCreateManyTreeInputFields = (t: any) => ({
  id: t.string({"required":false}),
  title: t.string({"required":true}),
  step: t.int({"required":false}),
  orderInStep: t.int({"required":false}),
  posX: t.int({"required":false}),
  posY: t.int({"required":false}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  deletedAt: t.field({"required":false,"type":DateTime}),
});
export const SkillNodeCreateManyTreeInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeCreateManyTreeInput>, false>('SkillNodeCreateManyTreeInput').implement({
  fields: SkillNodeCreateManyTreeInputFields,
});

export const SkillNodeUpdateWithoutTreeInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  title: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  step: t.field({"required":false,"type":IntFieldUpdateOperationsInput}),
  orderInStep: t.field({"required":false,"type":IntFieldUpdateOperationsInput}),
  posX: t.field({"required":false,"type":NullableIntFieldUpdateOperationsInput}),
  posY: t.field({"required":false,"type":NullableIntFieldUpdateOperationsInput}),
  createdAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updatedAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  deletedAt: t.field({"required":false,"type":NullableDateTimeFieldUpdateOperationsInput}),
  lessons: t.field({"required":false,"type":LessonBlocksUpdateManyWithoutNodeNestedInput}),
  quiz: t.field({"required":false,"type":QuizUpdateOneWithoutNodeNestedInput}),
  prerequisites: t.field({"required":false,"type":SkillNodePrerequisiteUpdateManyWithoutNodeNestedInput}),
  requiredFor: t.field({"required":false,"type":SkillNodePrerequisiteUpdateManyWithoutDependsOnNestedInput}),
  progresses: t.field({"required":false,"type":UserNodeProgressUpdateManyWithoutNodeNestedInput}),
});
export const SkillNodeUpdateWithoutTreeInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodeUpdateWithoutTreeInput>, false>('SkillNodeUpdateWithoutTreeInput').implement({
  fields: SkillNodeUpdateWithoutTreeInputFields,
});

export const LessonBlocksCreateManyNodeInputFields = (t: any) => ({
  id: t.string({"required":false}),
  type: t.field({"required":true,"type":ContentType}),
  url: t.string({"required":false}),
  html: t.string({"required":false}),
  caption: t.string({"required":false}),
  order: t.int({"required":false}),
  meta: t.field({"required":false,"type":Json}),
  status: t.field({"required":false,"type":LessonStatus}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  deletedAt: t.field({"required":false,"type":DateTime}),
});
export const LessonBlocksCreateManyNodeInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.LessonBlocksCreateManyNodeInput>, false>('LessonBlocksCreateManyNodeInput').implement({
  fields: LessonBlocksCreateManyNodeInputFields,
});

export const SkillNodePrerequisiteCreateManyNodeInputFields = (t: any) => ({
  dependsOnNodeId: t.string({"required":true}),
});
export const SkillNodePrerequisiteCreateManyNodeInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodePrerequisiteCreateManyNodeInput>, false>('SkillNodePrerequisiteCreateManyNodeInput').implement({
  fields: SkillNodePrerequisiteCreateManyNodeInputFields,
});

export const SkillNodePrerequisiteCreateManyDependsOnInputFields = (t: any) => ({
  nodeId: t.string({"required":true}),
});
export const SkillNodePrerequisiteCreateManyDependsOnInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodePrerequisiteCreateManyDependsOnInput>, false>('SkillNodePrerequisiteCreateManyDependsOnInput').implement({
  fields: SkillNodePrerequisiteCreateManyDependsOnInputFields,
});

export const UserNodeProgressCreateManyNodeInputFields = (t: any) => ({
  id: t.string({"required":false}),
  userId: t.string({"required":true}),
  status: t.field({"required":false,"type":ProgressStatus}),
  completedAt: t.field({"required":false,"type":DateTime}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
});
export const UserNodeProgressCreateManyNodeInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserNodeProgressCreateManyNodeInput>, false>('UserNodeProgressCreateManyNodeInput').implement({
  fields: UserNodeProgressCreateManyNodeInputFields,
});

export const LessonBlocksUpdateWithoutNodeInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  type: t.field({"required":false,"type":EnumContentTypeFieldUpdateOperationsInput}),
  url: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  html: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  caption: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  order: t.field({"required":false,"type":IntFieldUpdateOperationsInput}),
  meta: t.field({"required":false,"type":Json}),
  status: t.field({"required":false,"type":EnumLessonStatusFieldUpdateOperationsInput}),
  createdAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updatedAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  deletedAt: t.field({"required":false,"type":NullableDateTimeFieldUpdateOperationsInput}),
});
export const LessonBlocksUpdateWithoutNodeInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.LessonBlocksUpdateWithoutNodeInput>, false>('LessonBlocksUpdateWithoutNodeInput').implement({
  fields: LessonBlocksUpdateWithoutNodeInputFields,
});

export const SkillNodePrerequisiteUpdateWithoutNodeInputFields = (t: any) => ({
  dependsOn: t.field({"required":false,"type":SkillNodeUpdateOneRequiredWithoutRequiredForNestedInput}),
});
export const SkillNodePrerequisiteUpdateWithoutNodeInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodePrerequisiteUpdateWithoutNodeInput>, false>('SkillNodePrerequisiteUpdateWithoutNodeInput').implement({
  fields: SkillNodePrerequisiteUpdateWithoutNodeInputFields,
});

export const SkillNodePrerequisiteUpdateWithoutDependsOnInputFields = (t: any) => ({
  node: t.field({"required":false,"type":SkillNodeUpdateOneRequiredWithoutPrerequisitesNestedInput}),
});
export const SkillNodePrerequisiteUpdateWithoutDependsOnInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SkillNodePrerequisiteUpdateWithoutDependsOnInput>, false>('SkillNodePrerequisiteUpdateWithoutDependsOnInput').implement({
  fields: SkillNodePrerequisiteUpdateWithoutDependsOnInputFields,
});

export const UserNodeProgressUpdateWithoutNodeInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  status: t.field({"required":false,"type":EnumProgressStatusFieldUpdateOperationsInput}),
  completedAt: t.field({"required":false,"type":NullableDateTimeFieldUpdateOperationsInput}),
  createdAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updatedAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  user: t.field({"required":false,"type":UserUpdateOneRequiredWithoutNodeProgressNestedInput}),
});
export const UserNodeProgressUpdateWithoutNodeInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserNodeProgressUpdateWithoutNodeInput>, false>('UserNodeProgressUpdateWithoutNodeInput').implement({
  fields: UserNodeProgressUpdateWithoutNodeInputFields,
});

export const QuizQuestionCreateManyQuizInputFields = (t: any) => ({
  id: t.string({"required":false}),
  type: t.field({"required":true,"type":QuestionType}),
  prompt: t.string({"required":true}),
  order: t.int({"required":false}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
});
export const QuizQuestionCreateManyQuizInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizQuestionCreateManyQuizInput>, false>('QuizQuestionCreateManyQuizInput').implement({
  fields: QuizQuestionCreateManyQuizInputFields,
});

export const QuizAttemptCreateManyQuizInputFields = (t: any) => ({
  id: t.string({"required":false}),
  userId: t.string({"required":true}),
  passed: t.boolean({"required":true}),
  takenAt: t.field({"required":false,"type":DateTime}),
});
export const QuizAttemptCreateManyQuizInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptCreateManyQuizInput>, false>('QuizAttemptCreateManyQuizInput').implement({
  fields: QuizAttemptCreateManyQuizInputFields,
});

export const QuizQuestionUpdateWithoutQuizInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  type: t.field({"required":false,"type":EnumQuestionTypeFieldUpdateOperationsInput}),
  prompt: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  order: t.field({"required":false,"type":IntFieldUpdateOperationsInput}),
  createdAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updatedAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  options: t.field({"required":false,"type":QuizOptionUpdateManyWithoutQuestionNestedInput}),
  answers: t.field({"required":false,"type":QuizAttemptAnswerUpdateManyWithoutQuestionNestedInput}),
});
export const QuizQuestionUpdateWithoutQuizInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizQuestionUpdateWithoutQuizInput>, false>('QuizQuestionUpdateWithoutQuizInput').implement({
  fields: QuizQuestionUpdateWithoutQuizInputFields,
});

export const QuizAttemptUpdateWithoutQuizInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  passed: t.field({"required":false,"type":BoolFieldUpdateOperationsInput}),
  takenAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  user: t.field({"required":false,"type":UserUpdateOneRequiredWithoutQuizAttemptsNestedInput}),
  answers: t.field({"required":false,"type":QuizAttemptAnswerUpdateManyWithoutAttemptNestedInput}),
});
export const QuizAttemptUpdateWithoutQuizInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptUpdateWithoutQuizInput>, false>('QuizAttemptUpdateWithoutQuizInput').implement({
  fields: QuizAttemptUpdateWithoutQuizInputFields,
});

export const QuizOptionCreateManyQuestionInputFields = (t: any) => ({
  id: t.string({"required":false}),
  text: t.string({"required":true}),
  isCorrect: t.boolean({"required":false}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
});
export const QuizOptionCreateManyQuestionInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizOptionCreateManyQuestionInput>, false>('QuizOptionCreateManyQuestionInput').implement({
  fields: QuizOptionCreateManyQuestionInputFields,
});

export const QuizAttemptAnswerCreateManyQuestionInputFields = (t: any) => ({
  id: t.string({"required":false}),
  attemptId: t.string({"required":true}),
  answer: t.field({"required":false,"type":Json}),
  isCorrect: t.boolean({"required":false}),
});
export const QuizAttemptAnswerCreateManyQuestionInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptAnswerCreateManyQuestionInput>, false>('QuizAttemptAnswerCreateManyQuestionInput').implement({
  fields: QuizAttemptAnswerCreateManyQuestionInputFields,
});

export const QuizOptionUpdateWithoutQuestionInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  text: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  isCorrect: t.field({"required":false,"type":BoolFieldUpdateOperationsInput}),
  createdAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updatedAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
});
export const QuizOptionUpdateWithoutQuestionInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizOptionUpdateWithoutQuestionInput>, false>('QuizOptionUpdateWithoutQuestionInput').implement({
  fields: QuizOptionUpdateWithoutQuestionInputFields,
});

export const QuizAttemptAnswerUpdateWithoutQuestionInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  answer: t.field({"required":false,"type":Json}),
  isCorrect: t.field({"required":false,"type":NullableBoolFieldUpdateOperationsInput}),
  attempt: t.field({"required":false,"type":QuizAttemptUpdateOneRequiredWithoutAnswersNestedInput}),
});
export const QuizAttemptAnswerUpdateWithoutQuestionInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptAnswerUpdateWithoutQuestionInput>, false>('QuizAttemptAnswerUpdateWithoutQuestionInput').implement({
  fields: QuizAttemptAnswerUpdateWithoutQuestionInputFields,
});

export const QuizAttemptAnswerCreateManyAttemptInputFields = (t: any) => ({
  id: t.string({"required":false}),
  questionId: t.string({"required":true}),
  answer: t.field({"required":false,"type":Json}),
  isCorrect: t.boolean({"required":false}),
});
export const QuizAttemptAnswerCreateManyAttemptInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptAnswerCreateManyAttemptInput>, false>('QuizAttemptAnswerCreateManyAttemptInput').implement({
  fields: QuizAttemptAnswerCreateManyAttemptInputFields,
});

export const QuizAttemptAnswerUpdateWithoutAttemptInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  answer: t.field({"required":false,"type":Json}),
  isCorrect: t.field({"required":false,"type":NullableBoolFieldUpdateOperationsInput}),
  question: t.field({"required":false,"type":QuizQuestionUpdateOneRequiredWithoutAnswersNestedInput}),
});
export const QuizAttemptAnswerUpdateWithoutAttemptInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.QuizAttemptAnswerUpdateWithoutAttemptInput>, false>('QuizAttemptAnswerUpdateWithoutAttemptInput').implement({
  fields: QuizAttemptAnswerUpdateWithoutAttemptInputFields,
});