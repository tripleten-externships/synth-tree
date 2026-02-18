import { gql } from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  Json: { input: any; output: any; }
  /** Never fill this, its created for inputs that dont have fields */
  NEVER: { input: any; output: any; }
};

/** Batch payloads from prisma. */
export type BatchPayload = {
  __typename?: 'BatchPayload';
  /** Prisma Batch Payload */
  count: Scalars['Int']['output'];
};

export type BoolFieldUpdateOperationsInput = {
  set?: InputMaybe<Scalars['Boolean']['input']>;
};

export type BoolFilter = {
  equals?: InputMaybe<Scalars['Boolean']['input']>;
  not?: InputMaybe<NestedBoolFilter>;
};

export type BoolNullableFilter = {
  equals?: InputMaybe<Scalars['Boolean']['input']>;
  not?: InputMaybe<NestedBoolNullableFilter>;
};

export type BoolNullableWithAggregatesFilter = {
  _count?: InputMaybe<NestedIntNullableFilter>;
  _max?: InputMaybe<NestedBoolNullableFilter>;
  _min?: InputMaybe<NestedBoolNullableFilter>;
  equals?: InputMaybe<Scalars['Boolean']['input']>;
  not?: InputMaybe<NestedBoolNullableWithAggregatesFilter>;
};

export type BoolWithAggregatesFilter = {
  _count?: InputMaybe<NestedIntFilter>;
  _max?: InputMaybe<NestedBoolFilter>;
  _min?: InputMaybe<NestedBoolFilter>;
  equals?: InputMaybe<Scalars['Boolean']['input']>;
  not?: InputMaybe<NestedBoolWithAggregatesFilter>;
};

export enum ContentType {
  Embed = 'EMBED',
  Html = 'HTML',
  Image = 'IMAGE',
  Video = 'VIDEO'
}

export type Course = {
  __typename?: 'Course';
  author: User;
  authorId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  status: CourseStatus;
  title: Scalars['String']['output'];
  trees: Array<SkillTree>;
  updatedAt: Scalars['DateTime']['output'];
};


export type CourseTreesArgs = {
  cursor?: InputMaybe<SkillTreeWhereUniqueInput>;
  distinct?: InputMaybe<Array<SkillTreeScalarFieldEnum>>;
  orderBy?: InputMaybe<Array<SkillTreeOrderByWithRelationInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<SkillTreeWhereInput>;
};

export type CourseCountOrderByAggregateInput = {
  authorId?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  deletedAt?: InputMaybe<SortOrder>;
  description?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  status?: InputMaybe<SortOrder>;
  title?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type CourseCreateInput = {
  author: UserCreateNestedOneWithoutCoursesAuthoredInput;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  deletedAt?: InputMaybe<Scalars['DateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<CourseStatus>;
  title: Scalars['String']['input'];
  trees?: InputMaybe<SkillTreeCreateNestedManyWithoutCourseInput>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type CourseCreateManyAuthorInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  deletedAt?: InputMaybe<Scalars['DateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<CourseStatus>;
  title: Scalars['String']['input'];
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type CourseCreateManyAuthorInputEnvelope = {
  data: Array<CourseCreateManyAuthorInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CourseCreateManyInput = {
  authorId: Scalars['String']['input'];
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  deletedAt?: InputMaybe<Scalars['DateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<CourseStatus>;
  title: Scalars['String']['input'];
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type CourseCreateNestedManyWithoutAuthorInput = {
  connect?: InputMaybe<Array<CourseWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<CourseCreateOrConnectWithoutAuthorInput>>;
  create?: InputMaybe<Array<CourseCreateWithoutAuthorInput>>;
  createMany?: InputMaybe<CourseCreateManyAuthorInputEnvelope>;
};

export type CourseCreateNestedOneWithoutTreesInput = {
  connect?: InputMaybe<CourseWhereUniqueInput>;
  connectOrCreate?: InputMaybe<CourseCreateOrConnectWithoutTreesInput>;
  create?: InputMaybe<CourseCreateWithoutTreesInput>;
};

export type CourseCreateOrConnectWithoutAuthorInput = {
  create: CourseCreateWithoutAuthorInput;
  where: CourseWhereUniqueInput;
};

export type CourseCreateOrConnectWithoutTreesInput = {
  create: CourseCreateWithoutTreesInput;
  where: CourseWhereUniqueInput;
};

export type CourseCreateWithoutAuthorInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  deletedAt?: InputMaybe<Scalars['DateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<CourseStatus>;
  title: Scalars['String']['input'];
  trees?: InputMaybe<SkillTreeCreateNestedManyWithoutCourseInput>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type CourseCreateWithoutTreesInput = {
  author: UserCreateNestedOneWithoutCoursesAuthoredInput;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  deletedAt?: InputMaybe<Scalars['DateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<CourseStatus>;
  title: Scalars['String']['input'];
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type CourseListRelationFilter = {
  every?: InputMaybe<CourseWhereInput>;
  none?: InputMaybe<CourseWhereInput>;
  some?: InputMaybe<CourseWhereInput>;
};

export type CourseMaxOrderByAggregateInput = {
  authorId?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  deletedAt?: InputMaybe<SortOrder>;
  description?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  status?: InputMaybe<SortOrder>;
  title?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type CourseMinOrderByAggregateInput = {
  authorId?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  deletedAt?: InputMaybe<SortOrder>;
  description?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  status?: InputMaybe<SortOrder>;
  title?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type CourseOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type CourseOrderByWithAggregationInput = {
  _count?: InputMaybe<CourseCountOrderByAggregateInput>;
  _max?: InputMaybe<CourseMaxOrderByAggregateInput>;
  _min?: InputMaybe<CourseMinOrderByAggregateInput>;
  authorId?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  deletedAt?: InputMaybe<SortOrder>;
  description?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  status?: InputMaybe<SortOrder>;
  title?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type CourseOrderByWithRelationInput = {
  author?: InputMaybe<UserOrderByWithRelationInput>;
  authorId?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  deletedAt?: InputMaybe<SortOrder>;
  description?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  status?: InputMaybe<SortOrder>;
  title?: InputMaybe<SortOrder>;
  trees?: InputMaybe<SkillTreeOrderByRelationAggregateInput>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type CourseProgress = {
  __typename?: 'CourseProgress';
  completedNodes?: Maybe<Scalars['Int']['output']>;
  completionPercentage?: Maybe<Scalars['Float']['output']>;
  courseId?: Maybe<Scalars['ID']['output']>;
  inProgressNodes?: Maybe<Scalars['Int']['output']>;
  notStartedNodes?: Maybe<Scalars['Int']['output']>;
  startedNodes?: Maybe<Scalars['Int']['output']>;
  totalNodes?: Maybe<Scalars['Int']['output']>;
};

export enum CourseScalarFieldEnum {
  AuthorId = 'authorId',
  CreatedAt = 'createdAt',
  DeletedAt = 'deletedAt',
  Description = 'description',
  Id = 'id',
  Status = 'status',
  Title = 'title',
  UpdatedAt = 'updatedAt'
}

export type CourseScalarRelationFilter = {
  is?: InputMaybe<CourseWhereInput>;
  isNot?: InputMaybe<CourseWhereInput>;
};

export type CourseScalarWhereInput = {
  AND?: InputMaybe<Array<CourseScalarWhereInput>>;
  NOT?: InputMaybe<Array<CourseScalarWhereInput>>;
  OR?: InputMaybe<Array<CourseScalarWhereInput>>;
  authorId?: InputMaybe<StringFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  deletedAt?: InputMaybe<DateTimeNullableFilter>;
  description?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<UuidFilter>;
  status?: InputMaybe<EnumCourseStatusFilter>;
  title?: InputMaybe<StringFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type CourseScalarWhereWithAggregatesInput = {
  AND?: InputMaybe<Array<CourseScalarWhereWithAggregatesInput>>;
  NOT?: InputMaybe<Array<CourseScalarWhereWithAggregatesInput>>;
  OR?: InputMaybe<Array<CourseScalarWhereWithAggregatesInput>>;
  authorId?: InputMaybe<StringWithAggregatesFilter>;
  createdAt?: InputMaybe<DateTimeWithAggregatesFilter>;
  deletedAt?: InputMaybe<DateTimeNullableWithAggregatesFilter>;
  description?: InputMaybe<StringNullableWithAggregatesFilter>;
  id?: InputMaybe<UuidWithAggregatesFilter>;
  status?: InputMaybe<EnumCourseStatusWithAggregatesFilter>;
  title?: InputMaybe<StringWithAggregatesFilter>;
  updatedAt?: InputMaybe<DateTimeWithAggregatesFilter>;
};

export enum CourseStatus {
  Draft = 'DRAFT',
  Published = 'PUBLISHED'
}

export type CourseUpdateInput = {
  author?: InputMaybe<UserUpdateOneRequiredWithoutCoursesAuthoredNestedInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  deletedAt?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  description?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  status?: InputMaybe<EnumCourseStatusFieldUpdateOperationsInput>;
  title?: InputMaybe<StringFieldUpdateOperationsInput>;
  trees?: InputMaybe<SkillTreeUpdateManyWithoutCourseNestedInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type CourseUpdateManyMutationInput = {
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  deletedAt?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  description?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  status?: InputMaybe<EnumCourseStatusFieldUpdateOperationsInput>;
  title?: InputMaybe<StringFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type CourseUpdateManyWithWhereWithoutAuthorInput = {
  data: CourseUpdateManyMutationInput;
  where: CourseScalarWhereInput;
};

export type CourseUpdateManyWithoutAuthorNestedInput = {
  connect?: InputMaybe<Array<CourseWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<CourseCreateOrConnectWithoutAuthorInput>>;
  create?: InputMaybe<Array<CourseCreateWithoutAuthorInput>>;
  createMany?: InputMaybe<CourseCreateManyAuthorInputEnvelope>;
  delete?: InputMaybe<Array<CourseWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<CourseScalarWhereInput>>;
  disconnect?: InputMaybe<Array<CourseWhereUniqueInput>>;
  set?: InputMaybe<Array<CourseWhereUniqueInput>>;
  update?: InputMaybe<Array<CourseUpdateWithWhereUniqueWithoutAuthorInput>>;
  updateMany?: InputMaybe<Array<CourseUpdateManyWithWhereWithoutAuthorInput>>;
  upsert?: InputMaybe<Array<CourseUpsertWithWhereUniqueWithoutAuthorInput>>;
};

export type CourseUpdateOneRequiredWithoutTreesNestedInput = {
  connect?: InputMaybe<CourseWhereUniqueInput>;
  connectOrCreate?: InputMaybe<CourseCreateOrConnectWithoutTreesInput>;
  create?: InputMaybe<CourseCreateWithoutTreesInput>;
  update?: InputMaybe<CourseUpdateToOneWithWhereWithoutTreesInput>;
  upsert?: InputMaybe<CourseUpsertWithoutTreesInput>;
};

export type CourseUpdateToOneWithWhereWithoutTreesInput = {
  data: CourseUpdateWithoutTreesInput;
  where?: InputMaybe<CourseWhereInput>;
};

export type CourseUpdateWithWhereUniqueWithoutAuthorInput = {
  data: CourseUpdateWithoutAuthorInput;
  where: CourseWhereUniqueInput;
};

export type CourseUpdateWithoutAuthorInput = {
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  deletedAt?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  description?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  status?: InputMaybe<EnumCourseStatusFieldUpdateOperationsInput>;
  title?: InputMaybe<StringFieldUpdateOperationsInput>;
  trees?: InputMaybe<SkillTreeUpdateManyWithoutCourseNestedInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type CourseUpdateWithoutTreesInput = {
  author?: InputMaybe<UserUpdateOneRequiredWithoutCoursesAuthoredNestedInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  deletedAt?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  description?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  status?: InputMaybe<EnumCourseStatusFieldUpdateOperationsInput>;
  title?: InputMaybe<StringFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type CourseUpsertWithWhereUniqueWithoutAuthorInput = {
  create: CourseCreateWithoutAuthorInput;
  update: CourseUpdateWithoutAuthorInput;
  where: CourseWhereUniqueInput;
};

export type CourseUpsertWithoutTreesInput = {
  create: CourseCreateWithoutTreesInput;
  update: CourseUpdateWithoutTreesInput;
  where?: InputMaybe<CourseWhereInput>;
};

export type CourseWhereInput = {
  AND?: InputMaybe<Array<CourseWhereInput>>;
  NOT?: InputMaybe<Array<CourseWhereInput>>;
  OR?: InputMaybe<Array<CourseWhereInput>>;
  author?: InputMaybe<UserWhereInput>;
  authorId?: InputMaybe<StringFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  deletedAt?: InputMaybe<DateTimeNullableFilter>;
  description?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<UuidFilter>;
  status?: InputMaybe<EnumCourseStatusFilter>;
  title?: InputMaybe<StringFilter>;
  trees?: InputMaybe<SkillTreeListRelationFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type CourseWhereUniqueInput = {
  AND?: InputMaybe<Array<CourseWhereInput>>;
  NOT?: InputMaybe<Array<CourseWhereInput>>;
  OR?: InputMaybe<Array<CourseWhereInput>>;
  author?: InputMaybe<UserWhereInput>;
  authorId?: InputMaybe<StringFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  deletedAt?: InputMaybe<DateTimeNullableFilter>;
  description?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<EnumCourseStatusFilter>;
  title?: InputMaybe<StringFilter>;
  trees?: InputMaybe<SkillTreeListRelationFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type CreateCourseInput = {
  defaultTreeTitle?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type CreateFirstSkillNodeInput = {
  title: Scalars['String']['input'];
  treeId: Scalars['ID']['input'];
};

export type CreateSkillNodeBelowInput = {
  referenceNodeId: Scalars['ID']['input'];
  title: Scalars['String']['input'];
};

export type CreateSkillNodeToRightInput = {
  referenceNodeId: Scalars['ID']['input'];
  title: Scalars['String']['input'];
};

export type CreateSkillTreeInput = {
  courseId: Scalars['ID']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type DateTimeFieldUpdateOperationsInput = {
  set?: InputMaybe<Scalars['DateTime']['input']>;
};

export type DateTimeFilter = {
  equals?: InputMaybe<Scalars['DateTime']['input']>;
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  not?: InputMaybe<NestedDateTimeFilter>;
  notIn?: InputMaybe<Array<Scalars['DateTime']['input']>>;
};

export type DateTimeNullableFilter = {
  equals?: InputMaybe<Scalars['DateTime']['input']>;
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  not?: InputMaybe<NestedDateTimeNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['DateTime']['input']>>;
};

export type DateTimeNullableWithAggregatesFilter = {
  _count?: InputMaybe<NestedIntNullableFilter>;
  _max?: InputMaybe<NestedDateTimeNullableFilter>;
  _min?: InputMaybe<NestedDateTimeNullableFilter>;
  equals?: InputMaybe<Scalars['DateTime']['input']>;
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  not?: InputMaybe<NestedDateTimeNullableWithAggregatesFilter>;
  notIn?: InputMaybe<Array<Scalars['DateTime']['input']>>;
};

export type DateTimeWithAggregatesFilter = {
  _count?: InputMaybe<NestedIntFilter>;
  _max?: InputMaybe<NestedDateTimeFilter>;
  _min?: InputMaybe<NestedDateTimeFilter>;
  equals?: InputMaybe<Scalars['DateTime']['input']>;
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  not?: InputMaybe<NestedDateTimeWithAggregatesFilter>;
  notIn?: InputMaybe<Array<Scalars['DateTime']['input']>>;
};

export type EnumContentTypeFieldUpdateOperationsInput = {
  set?: InputMaybe<ContentType>;
};

export type EnumContentTypeFilter = {
  equals?: InputMaybe<ContentType>;
  in?: InputMaybe<Array<ContentType>>;
  not?: InputMaybe<ContentType>;
  notIn?: InputMaybe<Array<ContentType>>;
};

export type EnumContentTypeWithAggregatesFilter = {
  _count?: InputMaybe<NestedIntFilter>;
  _max?: InputMaybe<NestedEnumContentTypeFilter>;
  _min?: InputMaybe<NestedEnumContentTypeFilter>;
  equals?: InputMaybe<ContentType>;
  in?: InputMaybe<Array<ContentType>>;
  not?: InputMaybe<ContentType>;
  notIn?: InputMaybe<Array<ContentType>>;
};

export type EnumCourseStatusFieldUpdateOperationsInput = {
  set?: InputMaybe<CourseStatus>;
};

export type EnumCourseStatusFilter = {
  equals?: InputMaybe<CourseStatus>;
  in?: InputMaybe<Array<CourseStatus>>;
  not?: InputMaybe<CourseStatus>;
  notIn?: InputMaybe<Array<CourseStatus>>;
};

export type EnumCourseStatusWithAggregatesFilter = {
  _count?: InputMaybe<NestedIntFilter>;
  _max?: InputMaybe<NestedEnumCourseStatusFilter>;
  _min?: InputMaybe<NestedEnumCourseStatusFilter>;
  equals?: InputMaybe<CourseStatus>;
  in?: InputMaybe<Array<CourseStatus>>;
  not?: InputMaybe<CourseStatus>;
  notIn?: InputMaybe<Array<CourseStatus>>;
};

export type EnumLessonStatusFieldUpdateOperationsInput = {
  set?: InputMaybe<LessonStatus>;
};

export type EnumLessonStatusFilter = {
  equals?: InputMaybe<LessonStatus>;
  in?: InputMaybe<Array<LessonStatus>>;
  not?: InputMaybe<LessonStatus>;
  notIn?: InputMaybe<Array<LessonStatus>>;
};

export type EnumLessonStatusWithAggregatesFilter = {
  _count?: InputMaybe<NestedIntFilter>;
  _max?: InputMaybe<NestedEnumLessonStatusFilter>;
  _min?: InputMaybe<NestedEnumLessonStatusFilter>;
  equals?: InputMaybe<LessonStatus>;
  in?: InputMaybe<Array<LessonStatus>>;
  not?: InputMaybe<LessonStatus>;
  notIn?: InputMaybe<Array<LessonStatus>>;
};

export type EnumProgressStatusFieldUpdateOperationsInput = {
  set?: InputMaybe<ProgressStatus>;
};

export type EnumProgressStatusFilter = {
  equals?: InputMaybe<ProgressStatus>;
  in?: InputMaybe<Array<ProgressStatus>>;
  not?: InputMaybe<ProgressStatus>;
  notIn?: InputMaybe<Array<ProgressStatus>>;
};

export type EnumProgressStatusWithAggregatesFilter = {
  _count?: InputMaybe<NestedIntFilter>;
  _max?: InputMaybe<NestedEnumProgressStatusFilter>;
  _min?: InputMaybe<NestedEnumProgressStatusFilter>;
  equals?: InputMaybe<ProgressStatus>;
  in?: InputMaybe<Array<ProgressStatus>>;
  not?: InputMaybe<ProgressStatus>;
  notIn?: InputMaybe<Array<ProgressStatus>>;
};

export type EnumQuestionTypeFieldUpdateOperationsInput = {
  set?: InputMaybe<QuestionType>;
};

export type EnumQuestionTypeFilter = {
  equals?: InputMaybe<QuestionType>;
  in?: InputMaybe<Array<QuestionType>>;
  not?: InputMaybe<QuestionType>;
  notIn?: InputMaybe<Array<QuestionType>>;
};

export type EnumQuestionTypeWithAggregatesFilter = {
  _count?: InputMaybe<NestedIntFilter>;
  _max?: InputMaybe<NestedEnumQuestionTypeFilter>;
  _min?: InputMaybe<NestedEnumQuestionTypeFilter>;
  equals?: InputMaybe<QuestionType>;
  in?: InputMaybe<Array<QuestionType>>;
  not?: InputMaybe<QuestionType>;
  notIn?: InputMaybe<Array<QuestionType>>;
};

export type EnumRoleFieldUpdateOperationsInput = {
  set?: InputMaybe<Role>;
};

export type EnumRoleFilter = {
  equals?: InputMaybe<Role>;
  in?: InputMaybe<Array<Role>>;
  not?: InputMaybe<Role>;
  notIn?: InputMaybe<Array<Role>>;
};

export type EnumRoleWithAggregatesFilter = {
  _count?: InputMaybe<NestedIntFilter>;
  _max?: InputMaybe<NestedEnumRoleFilter>;
  _min?: InputMaybe<NestedEnumRoleFilter>;
  equals?: InputMaybe<Role>;
  in?: InputMaybe<Array<Role>>;
  not?: InputMaybe<Role>;
  notIn?: InputMaybe<Array<Role>>;
};

export type IntFieldUpdateOperationsInput = {
  decrement?: InputMaybe<Scalars['Int']['input']>;
  divide?: InputMaybe<Scalars['Int']['input']>;
  increment?: InputMaybe<Scalars['Int']['input']>;
  multiply?: InputMaybe<Scalars['Int']['input']>;
  set?: InputMaybe<Scalars['Int']['input']>;
};

export type IntFilter = {
  equals?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  not?: InputMaybe<NestedIntFilter>;
  notIn?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type IntNullableFilter = {
  equals?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  not?: InputMaybe<NestedIntNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type IntNullableWithAggregatesFilter = {
  _avg?: InputMaybe<NestedFloatNullableFilter>;
  _count?: InputMaybe<NestedIntNullableFilter>;
  _max?: InputMaybe<NestedIntNullableFilter>;
  _min?: InputMaybe<NestedIntNullableFilter>;
  _sum?: InputMaybe<NestedIntNullableFilter>;
  equals?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  not?: InputMaybe<NestedIntNullableWithAggregatesFilter>;
  notIn?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type IntWithAggregatesFilter = {
  _avg?: InputMaybe<NestedFloatFilter>;
  _count?: InputMaybe<NestedIntFilter>;
  _max?: InputMaybe<NestedIntFilter>;
  _min?: InputMaybe<NestedIntFilter>;
  _sum?: InputMaybe<NestedIntFilter>;
  equals?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  not?: InputMaybe<NestedIntWithAggregatesFilter>;
  notIn?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export enum JsonNullValueFilter {
  AnyNull = 'AnyNull',
  DbNull = 'DbNull',
  JsonNull = 'JsonNull'
}

export type JsonNullableFilter = {
  array_contains?: InputMaybe<Scalars['Json']['input']>;
  array_ends_with?: InputMaybe<Scalars['Json']['input']>;
  array_starts_with?: InputMaybe<Scalars['Json']['input']>;
  equals?: InputMaybe<Scalars['Json']['input']>;
  gt?: InputMaybe<Scalars['Json']['input']>;
  gte?: InputMaybe<Scalars['Json']['input']>;
  lt?: InputMaybe<Scalars['Json']['input']>;
  lte?: InputMaybe<Scalars['Json']['input']>;
  mode?: InputMaybe<QueryMode>;
  not?: InputMaybe<Scalars['Json']['input']>;
  path?: InputMaybe<Array<Scalars['String']['input']>>;
  string_contains?: InputMaybe<Scalars['String']['input']>;
  string_ends_with?: InputMaybe<Scalars['String']['input']>;
  string_starts_with?: InputMaybe<Scalars['String']['input']>;
};

export type JsonNullableWithAggregatesFilter = {
  _count?: InputMaybe<NestedIntNullableFilter>;
  _max?: InputMaybe<NestedJsonNullableFilter>;
  _min?: InputMaybe<NestedJsonNullableFilter>;
  array_contains?: InputMaybe<Scalars['Json']['input']>;
  array_ends_with?: InputMaybe<Scalars['Json']['input']>;
  array_starts_with?: InputMaybe<Scalars['Json']['input']>;
  equals?: InputMaybe<Scalars['Json']['input']>;
  gt?: InputMaybe<Scalars['Json']['input']>;
  gte?: InputMaybe<Scalars['Json']['input']>;
  lt?: InputMaybe<Scalars['Json']['input']>;
  lte?: InputMaybe<Scalars['Json']['input']>;
  mode?: InputMaybe<QueryMode>;
  not?: InputMaybe<Scalars['Json']['input']>;
  path?: InputMaybe<Array<Scalars['String']['input']>>;
  string_contains?: InputMaybe<Scalars['String']['input']>;
  string_ends_with?: InputMaybe<Scalars['String']['input']>;
  string_starts_with?: InputMaybe<Scalars['String']['input']>;
};

export type LessonBlocks = {
  __typename?: 'LessonBlocks';
  caption?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  html?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  meta?: Maybe<Scalars['Json']['output']>;
  node: SkillNode;
  nodeId: Scalars['String']['output'];
  order: Scalars['Int']['output'];
  status: LessonStatus;
  type: ContentType;
  updatedAt: Scalars['DateTime']['output'];
  url?: Maybe<Scalars['String']['output']>;
};

export type LessonBlocksAvgOrderByAggregateInput = {
  order?: InputMaybe<SortOrder>;
};

export type LessonBlocksCountOrderByAggregateInput = {
  caption?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  deletedAt?: InputMaybe<SortOrder>;
  html?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  meta?: InputMaybe<SortOrder>;
  nodeId?: InputMaybe<SortOrder>;
  order?: InputMaybe<SortOrder>;
  status?: InputMaybe<SortOrder>;
  type?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
  url?: InputMaybe<SortOrder>;
};

export type LessonBlocksCreateInput = {
  caption?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  deletedAt?: InputMaybe<Scalars['DateTime']['input']>;
  html?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  meta?: InputMaybe<Scalars['Json']['input']>;
  node: SkillNodeCreateNestedOneWithoutLessonsInput;
  order?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<LessonStatus>;
  type: ContentType;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type LessonBlocksCreateManyInput = {
  caption?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  deletedAt?: InputMaybe<Scalars['DateTime']['input']>;
  html?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  meta?: InputMaybe<Scalars['Json']['input']>;
  nodeId: Scalars['String']['input'];
  order?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<LessonStatus>;
  type: ContentType;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type LessonBlocksCreateManyNodeInput = {
  caption?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  deletedAt?: InputMaybe<Scalars['DateTime']['input']>;
  html?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  meta?: InputMaybe<Scalars['Json']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<LessonStatus>;
  type: ContentType;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type LessonBlocksCreateManyNodeInputEnvelope = {
  data: Array<LessonBlocksCreateManyNodeInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type LessonBlocksCreateNestedManyWithoutNodeInput = {
  connect?: InputMaybe<Array<LessonBlocksWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<LessonBlocksCreateOrConnectWithoutNodeInput>>;
  create?: InputMaybe<Array<LessonBlocksCreateWithoutNodeInput>>;
  createMany?: InputMaybe<LessonBlocksCreateManyNodeInputEnvelope>;
};

export type LessonBlocksCreateOrConnectWithoutNodeInput = {
  create: LessonBlocksCreateWithoutNodeInput;
  where: LessonBlocksWhereUniqueInput;
};

export type LessonBlocksCreateWithoutNodeInput = {
  caption?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  deletedAt?: InputMaybe<Scalars['DateTime']['input']>;
  html?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  meta?: InputMaybe<Scalars['Json']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<LessonStatus>;
  type: ContentType;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type LessonBlocksListRelationFilter = {
  every?: InputMaybe<LessonBlocksWhereInput>;
  none?: InputMaybe<LessonBlocksWhereInput>;
  some?: InputMaybe<LessonBlocksWhereInput>;
};

export type LessonBlocksMaxOrderByAggregateInput = {
  caption?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  deletedAt?: InputMaybe<SortOrder>;
  html?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  nodeId?: InputMaybe<SortOrder>;
  order?: InputMaybe<SortOrder>;
  status?: InputMaybe<SortOrder>;
  type?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
  url?: InputMaybe<SortOrder>;
};

export type LessonBlocksMinOrderByAggregateInput = {
  caption?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  deletedAt?: InputMaybe<SortOrder>;
  html?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  nodeId?: InputMaybe<SortOrder>;
  order?: InputMaybe<SortOrder>;
  status?: InputMaybe<SortOrder>;
  type?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
  url?: InputMaybe<SortOrder>;
};

export type LessonBlocksOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type LessonBlocksOrderByWithAggregationInput = {
  _avg?: InputMaybe<LessonBlocksAvgOrderByAggregateInput>;
  _count?: InputMaybe<LessonBlocksCountOrderByAggregateInput>;
  _max?: InputMaybe<LessonBlocksMaxOrderByAggregateInput>;
  _min?: InputMaybe<LessonBlocksMinOrderByAggregateInput>;
  _sum?: InputMaybe<LessonBlocksSumOrderByAggregateInput>;
  caption?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  deletedAt?: InputMaybe<SortOrder>;
  html?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  meta?: InputMaybe<SortOrder>;
  nodeId?: InputMaybe<SortOrder>;
  order?: InputMaybe<SortOrder>;
  status?: InputMaybe<SortOrder>;
  type?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
  url?: InputMaybe<SortOrder>;
};

export type LessonBlocksOrderByWithRelationInput = {
  caption?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  deletedAt?: InputMaybe<SortOrder>;
  html?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  meta?: InputMaybe<SortOrder>;
  node?: InputMaybe<SkillNodeOrderByWithRelationInput>;
  nodeId?: InputMaybe<SortOrder>;
  order?: InputMaybe<SortOrder>;
  status?: InputMaybe<SortOrder>;
  type?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
  url?: InputMaybe<SortOrder>;
};

export enum LessonBlocksScalarFieldEnum {
  Caption = 'caption',
  CreatedAt = 'createdAt',
  DeletedAt = 'deletedAt',
  Html = 'html',
  Id = 'id',
  Meta = 'meta',
  NodeId = 'nodeId',
  Order = 'order',
  Status = 'status',
  Type = 'type',
  UpdatedAt = 'updatedAt',
  Url = 'url'
}

export type LessonBlocksScalarWhereInput = {
  AND?: InputMaybe<Array<LessonBlocksScalarWhereInput>>;
  NOT?: InputMaybe<Array<LessonBlocksScalarWhereInput>>;
  OR?: InputMaybe<Array<LessonBlocksScalarWhereInput>>;
  caption?: InputMaybe<StringNullableFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  deletedAt?: InputMaybe<DateTimeNullableFilter>;
  html?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<UuidFilter>;
  meta?: InputMaybe<JsonNullableFilter>;
  nodeId?: InputMaybe<UuidFilter>;
  order?: InputMaybe<IntFilter>;
  status?: InputMaybe<EnumLessonStatusFilter>;
  type?: InputMaybe<EnumContentTypeFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
  url?: InputMaybe<StringNullableFilter>;
};

export type LessonBlocksScalarWhereWithAggregatesInput = {
  AND?: InputMaybe<Array<LessonBlocksScalarWhereWithAggregatesInput>>;
  NOT?: InputMaybe<Array<LessonBlocksScalarWhereWithAggregatesInput>>;
  OR?: InputMaybe<Array<LessonBlocksScalarWhereWithAggregatesInput>>;
  caption?: InputMaybe<StringNullableWithAggregatesFilter>;
  createdAt?: InputMaybe<DateTimeWithAggregatesFilter>;
  deletedAt?: InputMaybe<DateTimeNullableWithAggregatesFilter>;
  html?: InputMaybe<StringNullableWithAggregatesFilter>;
  id?: InputMaybe<UuidWithAggregatesFilter>;
  meta?: InputMaybe<JsonNullableWithAggregatesFilter>;
  nodeId?: InputMaybe<UuidWithAggregatesFilter>;
  order?: InputMaybe<IntWithAggregatesFilter>;
  status?: InputMaybe<EnumLessonStatusWithAggregatesFilter>;
  type?: InputMaybe<EnumContentTypeWithAggregatesFilter>;
  updatedAt?: InputMaybe<DateTimeWithAggregatesFilter>;
  url?: InputMaybe<StringNullableWithAggregatesFilter>;
};

export type LessonBlocksSumOrderByAggregateInput = {
  order?: InputMaybe<SortOrder>;
};

export type LessonBlocksUpdateInput = {
  caption?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  deletedAt?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  html?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  meta?: InputMaybe<Scalars['Json']['input']>;
  node?: InputMaybe<SkillNodeUpdateOneRequiredWithoutLessonsNestedInput>;
  order?: InputMaybe<IntFieldUpdateOperationsInput>;
  status?: InputMaybe<EnumLessonStatusFieldUpdateOperationsInput>;
  type?: InputMaybe<EnumContentTypeFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  url?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
};

export type LessonBlocksUpdateManyMutationInput = {
  caption?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  deletedAt?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  html?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  meta?: InputMaybe<Scalars['Json']['input']>;
  order?: InputMaybe<IntFieldUpdateOperationsInput>;
  status?: InputMaybe<EnumLessonStatusFieldUpdateOperationsInput>;
  type?: InputMaybe<EnumContentTypeFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  url?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
};

export type LessonBlocksUpdateManyWithWhereWithoutNodeInput = {
  data: LessonBlocksUpdateManyMutationInput;
  where: LessonBlocksScalarWhereInput;
};

export type LessonBlocksUpdateManyWithoutNodeNestedInput = {
  connect?: InputMaybe<Array<LessonBlocksWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<LessonBlocksCreateOrConnectWithoutNodeInput>>;
  create?: InputMaybe<Array<LessonBlocksCreateWithoutNodeInput>>;
  createMany?: InputMaybe<LessonBlocksCreateManyNodeInputEnvelope>;
  delete?: InputMaybe<Array<LessonBlocksWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<LessonBlocksScalarWhereInput>>;
  disconnect?: InputMaybe<Array<LessonBlocksWhereUniqueInput>>;
  set?: InputMaybe<Array<LessonBlocksWhereUniqueInput>>;
  update?: InputMaybe<Array<LessonBlocksUpdateWithWhereUniqueWithoutNodeInput>>;
  updateMany?: InputMaybe<Array<LessonBlocksUpdateManyWithWhereWithoutNodeInput>>;
  upsert?: InputMaybe<Array<LessonBlocksUpsertWithWhereUniqueWithoutNodeInput>>;
};

export type LessonBlocksUpdateWithWhereUniqueWithoutNodeInput = {
  data: LessonBlocksUpdateWithoutNodeInput;
  where: LessonBlocksWhereUniqueInput;
};

export type LessonBlocksUpdateWithoutNodeInput = {
  caption?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  deletedAt?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  html?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  meta?: InputMaybe<Scalars['Json']['input']>;
  order?: InputMaybe<IntFieldUpdateOperationsInput>;
  status?: InputMaybe<EnumLessonStatusFieldUpdateOperationsInput>;
  type?: InputMaybe<EnumContentTypeFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  url?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
};

export type LessonBlocksUpsertWithWhereUniqueWithoutNodeInput = {
  create: LessonBlocksCreateWithoutNodeInput;
  update: LessonBlocksUpdateWithoutNodeInput;
  where: LessonBlocksWhereUniqueInput;
};

export type LessonBlocksWhereInput = {
  AND?: InputMaybe<Array<LessonBlocksWhereInput>>;
  NOT?: InputMaybe<Array<LessonBlocksWhereInput>>;
  OR?: InputMaybe<Array<LessonBlocksWhereInput>>;
  caption?: InputMaybe<StringNullableFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  deletedAt?: InputMaybe<DateTimeNullableFilter>;
  html?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<UuidFilter>;
  meta?: InputMaybe<JsonNullableFilter>;
  node?: InputMaybe<SkillNodeWhereInput>;
  nodeId?: InputMaybe<UuidFilter>;
  order?: InputMaybe<IntFilter>;
  status?: InputMaybe<EnumLessonStatusFilter>;
  type?: InputMaybe<EnumContentTypeFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
  url?: InputMaybe<StringNullableFilter>;
};

export type LessonBlocksWhereUniqueInput = {
  AND?: InputMaybe<Array<LessonBlocksWhereInput>>;
  NOT?: InputMaybe<Array<LessonBlocksWhereInput>>;
  OR?: InputMaybe<Array<LessonBlocksWhereInput>>;
  caption?: InputMaybe<StringNullableFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  deletedAt?: InputMaybe<DateTimeNullableFilter>;
  html?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<Scalars['String']['input']>;
  meta?: InputMaybe<JsonNullableFilter>;
  node?: InputMaybe<SkillNodeWhereInput>;
  nodeId?: InputMaybe<UuidFilter>;
  order?: InputMaybe<IntFilter>;
  status?: InputMaybe<EnumLessonStatusFilter>;
  type?: InputMaybe<EnumContentTypeFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
  url?: InputMaybe<StringNullableFilter>;
};

export enum LessonStatus {
  Draft = 'DRAFT',
  Published = 'PUBLISHED'
}

export type Mutation = {
  __typename?: 'Mutation';
  createCourse?: Maybe<Course>;
  createFirstSkillNode?: Maybe<SkillNode>;
  createLessonBlock?: Maybe<LessonBlocks>;
  createQuiz?: Maybe<Quiz>;
  createSkillNodeBelow?: Maybe<SkillNode>;
  createSkillNodeToRight?: Maybe<SkillNode>;
  createSkillTree?: Maybe<SkillTree>;
  deleteCourse?: Maybe<Course>;
  deleteLessonBlock?: Maybe<LessonBlocks>;
  deleteQuiz?: Maybe<Quiz>;
  deleteSkillNodeAdvanced?: Maybe<Scalars['Boolean']['output']>;
  deleteSkillNodeSimple?: Maybe<Scalars['Boolean']['output']>;
  deleteSkillTree?: Maybe<SkillTree>;
  deleteUser?: Maybe<User>;
  publishLessonBlock?: Maybe<LessonBlocks>;
  setUserRole?: Maybe<User>;
  syncCurrentUser?: Maybe<User>;
  updateCourse?: Maybe<Course>;
  updateLessonBlock?: Maybe<LessonBlocks>;
  updateQuiz?: Maybe<Quiz>;
  updateSkillNode?: Maybe<SkillNode>;
  updateSkillTree?: Maybe<SkillTree>;
};


export type MutationCreateCourseArgs = {
  input: CreateCourseInput;
};


export type MutationCreateFirstSkillNodeArgs = {
  input: CreateFirstSkillNodeInput;
};


export type MutationCreateLessonBlockArgs = {
  input: LessonBlocksCreateInput;
};


export type MutationCreateQuizArgs = {
  nodeId: Scalars['String']['input'];
  required: Scalars['Boolean']['input'];
  title: Scalars['String']['input'];
};


export type MutationCreateSkillNodeBelowArgs = {
  input: CreateSkillNodeBelowInput;
};


export type MutationCreateSkillNodeToRightArgs = {
  input: CreateSkillNodeToRightInput;
};


export type MutationCreateSkillTreeArgs = {
  input: CreateSkillTreeInput;
};


export type MutationDeleteCourseArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteLessonBlockArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteQuizArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteSkillNodeAdvancedArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteSkillNodeSimpleArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteSkillTreeArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationPublishLessonBlockArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSetUserRoleArgs = {
  role: Role;
  userId: Scalars['ID']['input'];
};


export type MutationSyncCurrentUserArgs = {
  name?: InputMaybe<Scalars['String']['input']>;
  photoUrl?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateCourseArgs = {
  id: Scalars['ID']['input'];
  input: UpdateCourseInput;
};


export type MutationUpdateLessonBlockArgs = {
  input: LessonBlocksUpdateInput;
};


export type MutationUpdateQuizArgs = {
  id: Scalars['ID']['input'];
  required?: InputMaybe<Scalars['Boolean']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateSkillNodeArgs = {
  id: Scalars['ID']['input'];
  input: UpdateSkillNodeInput;
};


export type MutationUpdateSkillTreeArgs = {
  id: Scalars['ID']['input'];
  input: UpdateSkillTreeInput;
};

export type NestedBoolFilter = {
  equals?: InputMaybe<Scalars['Boolean']['input']>;
  not?: InputMaybe<NestedBoolFilter>;
};

export type NestedBoolNullableFilter = {
  equals?: InputMaybe<Scalars['Boolean']['input']>;
  not?: InputMaybe<NestedBoolNullableFilter>;
};

export type NestedBoolNullableWithAggregatesFilter = {
  _count?: InputMaybe<NestedIntNullableFilter>;
  _max?: InputMaybe<NestedBoolNullableFilter>;
  _min?: InputMaybe<NestedBoolNullableFilter>;
  equals?: InputMaybe<Scalars['Boolean']['input']>;
  not?: InputMaybe<NestedBoolNullableWithAggregatesFilter>;
};

export type NestedBoolWithAggregatesFilter = {
  _count?: InputMaybe<NestedIntFilter>;
  _max?: InputMaybe<NestedBoolFilter>;
  _min?: InputMaybe<NestedBoolFilter>;
  equals?: InputMaybe<Scalars['Boolean']['input']>;
  not?: InputMaybe<NestedBoolWithAggregatesFilter>;
};

export type NestedDateTimeFilter = {
  equals?: InputMaybe<Scalars['DateTime']['input']>;
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  not?: InputMaybe<NestedDateTimeFilter>;
  notIn?: InputMaybe<Array<Scalars['DateTime']['input']>>;
};

export type NestedDateTimeNullableFilter = {
  equals?: InputMaybe<Scalars['DateTime']['input']>;
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  not?: InputMaybe<NestedDateTimeNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['DateTime']['input']>>;
};

export type NestedDateTimeNullableWithAggregatesFilter = {
  _count?: InputMaybe<NestedIntNullableFilter>;
  _max?: InputMaybe<NestedDateTimeNullableFilter>;
  _min?: InputMaybe<NestedDateTimeNullableFilter>;
  equals?: InputMaybe<Scalars['DateTime']['input']>;
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  not?: InputMaybe<NestedDateTimeNullableWithAggregatesFilter>;
  notIn?: InputMaybe<Array<Scalars['DateTime']['input']>>;
};

export type NestedDateTimeWithAggregatesFilter = {
  _count?: InputMaybe<NestedIntFilter>;
  _max?: InputMaybe<NestedDateTimeFilter>;
  _min?: InputMaybe<NestedDateTimeFilter>;
  equals?: InputMaybe<Scalars['DateTime']['input']>;
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  not?: InputMaybe<NestedDateTimeWithAggregatesFilter>;
  notIn?: InputMaybe<Array<Scalars['DateTime']['input']>>;
};

export type NestedEnumContentTypeFilter = {
  equals?: InputMaybe<ContentType>;
  in?: InputMaybe<Array<ContentType>>;
  not?: InputMaybe<ContentType>;
  notIn?: InputMaybe<Array<ContentType>>;
};

export type NestedEnumContentTypeWithAggregatesFilter = {
  _count?: InputMaybe<NestedIntFilter>;
  _max?: InputMaybe<NestedEnumContentTypeFilter>;
  _min?: InputMaybe<NestedEnumContentTypeFilter>;
  equals?: InputMaybe<ContentType>;
  in?: InputMaybe<Array<ContentType>>;
  not?: InputMaybe<ContentType>;
  notIn?: InputMaybe<Array<ContentType>>;
};

export type NestedEnumCourseStatusFilter = {
  equals?: InputMaybe<CourseStatus>;
  in?: InputMaybe<Array<CourseStatus>>;
  not?: InputMaybe<CourseStatus>;
  notIn?: InputMaybe<Array<CourseStatus>>;
};

export type NestedEnumCourseStatusWithAggregatesFilter = {
  _count?: InputMaybe<NestedIntFilter>;
  _max?: InputMaybe<NestedEnumCourseStatusFilter>;
  _min?: InputMaybe<NestedEnumCourseStatusFilter>;
  equals?: InputMaybe<CourseStatus>;
  in?: InputMaybe<Array<CourseStatus>>;
  not?: InputMaybe<CourseStatus>;
  notIn?: InputMaybe<Array<CourseStatus>>;
};

export type NestedEnumLessonStatusFilter = {
  equals?: InputMaybe<LessonStatus>;
  in?: InputMaybe<Array<LessonStatus>>;
  not?: InputMaybe<LessonStatus>;
  notIn?: InputMaybe<Array<LessonStatus>>;
};

export type NestedEnumLessonStatusWithAggregatesFilter = {
  _count?: InputMaybe<NestedIntFilter>;
  _max?: InputMaybe<NestedEnumLessonStatusFilter>;
  _min?: InputMaybe<NestedEnumLessonStatusFilter>;
  equals?: InputMaybe<LessonStatus>;
  in?: InputMaybe<Array<LessonStatus>>;
  not?: InputMaybe<LessonStatus>;
  notIn?: InputMaybe<Array<LessonStatus>>;
};

export type NestedEnumProgressStatusFilter = {
  equals?: InputMaybe<ProgressStatus>;
  in?: InputMaybe<Array<ProgressStatus>>;
  not?: InputMaybe<ProgressStatus>;
  notIn?: InputMaybe<Array<ProgressStatus>>;
};

export type NestedEnumProgressStatusWithAggregatesFilter = {
  _count?: InputMaybe<NestedIntFilter>;
  _max?: InputMaybe<NestedEnumProgressStatusFilter>;
  _min?: InputMaybe<NestedEnumProgressStatusFilter>;
  equals?: InputMaybe<ProgressStatus>;
  in?: InputMaybe<Array<ProgressStatus>>;
  not?: InputMaybe<ProgressStatus>;
  notIn?: InputMaybe<Array<ProgressStatus>>;
};

export type NestedEnumQuestionTypeFilter = {
  equals?: InputMaybe<QuestionType>;
  in?: InputMaybe<Array<QuestionType>>;
  not?: InputMaybe<QuestionType>;
  notIn?: InputMaybe<Array<QuestionType>>;
};

export type NestedEnumQuestionTypeWithAggregatesFilter = {
  _count?: InputMaybe<NestedIntFilter>;
  _max?: InputMaybe<NestedEnumQuestionTypeFilter>;
  _min?: InputMaybe<NestedEnumQuestionTypeFilter>;
  equals?: InputMaybe<QuestionType>;
  in?: InputMaybe<Array<QuestionType>>;
  not?: InputMaybe<QuestionType>;
  notIn?: InputMaybe<Array<QuestionType>>;
};

export type NestedEnumRoleFilter = {
  equals?: InputMaybe<Role>;
  in?: InputMaybe<Array<Role>>;
  not?: InputMaybe<Role>;
  notIn?: InputMaybe<Array<Role>>;
};

export type NestedEnumRoleWithAggregatesFilter = {
  _count?: InputMaybe<NestedIntFilter>;
  _max?: InputMaybe<NestedEnumRoleFilter>;
  _min?: InputMaybe<NestedEnumRoleFilter>;
  equals?: InputMaybe<Role>;
  in?: InputMaybe<Array<Role>>;
  not?: InputMaybe<Role>;
  notIn?: InputMaybe<Array<Role>>;
};

export type NestedFloatFilter = {
  equals?: InputMaybe<Scalars['Float']['input']>;
  gt?: InputMaybe<Scalars['Float']['input']>;
  gte?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<Scalars['Float']['input']>>;
  lt?: InputMaybe<Scalars['Float']['input']>;
  lte?: InputMaybe<Scalars['Float']['input']>;
  not?: InputMaybe<NestedFloatFilter>;
  notIn?: InputMaybe<Array<Scalars['Float']['input']>>;
};

export type NestedFloatNullableFilter = {
  equals?: InputMaybe<Scalars['Float']['input']>;
  gt?: InputMaybe<Scalars['Float']['input']>;
  gte?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<Scalars['Float']['input']>>;
  lt?: InputMaybe<Scalars['Float']['input']>;
  lte?: InputMaybe<Scalars['Float']['input']>;
  not?: InputMaybe<NestedFloatNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['Float']['input']>>;
};

export type NestedIntFilter = {
  equals?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  not?: InputMaybe<NestedIntFilter>;
  notIn?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type NestedIntNullableFilter = {
  equals?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  not?: InputMaybe<NestedIntNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type NestedIntNullableWithAggregatesFilter = {
  _avg?: InputMaybe<NestedFloatNullableFilter>;
  _count?: InputMaybe<NestedIntNullableFilter>;
  _max?: InputMaybe<NestedIntNullableFilter>;
  _min?: InputMaybe<NestedIntNullableFilter>;
  _sum?: InputMaybe<NestedIntNullableFilter>;
  equals?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  not?: InputMaybe<NestedIntNullableWithAggregatesFilter>;
  notIn?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type NestedIntWithAggregatesFilter = {
  _avg?: InputMaybe<NestedFloatFilter>;
  _count?: InputMaybe<NestedIntFilter>;
  _max?: InputMaybe<NestedIntFilter>;
  _min?: InputMaybe<NestedIntFilter>;
  _sum?: InputMaybe<NestedIntFilter>;
  equals?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  not?: InputMaybe<NestedIntWithAggregatesFilter>;
  notIn?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type NestedJsonNullableFilter = {
  array_contains?: InputMaybe<Scalars['Json']['input']>;
  array_ends_with?: InputMaybe<Scalars['Json']['input']>;
  array_starts_with?: InputMaybe<Scalars['Json']['input']>;
  equals?: InputMaybe<Scalars['Json']['input']>;
  gt?: InputMaybe<Scalars['Json']['input']>;
  gte?: InputMaybe<Scalars['Json']['input']>;
  lt?: InputMaybe<Scalars['Json']['input']>;
  lte?: InputMaybe<Scalars['Json']['input']>;
  mode?: InputMaybe<QueryMode>;
  not?: InputMaybe<Scalars['Json']['input']>;
  path?: InputMaybe<Array<Scalars['String']['input']>>;
  string_contains?: InputMaybe<Scalars['String']['input']>;
  string_ends_with?: InputMaybe<Scalars['String']['input']>;
  string_starts_with?: InputMaybe<Scalars['String']['input']>;
};

export type NestedStringFilter = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  not?: InputMaybe<NestedStringFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type NestedStringNullableFilter = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  not?: InputMaybe<NestedStringNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type NestedStringNullableWithAggregatesFilter = {
  _count?: InputMaybe<NestedIntNullableFilter>;
  _max?: InputMaybe<NestedStringNullableFilter>;
  _min?: InputMaybe<NestedStringNullableFilter>;
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  not?: InputMaybe<NestedStringNullableWithAggregatesFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type NestedStringWithAggregatesFilter = {
  _count?: InputMaybe<NestedIntFilter>;
  _max?: InputMaybe<NestedStringFilter>;
  _min?: InputMaybe<NestedStringFilter>;
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  not?: InputMaybe<NestedStringWithAggregatesFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type NestedUuidFilter = {
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  not?: InputMaybe<NestedUuidFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type NestedUuidWithAggregatesFilter = {
  _count?: InputMaybe<NestedIntFilter>;
  _max?: InputMaybe<NestedStringFilter>;
  _min?: InputMaybe<NestedStringFilter>;
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  not?: InputMaybe<NestedUuidWithAggregatesFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type NullableBoolFieldUpdateOperationsInput = {
  set?: InputMaybe<Scalars['Boolean']['input']>;
};

export type NullableDateTimeFieldUpdateOperationsInput = {
  set?: InputMaybe<Scalars['DateTime']['input']>;
};

export type NullableIntFieldUpdateOperationsInput = {
  decrement?: InputMaybe<Scalars['Int']['input']>;
  divide?: InputMaybe<Scalars['Int']['input']>;
  increment?: InputMaybe<Scalars['Int']['input']>;
  multiply?: InputMaybe<Scalars['Int']['input']>;
  set?: InputMaybe<Scalars['Int']['input']>;
};

export enum NullableJsonNullValueInput {
  DbNull = 'DbNull',
  JsonNull = 'JsonNull'
}

export type NullableStringFieldUpdateOperationsInput = {
  set?: InputMaybe<Scalars['String']['input']>;
};

export enum NullsOrder {
  First = 'first',
  Last = 'last'
}

export enum ProgressStatus {
  Completed = 'COMPLETED',
  InProgress = 'IN_PROGRESS',
  NotStarted = 'NOT_STARTED'
}

export type Query = {
  __typename?: 'Query';
  adminCourse?: Maybe<Course>;
  adminGetAllCourses?: Maybe<Array<Course>>;
  adminMyCourse?: Maybe<Course>;
  adminMyCoursesWithContent?: Maybe<Array<Course>>;
  adminMySkillNode?: Maybe<SkillNode>;
  adminMySkillNodes?: Maybe<Array<SkillNode>>;
  adminMySkillTree?: Maybe<SkillTree>;
  adminMySkillTrees?: Maybe<Array<SkillTree>>;
  adminSkillNode?: Maybe<SkillNode>;
  adminSkillNodes?: Maybe<Array<SkillNode>>;
  adminSkillTree?: Maybe<SkillTree>;
  adminSkillTrees?: Maybe<Array<SkillTree>>;
  allUsers?: Maybe<Array<User>>;
  getCourseProgress?: Maybe<CourseProgress>;
  lessonBlock?: Maybe<LessonBlocks>;
  lessonBlocks?: Maybe<Array<LessonBlocks>>;
  lessonBlocksByNode?: Maybe<Array<LessonBlocks>>;
  myProgress?: Maybe<Array<UserNodeProgress>>;
  nodeProgress?: Maybe<UserNodeProgress>;
  skillNode?: Maybe<SkillNode>;
  skillNodes?: Maybe<Array<SkillNode>>;
  skillNodesByTree?: Maybe<Array<SkillNode>>;
};


export type QueryAdminCourseArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAdminGetAllCoursesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<CourseStatus>;
};


export type QueryAdminMyCourseArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAdminMyCoursesWithContentArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<CourseStatus>;
};


export type QueryAdminMySkillNodeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAdminMySkillNodesArgs = {
  courseId?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  treeId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryAdminMySkillTreeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAdminMySkillTreesArgs = {
  courseId?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryAdminSkillNodeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAdminSkillNodesArgs = {
  courseId?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  treeId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryAdminSkillTreeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAdminSkillTreesArgs = {
  courseId?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryAllUsersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetCourseProgressArgs = {
  courseId: Scalars['ID']['input'];
  userId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryLessonBlockArgs = {
  id: Scalars['ID']['input'];
};


export type QueryLessonBlocksArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryLessonBlocksByNodeArgs = {
  nodeId: Scalars['ID']['input'];
};


export type QueryMyProgressArgs = {
  userId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryNodeProgressArgs = {
  nodeId: Scalars['ID']['input'];
  userId?: InputMaybe<Scalars['ID']['input']>;
};


export type QuerySkillNodeArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySkillNodesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerySkillNodesByTreeArgs = {
  treeId: Scalars['ID']['input'];
};

export enum QueryMode {
  Default = 'default',
  Insensitive = 'insensitive'
}

export enum QuestionType {
  MultipleChoice = 'MULTIPLE_CHOICE',
  OpenQuestion = 'OPEN_QUESTION',
  SingleChoice = 'SINGLE_CHOICE'
}

export type Quiz = {
  __typename?: 'Quiz';
  attempts: Array<QuizAttempt>;
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  node: SkillNode;
  nodeId: Scalars['String']['output'];
  questions: Array<QuizQuestion>;
  required: Scalars['Boolean']['output'];
  title?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};


export type QuizAttemptsArgs = {
  cursor?: InputMaybe<QuizAttemptWhereUniqueInput>;
  distinct?: InputMaybe<Array<QuizAttemptScalarFieldEnum>>;
  orderBy?: InputMaybe<Array<QuizAttemptOrderByWithRelationInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<QuizAttemptWhereInput>;
};


export type QuizQuestionsArgs = {
  cursor?: InputMaybe<QuizQuestionWhereUniqueInput>;
  distinct?: InputMaybe<Array<QuizQuestionScalarFieldEnum>>;
  orderBy?: InputMaybe<Array<QuizQuestionOrderByWithRelationInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<QuizQuestionWhereInput>;
};

export type QuizAttempt = {
  __typename?: 'QuizAttempt';
  answers: Array<QuizAttemptAnswer>;
  id: Scalars['ID']['output'];
  passed: Scalars['Boolean']['output'];
  quiz: Quiz;
  quizId: Scalars['String']['output'];
  takenAt: Scalars['DateTime']['output'];
  user: User;
  userId: Scalars['String']['output'];
};


export type QuizAttemptAnswersArgs = {
  cursor?: InputMaybe<QuizAttemptAnswerWhereUniqueInput>;
  distinct?: InputMaybe<Array<QuizAttemptAnswerScalarFieldEnum>>;
  orderBy?: InputMaybe<Array<QuizAttemptAnswerOrderByWithRelationInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<QuizAttemptAnswerWhereInput>;
};

export type QuizAttemptAnswer = {
  __typename?: 'QuizAttemptAnswer';
  answer?: Maybe<Scalars['Json']['output']>;
  attempt: QuizAttempt;
  attemptId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isCorrect?: Maybe<Scalars['Boolean']['output']>;
  question: QuizQuestion;
  questionId: Scalars['String']['output'];
};

export type QuizAttemptAnswerAttemptIdQuestionIdCompoundUniqueInput = {
  attemptId: Scalars['String']['input'];
  questionId: Scalars['String']['input'];
};

export type QuizAttemptAnswerCountOrderByAggregateInput = {
  answer?: InputMaybe<SortOrder>;
  attemptId?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  isCorrect?: InputMaybe<SortOrder>;
  questionId?: InputMaybe<SortOrder>;
};

export type QuizAttemptAnswerCreateInput = {
  answer?: InputMaybe<Scalars['Json']['input']>;
  attempt: QuizAttemptCreateNestedOneWithoutAnswersInput;
  id?: InputMaybe<Scalars['String']['input']>;
  isCorrect?: InputMaybe<Scalars['Boolean']['input']>;
  question: QuizQuestionCreateNestedOneWithoutAnswersInput;
};

export type QuizAttemptAnswerCreateManyAttemptInput = {
  answer?: InputMaybe<Scalars['Json']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  isCorrect?: InputMaybe<Scalars['Boolean']['input']>;
  questionId: Scalars['String']['input'];
};

export type QuizAttemptAnswerCreateManyAttemptInputEnvelope = {
  data: Array<QuizAttemptAnswerCreateManyAttemptInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type QuizAttemptAnswerCreateManyInput = {
  answer?: InputMaybe<Scalars['Json']['input']>;
  attemptId: Scalars['String']['input'];
  id?: InputMaybe<Scalars['String']['input']>;
  isCorrect?: InputMaybe<Scalars['Boolean']['input']>;
  questionId: Scalars['String']['input'];
};

export type QuizAttemptAnswerCreateManyQuestionInput = {
  answer?: InputMaybe<Scalars['Json']['input']>;
  attemptId: Scalars['String']['input'];
  id?: InputMaybe<Scalars['String']['input']>;
  isCorrect?: InputMaybe<Scalars['Boolean']['input']>;
};

export type QuizAttemptAnswerCreateManyQuestionInputEnvelope = {
  data: Array<QuizAttemptAnswerCreateManyQuestionInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type QuizAttemptAnswerCreateNestedManyWithoutAttemptInput = {
  connect?: InputMaybe<Array<QuizAttemptAnswerWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<QuizAttemptAnswerCreateOrConnectWithoutAttemptInput>>;
  create?: InputMaybe<Array<QuizAttemptAnswerCreateWithoutAttemptInput>>;
  createMany?: InputMaybe<QuizAttemptAnswerCreateManyAttemptInputEnvelope>;
};

export type QuizAttemptAnswerCreateNestedManyWithoutQuestionInput = {
  connect?: InputMaybe<Array<QuizAttemptAnswerWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<QuizAttemptAnswerCreateOrConnectWithoutQuestionInput>>;
  create?: InputMaybe<Array<QuizAttemptAnswerCreateWithoutQuestionInput>>;
  createMany?: InputMaybe<QuizAttemptAnswerCreateManyQuestionInputEnvelope>;
};

export type QuizAttemptAnswerCreateOrConnectWithoutAttemptInput = {
  create: QuizAttemptAnswerCreateWithoutAttemptInput;
  where: QuizAttemptAnswerWhereUniqueInput;
};

export type QuizAttemptAnswerCreateOrConnectWithoutQuestionInput = {
  create: QuizAttemptAnswerCreateWithoutQuestionInput;
  where: QuizAttemptAnswerWhereUniqueInput;
};

export type QuizAttemptAnswerCreateWithoutAttemptInput = {
  answer?: InputMaybe<Scalars['Json']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  isCorrect?: InputMaybe<Scalars['Boolean']['input']>;
  question: QuizQuestionCreateNestedOneWithoutAnswersInput;
};

export type QuizAttemptAnswerCreateWithoutQuestionInput = {
  answer?: InputMaybe<Scalars['Json']['input']>;
  attempt: QuizAttemptCreateNestedOneWithoutAnswersInput;
  id?: InputMaybe<Scalars['String']['input']>;
  isCorrect?: InputMaybe<Scalars['Boolean']['input']>;
};

export type QuizAttemptAnswerListRelationFilter = {
  every?: InputMaybe<QuizAttemptAnswerWhereInput>;
  none?: InputMaybe<QuizAttemptAnswerWhereInput>;
  some?: InputMaybe<QuizAttemptAnswerWhereInput>;
};

export type QuizAttemptAnswerMaxOrderByAggregateInput = {
  attemptId?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  isCorrect?: InputMaybe<SortOrder>;
  questionId?: InputMaybe<SortOrder>;
};

export type QuizAttemptAnswerMinOrderByAggregateInput = {
  attemptId?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  isCorrect?: InputMaybe<SortOrder>;
  questionId?: InputMaybe<SortOrder>;
};

export type QuizAttemptAnswerOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type QuizAttemptAnswerOrderByWithAggregationInput = {
  _count?: InputMaybe<QuizAttemptAnswerCountOrderByAggregateInput>;
  _max?: InputMaybe<QuizAttemptAnswerMaxOrderByAggregateInput>;
  _min?: InputMaybe<QuizAttemptAnswerMinOrderByAggregateInput>;
  answer?: InputMaybe<SortOrder>;
  attemptId?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  isCorrect?: InputMaybe<SortOrder>;
  questionId?: InputMaybe<SortOrder>;
};

export type QuizAttemptAnswerOrderByWithRelationInput = {
  answer?: InputMaybe<SortOrder>;
  attempt?: InputMaybe<QuizAttemptOrderByWithRelationInput>;
  attemptId?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  isCorrect?: InputMaybe<SortOrder>;
  question?: InputMaybe<QuizQuestionOrderByWithRelationInput>;
  questionId?: InputMaybe<SortOrder>;
};

export enum QuizAttemptAnswerScalarFieldEnum {
  Answer = 'answer',
  AttemptId = 'attemptId',
  Id = 'id',
  IsCorrect = 'isCorrect',
  QuestionId = 'questionId'
}

export type QuizAttemptAnswerScalarWhereInput = {
  AND?: InputMaybe<Array<QuizAttemptAnswerScalarWhereInput>>;
  NOT?: InputMaybe<Array<QuizAttemptAnswerScalarWhereInput>>;
  OR?: InputMaybe<Array<QuizAttemptAnswerScalarWhereInput>>;
  answer?: InputMaybe<JsonNullableFilter>;
  attemptId?: InputMaybe<UuidFilter>;
  id?: InputMaybe<UuidFilter>;
  isCorrect?: InputMaybe<BoolNullableFilter>;
  questionId?: InputMaybe<UuidFilter>;
};

export type QuizAttemptAnswerScalarWhereWithAggregatesInput = {
  AND?: InputMaybe<Array<QuizAttemptAnswerScalarWhereWithAggregatesInput>>;
  NOT?: InputMaybe<Array<QuizAttemptAnswerScalarWhereWithAggregatesInput>>;
  OR?: InputMaybe<Array<QuizAttemptAnswerScalarWhereWithAggregatesInput>>;
  answer?: InputMaybe<JsonNullableWithAggregatesFilter>;
  attemptId?: InputMaybe<UuidWithAggregatesFilter>;
  id?: InputMaybe<UuidWithAggregatesFilter>;
  isCorrect?: InputMaybe<BoolNullableWithAggregatesFilter>;
  questionId?: InputMaybe<UuidWithAggregatesFilter>;
};

export type QuizAttemptAnswerUpdateInput = {
  answer?: InputMaybe<Scalars['Json']['input']>;
  attempt?: InputMaybe<QuizAttemptUpdateOneRequiredWithoutAnswersNestedInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  isCorrect?: InputMaybe<NullableBoolFieldUpdateOperationsInput>;
  question?: InputMaybe<QuizQuestionUpdateOneRequiredWithoutAnswersNestedInput>;
};

export type QuizAttemptAnswerUpdateManyMutationInput = {
  answer?: InputMaybe<Scalars['Json']['input']>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  isCorrect?: InputMaybe<NullableBoolFieldUpdateOperationsInput>;
};

export type QuizAttemptAnswerUpdateManyWithWhereWithoutAttemptInput = {
  data: QuizAttemptAnswerUpdateManyMutationInput;
  where: QuizAttemptAnswerScalarWhereInput;
};

export type QuizAttemptAnswerUpdateManyWithWhereWithoutQuestionInput = {
  data: QuizAttemptAnswerUpdateManyMutationInput;
  where: QuizAttemptAnswerScalarWhereInput;
};

export type QuizAttemptAnswerUpdateManyWithoutAttemptNestedInput = {
  connect?: InputMaybe<Array<QuizAttemptAnswerWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<QuizAttemptAnswerCreateOrConnectWithoutAttemptInput>>;
  create?: InputMaybe<Array<QuizAttemptAnswerCreateWithoutAttemptInput>>;
  createMany?: InputMaybe<QuizAttemptAnswerCreateManyAttemptInputEnvelope>;
  delete?: InputMaybe<Array<QuizAttemptAnswerWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<QuizAttemptAnswerScalarWhereInput>>;
  disconnect?: InputMaybe<Array<QuizAttemptAnswerWhereUniqueInput>>;
  set?: InputMaybe<Array<QuizAttemptAnswerWhereUniqueInput>>;
  update?: InputMaybe<Array<QuizAttemptAnswerUpdateWithWhereUniqueWithoutAttemptInput>>;
  updateMany?: InputMaybe<Array<QuizAttemptAnswerUpdateManyWithWhereWithoutAttemptInput>>;
  upsert?: InputMaybe<Array<QuizAttemptAnswerUpsertWithWhereUniqueWithoutAttemptInput>>;
};

export type QuizAttemptAnswerUpdateManyWithoutQuestionNestedInput = {
  connect?: InputMaybe<Array<QuizAttemptAnswerWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<QuizAttemptAnswerCreateOrConnectWithoutQuestionInput>>;
  create?: InputMaybe<Array<QuizAttemptAnswerCreateWithoutQuestionInput>>;
  createMany?: InputMaybe<QuizAttemptAnswerCreateManyQuestionInputEnvelope>;
  delete?: InputMaybe<Array<QuizAttemptAnswerWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<QuizAttemptAnswerScalarWhereInput>>;
  disconnect?: InputMaybe<Array<QuizAttemptAnswerWhereUniqueInput>>;
  set?: InputMaybe<Array<QuizAttemptAnswerWhereUniqueInput>>;
  update?: InputMaybe<Array<QuizAttemptAnswerUpdateWithWhereUniqueWithoutQuestionInput>>;
  updateMany?: InputMaybe<Array<QuizAttemptAnswerUpdateManyWithWhereWithoutQuestionInput>>;
  upsert?: InputMaybe<Array<QuizAttemptAnswerUpsertWithWhereUniqueWithoutQuestionInput>>;
};

export type QuizAttemptAnswerUpdateWithWhereUniqueWithoutAttemptInput = {
  data: QuizAttemptAnswerUpdateWithoutAttemptInput;
  where: QuizAttemptAnswerWhereUniqueInput;
};

export type QuizAttemptAnswerUpdateWithWhereUniqueWithoutQuestionInput = {
  data: QuizAttemptAnswerUpdateWithoutQuestionInput;
  where: QuizAttemptAnswerWhereUniqueInput;
};

export type QuizAttemptAnswerUpdateWithoutAttemptInput = {
  answer?: InputMaybe<Scalars['Json']['input']>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  isCorrect?: InputMaybe<NullableBoolFieldUpdateOperationsInput>;
  question?: InputMaybe<QuizQuestionUpdateOneRequiredWithoutAnswersNestedInput>;
};

export type QuizAttemptAnswerUpdateWithoutQuestionInput = {
  answer?: InputMaybe<Scalars['Json']['input']>;
  attempt?: InputMaybe<QuizAttemptUpdateOneRequiredWithoutAnswersNestedInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  isCorrect?: InputMaybe<NullableBoolFieldUpdateOperationsInput>;
};

export type QuizAttemptAnswerUpsertWithWhereUniqueWithoutAttemptInput = {
  create: QuizAttemptAnswerCreateWithoutAttemptInput;
  update: QuizAttemptAnswerUpdateWithoutAttemptInput;
  where: QuizAttemptAnswerWhereUniqueInput;
};

export type QuizAttemptAnswerUpsertWithWhereUniqueWithoutQuestionInput = {
  create: QuizAttemptAnswerCreateWithoutQuestionInput;
  update: QuizAttemptAnswerUpdateWithoutQuestionInput;
  where: QuizAttemptAnswerWhereUniqueInput;
};

export type QuizAttemptAnswerWhereInput = {
  AND?: InputMaybe<Array<QuizAttemptAnswerWhereInput>>;
  NOT?: InputMaybe<Array<QuizAttemptAnswerWhereInput>>;
  OR?: InputMaybe<Array<QuizAttemptAnswerWhereInput>>;
  answer?: InputMaybe<JsonNullableFilter>;
  attempt?: InputMaybe<QuizAttemptWhereInput>;
  attemptId?: InputMaybe<UuidFilter>;
  id?: InputMaybe<UuidFilter>;
  isCorrect?: InputMaybe<BoolNullableFilter>;
  question?: InputMaybe<QuizQuestionWhereInput>;
  questionId?: InputMaybe<UuidFilter>;
};

export type QuizAttemptAnswerWhereUniqueInput = {
  AND?: InputMaybe<Array<QuizAttemptAnswerWhereInput>>;
  NOT?: InputMaybe<Array<QuizAttemptAnswerWhereInput>>;
  OR?: InputMaybe<Array<QuizAttemptAnswerWhereInput>>;
  answer?: InputMaybe<JsonNullableFilter>;
  attempt?: InputMaybe<QuizAttemptWhereInput>;
  attemptId?: InputMaybe<UuidFilter>;
  attemptId_questionId?: InputMaybe<QuizAttemptAnswerAttemptIdQuestionIdCompoundUniqueInput>;
  id?: InputMaybe<Scalars['String']['input']>;
  isCorrect?: InputMaybe<BoolNullableFilter>;
  question?: InputMaybe<QuizQuestionWhereInput>;
  questionId?: InputMaybe<UuidFilter>;
};

export type QuizAttemptCountOrderByAggregateInput = {
  id?: InputMaybe<SortOrder>;
  passed?: InputMaybe<SortOrder>;
  quizId?: InputMaybe<SortOrder>;
  takenAt?: InputMaybe<SortOrder>;
  userId?: InputMaybe<SortOrder>;
};

export type QuizAttemptCreateInput = {
  answers?: InputMaybe<QuizAttemptAnswerCreateNestedManyWithoutAttemptInput>;
  id?: InputMaybe<Scalars['String']['input']>;
  passed: Scalars['Boolean']['input'];
  quiz: QuizCreateNestedOneWithoutAttemptsInput;
  takenAt?: InputMaybe<Scalars['DateTime']['input']>;
  user: UserCreateNestedOneWithoutQuizAttemptsInput;
};

export type QuizAttemptCreateManyInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  passed: Scalars['Boolean']['input'];
  quizId: Scalars['String']['input'];
  takenAt?: InputMaybe<Scalars['DateTime']['input']>;
  userId: Scalars['String']['input'];
};

export type QuizAttemptCreateManyQuizInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  passed: Scalars['Boolean']['input'];
  takenAt?: InputMaybe<Scalars['DateTime']['input']>;
  userId: Scalars['String']['input'];
};

export type QuizAttemptCreateManyQuizInputEnvelope = {
  data: Array<QuizAttemptCreateManyQuizInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type QuizAttemptCreateManyUserInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  passed: Scalars['Boolean']['input'];
  quizId: Scalars['String']['input'];
  takenAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type QuizAttemptCreateManyUserInputEnvelope = {
  data: Array<QuizAttemptCreateManyUserInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type QuizAttemptCreateNestedManyWithoutQuizInput = {
  connect?: InputMaybe<Array<QuizAttemptWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<QuizAttemptCreateOrConnectWithoutQuizInput>>;
  create?: InputMaybe<Array<QuizAttemptCreateWithoutQuizInput>>;
  createMany?: InputMaybe<QuizAttemptCreateManyQuizInputEnvelope>;
};

export type QuizAttemptCreateNestedManyWithoutUserInput = {
  connect?: InputMaybe<Array<QuizAttemptWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<QuizAttemptCreateOrConnectWithoutUserInput>>;
  create?: InputMaybe<Array<QuizAttemptCreateWithoutUserInput>>;
  createMany?: InputMaybe<QuizAttemptCreateManyUserInputEnvelope>;
};

export type QuizAttemptCreateNestedOneWithoutAnswersInput = {
  connect?: InputMaybe<QuizAttemptWhereUniqueInput>;
  connectOrCreate?: InputMaybe<QuizAttemptCreateOrConnectWithoutAnswersInput>;
  create?: InputMaybe<QuizAttemptCreateWithoutAnswersInput>;
};

export type QuizAttemptCreateOrConnectWithoutAnswersInput = {
  create: QuizAttemptCreateWithoutAnswersInput;
  where: QuizAttemptWhereUniqueInput;
};

export type QuizAttemptCreateOrConnectWithoutQuizInput = {
  create: QuizAttemptCreateWithoutQuizInput;
  where: QuizAttemptWhereUniqueInput;
};

export type QuizAttemptCreateOrConnectWithoutUserInput = {
  create: QuizAttemptCreateWithoutUserInput;
  where: QuizAttemptWhereUniqueInput;
};

export type QuizAttemptCreateWithoutAnswersInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  passed: Scalars['Boolean']['input'];
  quiz: QuizCreateNestedOneWithoutAttemptsInput;
  takenAt?: InputMaybe<Scalars['DateTime']['input']>;
  user: UserCreateNestedOneWithoutQuizAttemptsInput;
};

export type QuizAttemptCreateWithoutQuizInput = {
  answers?: InputMaybe<QuizAttemptAnswerCreateNestedManyWithoutAttemptInput>;
  id?: InputMaybe<Scalars['String']['input']>;
  passed: Scalars['Boolean']['input'];
  takenAt?: InputMaybe<Scalars['DateTime']['input']>;
  user: UserCreateNestedOneWithoutQuizAttemptsInput;
};

export type QuizAttemptCreateWithoutUserInput = {
  answers?: InputMaybe<QuizAttemptAnswerCreateNestedManyWithoutAttemptInput>;
  id?: InputMaybe<Scalars['String']['input']>;
  passed: Scalars['Boolean']['input'];
  quiz: QuizCreateNestedOneWithoutAttemptsInput;
  takenAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type QuizAttemptListRelationFilter = {
  every?: InputMaybe<QuizAttemptWhereInput>;
  none?: InputMaybe<QuizAttemptWhereInput>;
  some?: InputMaybe<QuizAttemptWhereInput>;
};

export type QuizAttemptMaxOrderByAggregateInput = {
  id?: InputMaybe<SortOrder>;
  passed?: InputMaybe<SortOrder>;
  quizId?: InputMaybe<SortOrder>;
  takenAt?: InputMaybe<SortOrder>;
  userId?: InputMaybe<SortOrder>;
};

export type QuizAttemptMinOrderByAggregateInput = {
  id?: InputMaybe<SortOrder>;
  passed?: InputMaybe<SortOrder>;
  quizId?: InputMaybe<SortOrder>;
  takenAt?: InputMaybe<SortOrder>;
  userId?: InputMaybe<SortOrder>;
};

export type QuizAttemptOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type QuizAttemptOrderByWithAggregationInput = {
  _count?: InputMaybe<QuizAttemptCountOrderByAggregateInput>;
  _max?: InputMaybe<QuizAttemptMaxOrderByAggregateInput>;
  _min?: InputMaybe<QuizAttemptMinOrderByAggregateInput>;
  id?: InputMaybe<SortOrder>;
  passed?: InputMaybe<SortOrder>;
  quizId?: InputMaybe<SortOrder>;
  takenAt?: InputMaybe<SortOrder>;
  userId?: InputMaybe<SortOrder>;
};

export type QuizAttemptOrderByWithRelationInput = {
  answers?: InputMaybe<QuizAttemptAnswerOrderByRelationAggregateInput>;
  id?: InputMaybe<SortOrder>;
  passed?: InputMaybe<SortOrder>;
  quiz?: InputMaybe<QuizOrderByWithRelationInput>;
  quizId?: InputMaybe<SortOrder>;
  takenAt?: InputMaybe<SortOrder>;
  user?: InputMaybe<UserOrderByWithRelationInput>;
  userId?: InputMaybe<SortOrder>;
};

export enum QuizAttemptScalarFieldEnum {
  Id = 'id',
  Passed = 'passed',
  QuizId = 'quizId',
  TakenAt = 'takenAt',
  UserId = 'userId'
}

export type QuizAttemptScalarRelationFilter = {
  is?: InputMaybe<QuizAttemptWhereInput>;
  isNot?: InputMaybe<QuizAttemptWhereInput>;
};

export type QuizAttemptScalarWhereInput = {
  AND?: InputMaybe<Array<QuizAttemptScalarWhereInput>>;
  NOT?: InputMaybe<Array<QuizAttemptScalarWhereInput>>;
  OR?: InputMaybe<Array<QuizAttemptScalarWhereInput>>;
  id?: InputMaybe<UuidFilter>;
  passed?: InputMaybe<BoolFilter>;
  quizId?: InputMaybe<UuidFilter>;
  takenAt?: InputMaybe<DateTimeFilter>;
  userId?: InputMaybe<StringFilter>;
};

export type QuizAttemptScalarWhereWithAggregatesInput = {
  AND?: InputMaybe<Array<QuizAttemptScalarWhereWithAggregatesInput>>;
  NOT?: InputMaybe<Array<QuizAttemptScalarWhereWithAggregatesInput>>;
  OR?: InputMaybe<Array<QuizAttemptScalarWhereWithAggregatesInput>>;
  id?: InputMaybe<UuidWithAggregatesFilter>;
  passed?: InputMaybe<BoolWithAggregatesFilter>;
  quizId?: InputMaybe<UuidWithAggregatesFilter>;
  takenAt?: InputMaybe<DateTimeWithAggregatesFilter>;
  userId?: InputMaybe<StringWithAggregatesFilter>;
};

export type QuizAttemptUpdateInput = {
  answers?: InputMaybe<QuizAttemptAnswerUpdateManyWithoutAttemptNestedInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  passed?: InputMaybe<BoolFieldUpdateOperationsInput>;
  quiz?: InputMaybe<QuizUpdateOneRequiredWithoutAttemptsNestedInput>;
  takenAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  user?: InputMaybe<UserUpdateOneRequiredWithoutQuizAttemptsNestedInput>;
};

export type QuizAttemptUpdateManyMutationInput = {
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  passed?: InputMaybe<BoolFieldUpdateOperationsInput>;
  takenAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type QuizAttemptUpdateManyWithWhereWithoutQuizInput = {
  data: QuizAttemptUpdateManyMutationInput;
  where: QuizAttemptScalarWhereInput;
};

export type QuizAttemptUpdateManyWithWhereWithoutUserInput = {
  data: QuizAttemptUpdateManyMutationInput;
  where: QuizAttemptScalarWhereInput;
};

export type QuizAttemptUpdateManyWithoutQuizNestedInput = {
  connect?: InputMaybe<Array<QuizAttemptWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<QuizAttemptCreateOrConnectWithoutQuizInput>>;
  create?: InputMaybe<Array<QuizAttemptCreateWithoutQuizInput>>;
  createMany?: InputMaybe<QuizAttemptCreateManyQuizInputEnvelope>;
  delete?: InputMaybe<Array<QuizAttemptWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<QuizAttemptScalarWhereInput>>;
  disconnect?: InputMaybe<Array<QuizAttemptWhereUniqueInput>>;
  set?: InputMaybe<Array<QuizAttemptWhereUniqueInput>>;
  update?: InputMaybe<Array<QuizAttemptUpdateWithWhereUniqueWithoutQuizInput>>;
  updateMany?: InputMaybe<Array<QuizAttemptUpdateManyWithWhereWithoutQuizInput>>;
  upsert?: InputMaybe<Array<QuizAttemptUpsertWithWhereUniqueWithoutQuizInput>>;
};

export type QuizAttemptUpdateManyWithoutUserNestedInput = {
  connect?: InputMaybe<Array<QuizAttemptWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<QuizAttemptCreateOrConnectWithoutUserInput>>;
  create?: InputMaybe<Array<QuizAttemptCreateWithoutUserInput>>;
  createMany?: InputMaybe<QuizAttemptCreateManyUserInputEnvelope>;
  delete?: InputMaybe<Array<QuizAttemptWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<QuizAttemptScalarWhereInput>>;
  disconnect?: InputMaybe<Array<QuizAttemptWhereUniqueInput>>;
  set?: InputMaybe<Array<QuizAttemptWhereUniqueInput>>;
  update?: InputMaybe<Array<QuizAttemptUpdateWithWhereUniqueWithoutUserInput>>;
  updateMany?: InputMaybe<Array<QuizAttemptUpdateManyWithWhereWithoutUserInput>>;
  upsert?: InputMaybe<Array<QuizAttemptUpsertWithWhereUniqueWithoutUserInput>>;
};

export type QuizAttemptUpdateOneRequiredWithoutAnswersNestedInput = {
  connect?: InputMaybe<QuizAttemptWhereUniqueInput>;
  connectOrCreate?: InputMaybe<QuizAttemptCreateOrConnectWithoutAnswersInput>;
  create?: InputMaybe<QuizAttemptCreateWithoutAnswersInput>;
  update?: InputMaybe<QuizAttemptUpdateToOneWithWhereWithoutAnswersInput>;
  upsert?: InputMaybe<QuizAttemptUpsertWithoutAnswersInput>;
};

export type QuizAttemptUpdateToOneWithWhereWithoutAnswersInput = {
  data: QuizAttemptUpdateWithoutAnswersInput;
  where?: InputMaybe<QuizAttemptWhereInput>;
};

export type QuizAttemptUpdateWithWhereUniqueWithoutQuizInput = {
  data: QuizAttemptUpdateWithoutQuizInput;
  where: QuizAttemptWhereUniqueInput;
};

export type QuizAttemptUpdateWithWhereUniqueWithoutUserInput = {
  data: QuizAttemptUpdateWithoutUserInput;
  where: QuizAttemptWhereUniqueInput;
};

export type QuizAttemptUpdateWithoutAnswersInput = {
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  passed?: InputMaybe<BoolFieldUpdateOperationsInput>;
  quiz?: InputMaybe<QuizUpdateOneRequiredWithoutAttemptsNestedInput>;
  takenAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  user?: InputMaybe<UserUpdateOneRequiredWithoutQuizAttemptsNestedInput>;
};

export type QuizAttemptUpdateWithoutQuizInput = {
  answers?: InputMaybe<QuizAttemptAnswerUpdateManyWithoutAttemptNestedInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  passed?: InputMaybe<BoolFieldUpdateOperationsInput>;
  takenAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  user?: InputMaybe<UserUpdateOneRequiredWithoutQuizAttemptsNestedInput>;
};

export type QuizAttemptUpdateWithoutUserInput = {
  answers?: InputMaybe<QuizAttemptAnswerUpdateManyWithoutAttemptNestedInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  passed?: InputMaybe<BoolFieldUpdateOperationsInput>;
  quiz?: InputMaybe<QuizUpdateOneRequiredWithoutAttemptsNestedInput>;
  takenAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type QuizAttemptUpsertWithWhereUniqueWithoutQuizInput = {
  create: QuizAttemptCreateWithoutQuizInput;
  update: QuizAttemptUpdateWithoutQuizInput;
  where: QuizAttemptWhereUniqueInput;
};

export type QuizAttemptUpsertWithWhereUniqueWithoutUserInput = {
  create: QuizAttemptCreateWithoutUserInput;
  update: QuizAttemptUpdateWithoutUserInput;
  where: QuizAttemptWhereUniqueInput;
};

export type QuizAttemptUpsertWithoutAnswersInput = {
  create: QuizAttemptCreateWithoutAnswersInput;
  update: QuizAttemptUpdateWithoutAnswersInput;
  where?: InputMaybe<QuizAttemptWhereInput>;
};

export type QuizAttemptWhereInput = {
  AND?: InputMaybe<Array<QuizAttemptWhereInput>>;
  NOT?: InputMaybe<Array<QuizAttemptWhereInput>>;
  OR?: InputMaybe<Array<QuizAttemptWhereInput>>;
  answers?: InputMaybe<QuizAttemptAnswerListRelationFilter>;
  id?: InputMaybe<UuidFilter>;
  passed?: InputMaybe<BoolFilter>;
  quiz?: InputMaybe<QuizWhereInput>;
  quizId?: InputMaybe<UuidFilter>;
  takenAt?: InputMaybe<DateTimeFilter>;
  user?: InputMaybe<UserWhereInput>;
  userId?: InputMaybe<StringFilter>;
};

export type QuizAttemptWhereUniqueInput = {
  AND?: InputMaybe<Array<QuizAttemptWhereInput>>;
  NOT?: InputMaybe<Array<QuizAttemptWhereInput>>;
  OR?: InputMaybe<Array<QuizAttemptWhereInput>>;
  answers?: InputMaybe<QuizAttemptAnswerListRelationFilter>;
  id?: InputMaybe<Scalars['String']['input']>;
  passed?: InputMaybe<BoolFilter>;
  quiz?: InputMaybe<QuizWhereInput>;
  quizId?: InputMaybe<UuidFilter>;
  takenAt?: InputMaybe<DateTimeFilter>;
  user?: InputMaybe<UserWhereInput>;
  userId?: InputMaybe<StringFilter>;
};

export type QuizCountOrderByAggregateInput = {
  createdAt?: InputMaybe<SortOrder>;
  deletedAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  nodeId?: InputMaybe<SortOrder>;
  required?: InputMaybe<SortOrder>;
  title?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type QuizCreateInput = {
  attempts?: InputMaybe<QuizAttemptCreateNestedManyWithoutQuizInput>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  deletedAt?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  node: SkillNodeCreateNestedOneWithoutQuizInput;
  questions?: InputMaybe<QuizQuestionCreateNestedManyWithoutQuizInput>;
  required?: InputMaybe<Scalars['Boolean']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type QuizCreateManyInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  deletedAt?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  nodeId: Scalars['String']['input'];
  required?: InputMaybe<Scalars['Boolean']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type QuizCreateNestedOneWithoutAttemptsInput = {
  connect?: InputMaybe<QuizWhereUniqueInput>;
  connectOrCreate?: InputMaybe<QuizCreateOrConnectWithoutAttemptsInput>;
  create?: InputMaybe<QuizCreateWithoutAttemptsInput>;
};

export type QuizCreateNestedOneWithoutNodeInput = {
  connect?: InputMaybe<QuizWhereUniqueInput>;
  connectOrCreate?: InputMaybe<QuizCreateOrConnectWithoutNodeInput>;
  create?: InputMaybe<QuizCreateWithoutNodeInput>;
};

export type QuizCreateNestedOneWithoutQuestionsInput = {
  connect?: InputMaybe<QuizWhereUniqueInput>;
  connectOrCreate?: InputMaybe<QuizCreateOrConnectWithoutQuestionsInput>;
  create?: InputMaybe<QuizCreateWithoutQuestionsInput>;
};

export type QuizCreateOrConnectWithoutAttemptsInput = {
  create: QuizCreateWithoutAttemptsInput;
  where: QuizWhereUniqueInput;
};

export type QuizCreateOrConnectWithoutNodeInput = {
  create: QuizCreateWithoutNodeInput;
  where: QuizWhereUniqueInput;
};

export type QuizCreateOrConnectWithoutQuestionsInput = {
  create: QuizCreateWithoutQuestionsInput;
  where: QuizWhereUniqueInput;
};

export type QuizCreateWithoutAttemptsInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  deletedAt?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  node: SkillNodeCreateNestedOneWithoutQuizInput;
  questions?: InputMaybe<QuizQuestionCreateNestedManyWithoutQuizInput>;
  required?: InputMaybe<Scalars['Boolean']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type QuizCreateWithoutNodeInput = {
  attempts?: InputMaybe<QuizAttemptCreateNestedManyWithoutQuizInput>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  deletedAt?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  questions?: InputMaybe<QuizQuestionCreateNestedManyWithoutQuizInput>;
  required?: InputMaybe<Scalars['Boolean']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type QuizCreateWithoutQuestionsInput = {
  attempts?: InputMaybe<QuizAttemptCreateNestedManyWithoutQuizInput>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  deletedAt?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  node: SkillNodeCreateNestedOneWithoutQuizInput;
  required?: InputMaybe<Scalars['Boolean']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type QuizMaxOrderByAggregateInput = {
  createdAt?: InputMaybe<SortOrder>;
  deletedAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  nodeId?: InputMaybe<SortOrder>;
  required?: InputMaybe<SortOrder>;
  title?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type QuizMinOrderByAggregateInput = {
  createdAt?: InputMaybe<SortOrder>;
  deletedAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  nodeId?: InputMaybe<SortOrder>;
  required?: InputMaybe<SortOrder>;
  title?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type QuizNullableScalarRelationFilter = {
  is?: InputMaybe<QuizWhereInput>;
  isNot?: InputMaybe<QuizWhereInput>;
};

export type QuizOption = {
  __typename?: 'QuizOption';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  isCorrect: Scalars['Boolean']['output'];
  question: QuizQuestion;
  questionId: Scalars['String']['output'];
  text: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type QuizOptionCountOrderByAggregateInput = {
  createdAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  isCorrect?: InputMaybe<SortOrder>;
  questionId?: InputMaybe<SortOrder>;
  text?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type QuizOptionCreateInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  isCorrect?: InputMaybe<Scalars['Boolean']['input']>;
  question: QuizQuestionCreateNestedOneWithoutOptionsInput;
  text: Scalars['String']['input'];
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type QuizOptionCreateManyInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  isCorrect?: InputMaybe<Scalars['Boolean']['input']>;
  questionId: Scalars['String']['input'];
  text: Scalars['String']['input'];
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type QuizOptionCreateManyQuestionInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  isCorrect?: InputMaybe<Scalars['Boolean']['input']>;
  text: Scalars['String']['input'];
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type QuizOptionCreateManyQuestionInputEnvelope = {
  data: Array<QuizOptionCreateManyQuestionInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type QuizOptionCreateNestedManyWithoutQuestionInput = {
  connect?: InputMaybe<Array<QuizOptionWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<QuizOptionCreateOrConnectWithoutQuestionInput>>;
  create?: InputMaybe<Array<QuizOptionCreateWithoutQuestionInput>>;
  createMany?: InputMaybe<QuizOptionCreateManyQuestionInputEnvelope>;
};

export type QuizOptionCreateOrConnectWithoutQuestionInput = {
  create: QuizOptionCreateWithoutQuestionInput;
  where: QuizOptionWhereUniqueInput;
};

export type QuizOptionCreateWithoutQuestionInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  isCorrect?: InputMaybe<Scalars['Boolean']['input']>;
  text: Scalars['String']['input'];
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type QuizOptionListRelationFilter = {
  every?: InputMaybe<QuizOptionWhereInput>;
  none?: InputMaybe<QuizOptionWhereInput>;
  some?: InputMaybe<QuizOptionWhereInput>;
};

export type QuizOptionMaxOrderByAggregateInput = {
  createdAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  isCorrect?: InputMaybe<SortOrder>;
  questionId?: InputMaybe<SortOrder>;
  text?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type QuizOptionMinOrderByAggregateInput = {
  createdAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  isCorrect?: InputMaybe<SortOrder>;
  questionId?: InputMaybe<SortOrder>;
  text?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type QuizOptionOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type QuizOptionOrderByWithAggregationInput = {
  _count?: InputMaybe<QuizOptionCountOrderByAggregateInput>;
  _max?: InputMaybe<QuizOptionMaxOrderByAggregateInput>;
  _min?: InputMaybe<QuizOptionMinOrderByAggregateInput>;
  createdAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  isCorrect?: InputMaybe<SortOrder>;
  questionId?: InputMaybe<SortOrder>;
  text?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type QuizOptionOrderByWithRelationInput = {
  createdAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  isCorrect?: InputMaybe<SortOrder>;
  question?: InputMaybe<QuizQuestionOrderByWithRelationInput>;
  questionId?: InputMaybe<SortOrder>;
  text?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export enum QuizOptionScalarFieldEnum {
  CreatedAt = 'createdAt',
  Id = 'id',
  IsCorrect = 'isCorrect',
  QuestionId = 'questionId',
  Text = 'text',
  UpdatedAt = 'updatedAt'
}

export type QuizOptionScalarWhereInput = {
  AND?: InputMaybe<Array<QuizOptionScalarWhereInput>>;
  NOT?: InputMaybe<Array<QuizOptionScalarWhereInput>>;
  OR?: InputMaybe<Array<QuizOptionScalarWhereInput>>;
  createdAt?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<UuidFilter>;
  isCorrect?: InputMaybe<BoolFilter>;
  questionId?: InputMaybe<UuidFilter>;
  text?: InputMaybe<StringFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type QuizOptionScalarWhereWithAggregatesInput = {
  AND?: InputMaybe<Array<QuizOptionScalarWhereWithAggregatesInput>>;
  NOT?: InputMaybe<Array<QuizOptionScalarWhereWithAggregatesInput>>;
  OR?: InputMaybe<Array<QuizOptionScalarWhereWithAggregatesInput>>;
  createdAt?: InputMaybe<DateTimeWithAggregatesFilter>;
  id?: InputMaybe<UuidWithAggregatesFilter>;
  isCorrect?: InputMaybe<BoolWithAggregatesFilter>;
  questionId?: InputMaybe<UuidWithAggregatesFilter>;
  text?: InputMaybe<StringWithAggregatesFilter>;
  updatedAt?: InputMaybe<DateTimeWithAggregatesFilter>;
};

export type QuizOptionUpdateInput = {
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  isCorrect?: InputMaybe<BoolFieldUpdateOperationsInput>;
  question?: InputMaybe<QuizQuestionUpdateOneRequiredWithoutOptionsNestedInput>;
  text?: InputMaybe<StringFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type QuizOptionUpdateManyMutationInput = {
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  isCorrect?: InputMaybe<BoolFieldUpdateOperationsInput>;
  text?: InputMaybe<StringFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type QuizOptionUpdateManyWithWhereWithoutQuestionInput = {
  data: QuizOptionUpdateManyMutationInput;
  where: QuizOptionScalarWhereInput;
};

export type QuizOptionUpdateManyWithoutQuestionNestedInput = {
  connect?: InputMaybe<Array<QuizOptionWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<QuizOptionCreateOrConnectWithoutQuestionInput>>;
  create?: InputMaybe<Array<QuizOptionCreateWithoutQuestionInput>>;
  createMany?: InputMaybe<QuizOptionCreateManyQuestionInputEnvelope>;
  delete?: InputMaybe<Array<QuizOptionWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<QuizOptionScalarWhereInput>>;
  disconnect?: InputMaybe<Array<QuizOptionWhereUniqueInput>>;
  set?: InputMaybe<Array<QuizOptionWhereUniqueInput>>;
  update?: InputMaybe<Array<QuizOptionUpdateWithWhereUniqueWithoutQuestionInput>>;
  updateMany?: InputMaybe<Array<QuizOptionUpdateManyWithWhereWithoutQuestionInput>>;
  upsert?: InputMaybe<Array<QuizOptionUpsertWithWhereUniqueWithoutQuestionInput>>;
};

export type QuizOptionUpdateWithWhereUniqueWithoutQuestionInput = {
  data: QuizOptionUpdateWithoutQuestionInput;
  where: QuizOptionWhereUniqueInput;
};

export type QuizOptionUpdateWithoutQuestionInput = {
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  isCorrect?: InputMaybe<BoolFieldUpdateOperationsInput>;
  text?: InputMaybe<StringFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type QuizOptionUpsertWithWhereUniqueWithoutQuestionInput = {
  create: QuizOptionCreateWithoutQuestionInput;
  update: QuizOptionUpdateWithoutQuestionInput;
  where: QuizOptionWhereUniqueInput;
};

export type QuizOptionWhereInput = {
  AND?: InputMaybe<Array<QuizOptionWhereInput>>;
  NOT?: InputMaybe<Array<QuizOptionWhereInput>>;
  OR?: InputMaybe<Array<QuizOptionWhereInput>>;
  createdAt?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<UuidFilter>;
  isCorrect?: InputMaybe<BoolFilter>;
  question?: InputMaybe<QuizQuestionWhereInput>;
  questionId?: InputMaybe<UuidFilter>;
  text?: InputMaybe<StringFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type QuizOptionWhereUniqueInput = {
  AND?: InputMaybe<Array<QuizOptionWhereInput>>;
  NOT?: InputMaybe<Array<QuizOptionWhereInput>>;
  OR?: InputMaybe<Array<QuizOptionWhereInput>>;
  createdAt?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<Scalars['String']['input']>;
  isCorrect?: InputMaybe<BoolFilter>;
  question?: InputMaybe<QuizQuestionWhereInput>;
  questionId?: InputMaybe<UuidFilter>;
  text?: InputMaybe<StringFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type QuizOrderByWithAggregationInput = {
  _count?: InputMaybe<QuizCountOrderByAggregateInput>;
  _max?: InputMaybe<QuizMaxOrderByAggregateInput>;
  _min?: InputMaybe<QuizMinOrderByAggregateInput>;
  createdAt?: InputMaybe<SortOrder>;
  deletedAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  nodeId?: InputMaybe<SortOrder>;
  required?: InputMaybe<SortOrder>;
  title?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type QuizOrderByWithRelationInput = {
  attempts?: InputMaybe<QuizAttemptOrderByRelationAggregateInput>;
  createdAt?: InputMaybe<SortOrder>;
  deletedAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  node?: InputMaybe<SkillNodeOrderByWithRelationInput>;
  nodeId?: InputMaybe<SortOrder>;
  questions?: InputMaybe<QuizQuestionOrderByRelationAggregateInput>;
  required?: InputMaybe<SortOrder>;
  title?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type QuizQuestion = {
  __typename?: 'QuizQuestion';
  answers: Array<QuizAttemptAnswer>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  options: Array<QuizOption>;
  order: Scalars['Int']['output'];
  prompt: Scalars['String']['output'];
  quiz: Quiz;
  quizId: Scalars['String']['output'];
  type: QuestionType;
  updatedAt: Scalars['DateTime']['output'];
};


export type QuizQuestionAnswersArgs = {
  cursor?: InputMaybe<QuizAttemptAnswerWhereUniqueInput>;
  distinct?: InputMaybe<Array<QuizAttemptAnswerScalarFieldEnum>>;
  orderBy?: InputMaybe<Array<QuizAttemptAnswerOrderByWithRelationInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<QuizAttemptAnswerWhereInput>;
};


export type QuizQuestionOptionsArgs = {
  cursor?: InputMaybe<QuizOptionWhereUniqueInput>;
  distinct?: InputMaybe<Array<QuizOptionScalarFieldEnum>>;
  orderBy?: InputMaybe<Array<QuizOptionOrderByWithRelationInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<QuizOptionWhereInput>;
};

export type QuizQuestionAvgOrderByAggregateInput = {
  order?: InputMaybe<SortOrder>;
};

export type QuizQuestionCountOrderByAggregateInput = {
  createdAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  order?: InputMaybe<SortOrder>;
  prompt?: InputMaybe<SortOrder>;
  quizId?: InputMaybe<SortOrder>;
  type?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type QuizQuestionCreateInput = {
  answers?: InputMaybe<QuizAttemptAnswerCreateNestedManyWithoutQuestionInput>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  options?: InputMaybe<QuizOptionCreateNestedManyWithoutQuestionInput>;
  order?: InputMaybe<Scalars['Int']['input']>;
  prompt: Scalars['String']['input'];
  quiz: QuizCreateNestedOneWithoutQuestionsInput;
  type: QuestionType;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type QuizQuestionCreateManyInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  prompt: Scalars['String']['input'];
  quizId: Scalars['String']['input'];
  type: QuestionType;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type QuizQuestionCreateManyQuizInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  prompt: Scalars['String']['input'];
  type: QuestionType;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type QuizQuestionCreateManyQuizInputEnvelope = {
  data: Array<QuizQuestionCreateManyQuizInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type QuizQuestionCreateNestedManyWithoutQuizInput = {
  connect?: InputMaybe<Array<QuizQuestionWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<QuizQuestionCreateOrConnectWithoutQuizInput>>;
  create?: InputMaybe<Array<QuizQuestionCreateWithoutQuizInput>>;
  createMany?: InputMaybe<QuizQuestionCreateManyQuizInputEnvelope>;
};

export type QuizQuestionCreateNestedOneWithoutAnswersInput = {
  connect?: InputMaybe<QuizQuestionWhereUniqueInput>;
  connectOrCreate?: InputMaybe<QuizQuestionCreateOrConnectWithoutAnswersInput>;
  create?: InputMaybe<QuizQuestionCreateWithoutAnswersInput>;
};

export type QuizQuestionCreateNestedOneWithoutOptionsInput = {
  connect?: InputMaybe<QuizQuestionWhereUniqueInput>;
  connectOrCreate?: InputMaybe<QuizQuestionCreateOrConnectWithoutOptionsInput>;
  create?: InputMaybe<QuizQuestionCreateWithoutOptionsInput>;
};

export type QuizQuestionCreateOrConnectWithoutAnswersInput = {
  create: QuizQuestionCreateWithoutAnswersInput;
  where: QuizQuestionWhereUniqueInput;
};

export type QuizQuestionCreateOrConnectWithoutOptionsInput = {
  create: QuizQuestionCreateWithoutOptionsInput;
  where: QuizQuestionWhereUniqueInput;
};

export type QuizQuestionCreateOrConnectWithoutQuizInput = {
  create: QuizQuestionCreateWithoutQuizInput;
  where: QuizQuestionWhereUniqueInput;
};

export type QuizQuestionCreateWithoutAnswersInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  options?: InputMaybe<QuizOptionCreateNestedManyWithoutQuestionInput>;
  order?: InputMaybe<Scalars['Int']['input']>;
  prompt: Scalars['String']['input'];
  quiz: QuizCreateNestedOneWithoutQuestionsInput;
  type: QuestionType;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type QuizQuestionCreateWithoutOptionsInput = {
  answers?: InputMaybe<QuizAttemptAnswerCreateNestedManyWithoutQuestionInput>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  prompt: Scalars['String']['input'];
  quiz: QuizCreateNestedOneWithoutQuestionsInput;
  type: QuestionType;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type QuizQuestionCreateWithoutQuizInput = {
  answers?: InputMaybe<QuizAttemptAnswerCreateNestedManyWithoutQuestionInput>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  options?: InputMaybe<QuizOptionCreateNestedManyWithoutQuestionInput>;
  order?: InputMaybe<Scalars['Int']['input']>;
  prompt: Scalars['String']['input'];
  type: QuestionType;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type QuizQuestionListRelationFilter = {
  every?: InputMaybe<QuizQuestionWhereInput>;
  none?: InputMaybe<QuizQuestionWhereInput>;
  some?: InputMaybe<QuizQuestionWhereInput>;
};

export type QuizQuestionMaxOrderByAggregateInput = {
  createdAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  order?: InputMaybe<SortOrder>;
  prompt?: InputMaybe<SortOrder>;
  quizId?: InputMaybe<SortOrder>;
  type?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type QuizQuestionMinOrderByAggregateInput = {
  createdAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  order?: InputMaybe<SortOrder>;
  prompt?: InputMaybe<SortOrder>;
  quizId?: InputMaybe<SortOrder>;
  type?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type QuizQuestionOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type QuizQuestionOrderByWithAggregationInput = {
  _avg?: InputMaybe<QuizQuestionAvgOrderByAggregateInput>;
  _count?: InputMaybe<QuizQuestionCountOrderByAggregateInput>;
  _max?: InputMaybe<QuizQuestionMaxOrderByAggregateInput>;
  _min?: InputMaybe<QuizQuestionMinOrderByAggregateInput>;
  _sum?: InputMaybe<QuizQuestionSumOrderByAggregateInput>;
  createdAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  order?: InputMaybe<SortOrder>;
  prompt?: InputMaybe<SortOrder>;
  quizId?: InputMaybe<SortOrder>;
  type?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type QuizQuestionOrderByWithRelationInput = {
  answers?: InputMaybe<QuizAttemptAnswerOrderByRelationAggregateInput>;
  createdAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  options?: InputMaybe<QuizOptionOrderByRelationAggregateInput>;
  order?: InputMaybe<SortOrder>;
  prompt?: InputMaybe<SortOrder>;
  quiz?: InputMaybe<QuizOrderByWithRelationInput>;
  quizId?: InputMaybe<SortOrder>;
  type?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export enum QuizQuestionScalarFieldEnum {
  CreatedAt = 'createdAt',
  Id = 'id',
  Order = 'order',
  Prompt = 'prompt',
  QuizId = 'quizId',
  Type = 'type',
  UpdatedAt = 'updatedAt'
}

export type QuizQuestionScalarRelationFilter = {
  is?: InputMaybe<QuizQuestionWhereInput>;
  isNot?: InputMaybe<QuizQuestionWhereInput>;
};

export type QuizQuestionScalarWhereInput = {
  AND?: InputMaybe<Array<QuizQuestionScalarWhereInput>>;
  NOT?: InputMaybe<Array<QuizQuestionScalarWhereInput>>;
  OR?: InputMaybe<Array<QuizQuestionScalarWhereInput>>;
  createdAt?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<UuidFilter>;
  order?: InputMaybe<IntFilter>;
  prompt?: InputMaybe<StringFilter>;
  quizId?: InputMaybe<UuidFilter>;
  type?: InputMaybe<EnumQuestionTypeFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type QuizQuestionScalarWhereWithAggregatesInput = {
  AND?: InputMaybe<Array<QuizQuestionScalarWhereWithAggregatesInput>>;
  NOT?: InputMaybe<Array<QuizQuestionScalarWhereWithAggregatesInput>>;
  OR?: InputMaybe<Array<QuizQuestionScalarWhereWithAggregatesInput>>;
  createdAt?: InputMaybe<DateTimeWithAggregatesFilter>;
  id?: InputMaybe<UuidWithAggregatesFilter>;
  order?: InputMaybe<IntWithAggregatesFilter>;
  prompt?: InputMaybe<StringWithAggregatesFilter>;
  quizId?: InputMaybe<UuidWithAggregatesFilter>;
  type?: InputMaybe<EnumQuestionTypeWithAggregatesFilter>;
  updatedAt?: InputMaybe<DateTimeWithAggregatesFilter>;
};

export type QuizQuestionSumOrderByAggregateInput = {
  order?: InputMaybe<SortOrder>;
};

export type QuizQuestionUpdateInput = {
  answers?: InputMaybe<QuizAttemptAnswerUpdateManyWithoutQuestionNestedInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  options?: InputMaybe<QuizOptionUpdateManyWithoutQuestionNestedInput>;
  order?: InputMaybe<IntFieldUpdateOperationsInput>;
  prompt?: InputMaybe<StringFieldUpdateOperationsInput>;
  quiz?: InputMaybe<QuizUpdateOneRequiredWithoutQuestionsNestedInput>;
  type?: InputMaybe<EnumQuestionTypeFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type QuizQuestionUpdateManyMutationInput = {
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  order?: InputMaybe<IntFieldUpdateOperationsInput>;
  prompt?: InputMaybe<StringFieldUpdateOperationsInput>;
  type?: InputMaybe<EnumQuestionTypeFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type QuizQuestionUpdateManyWithWhereWithoutQuizInput = {
  data: QuizQuestionUpdateManyMutationInput;
  where: QuizQuestionScalarWhereInput;
};

export type QuizQuestionUpdateManyWithoutQuizNestedInput = {
  connect?: InputMaybe<Array<QuizQuestionWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<QuizQuestionCreateOrConnectWithoutQuizInput>>;
  create?: InputMaybe<Array<QuizQuestionCreateWithoutQuizInput>>;
  createMany?: InputMaybe<QuizQuestionCreateManyQuizInputEnvelope>;
  delete?: InputMaybe<Array<QuizQuestionWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<QuizQuestionScalarWhereInput>>;
  disconnect?: InputMaybe<Array<QuizQuestionWhereUniqueInput>>;
  set?: InputMaybe<Array<QuizQuestionWhereUniqueInput>>;
  update?: InputMaybe<Array<QuizQuestionUpdateWithWhereUniqueWithoutQuizInput>>;
  updateMany?: InputMaybe<Array<QuizQuestionUpdateManyWithWhereWithoutQuizInput>>;
  upsert?: InputMaybe<Array<QuizQuestionUpsertWithWhereUniqueWithoutQuizInput>>;
};

export type QuizQuestionUpdateOneRequiredWithoutAnswersNestedInput = {
  connect?: InputMaybe<QuizQuestionWhereUniqueInput>;
  connectOrCreate?: InputMaybe<QuizQuestionCreateOrConnectWithoutAnswersInput>;
  create?: InputMaybe<QuizQuestionCreateWithoutAnswersInput>;
  update?: InputMaybe<QuizQuestionUpdateToOneWithWhereWithoutAnswersInput>;
  upsert?: InputMaybe<QuizQuestionUpsertWithoutAnswersInput>;
};

export type QuizQuestionUpdateOneRequiredWithoutOptionsNestedInput = {
  connect?: InputMaybe<QuizQuestionWhereUniqueInput>;
  connectOrCreate?: InputMaybe<QuizQuestionCreateOrConnectWithoutOptionsInput>;
  create?: InputMaybe<QuizQuestionCreateWithoutOptionsInput>;
  update?: InputMaybe<QuizQuestionUpdateToOneWithWhereWithoutOptionsInput>;
  upsert?: InputMaybe<QuizQuestionUpsertWithoutOptionsInput>;
};

export type QuizQuestionUpdateToOneWithWhereWithoutAnswersInput = {
  data: QuizQuestionUpdateWithoutAnswersInput;
  where?: InputMaybe<QuizQuestionWhereInput>;
};

export type QuizQuestionUpdateToOneWithWhereWithoutOptionsInput = {
  data: QuizQuestionUpdateWithoutOptionsInput;
  where?: InputMaybe<QuizQuestionWhereInput>;
};

export type QuizQuestionUpdateWithWhereUniqueWithoutQuizInput = {
  data: QuizQuestionUpdateWithoutQuizInput;
  where: QuizQuestionWhereUniqueInput;
};

export type QuizQuestionUpdateWithoutAnswersInput = {
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  options?: InputMaybe<QuizOptionUpdateManyWithoutQuestionNestedInput>;
  order?: InputMaybe<IntFieldUpdateOperationsInput>;
  prompt?: InputMaybe<StringFieldUpdateOperationsInput>;
  quiz?: InputMaybe<QuizUpdateOneRequiredWithoutQuestionsNestedInput>;
  type?: InputMaybe<EnumQuestionTypeFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type QuizQuestionUpdateWithoutOptionsInput = {
  answers?: InputMaybe<QuizAttemptAnswerUpdateManyWithoutQuestionNestedInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  order?: InputMaybe<IntFieldUpdateOperationsInput>;
  prompt?: InputMaybe<StringFieldUpdateOperationsInput>;
  quiz?: InputMaybe<QuizUpdateOneRequiredWithoutQuestionsNestedInput>;
  type?: InputMaybe<EnumQuestionTypeFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type QuizQuestionUpdateWithoutQuizInput = {
  answers?: InputMaybe<QuizAttemptAnswerUpdateManyWithoutQuestionNestedInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  options?: InputMaybe<QuizOptionUpdateManyWithoutQuestionNestedInput>;
  order?: InputMaybe<IntFieldUpdateOperationsInput>;
  prompt?: InputMaybe<StringFieldUpdateOperationsInput>;
  type?: InputMaybe<EnumQuestionTypeFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type QuizQuestionUpsertWithWhereUniqueWithoutQuizInput = {
  create: QuizQuestionCreateWithoutQuizInput;
  update: QuizQuestionUpdateWithoutQuizInput;
  where: QuizQuestionWhereUniqueInput;
};

export type QuizQuestionUpsertWithoutAnswersInput = {
  create: QuizQuestionCreateWithoutAnswersInput;
  update: QuizQuestionUpdateWithoutAnswersInput;
  where?: InputMaybe<QuizQuestionWhereInput>;
};

export type QuizQuestionUpsertWithoutOptionsInput = {
  create: QuizQuestionCreateWithoutOptionsInput;
  update: QuizQuestionUpdateWithoutOptionsInput;
  where?: InputMaybe<QuizQuestionWhereInput>;
};

export type QuizQuestionWhereInput = {
  AND?: InputMaybe<Array<QuizQuestionWhereInput>>;
  NOT?: InputMaybe<Array<QuizQuestionWhereInput>>;
  OR?: InputMaybe<Array<QuizQuestionWhereInput>>;
  answers?: InputMaybe<QuizAttemptAnswerListRelationFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<UuidFilter>;
  options?: InputMaybe<QuizOptionListRelationFilter>;
  order?: InputMaybe<IntFilter>;
  prompt?: InputMaybe<StringFilter>;
  quiz?: InputMaybe<QuizWhereInput>;
  quizId?: InputMaybe<UuidFilter>;
  type?: InputMaybe<EnumQuestionTypeFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type QuizQuestionWhereUniqueInput = {
  AND?: InputMaybe<Array<QuizQuestionWhereInput>>;
  NOT?: InputMaybe<Array<QuizQuestionWhereInput>>;
  OR?: InputMaybe<Array<QuizQuestionWhereInput>>;
  answers?: InputMaybe<QuizAttemptAnswerListRelationFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<Scalars['String']['input']>;
  options?: InputMaybe<QuizOptionListRelationFilter>;
  order?: InputMaybe<IntFilter>;
  prompt?: InputMaybe<StringFilter>;
  quiz?: InputMaybe<QuizWhereInput>;
  quizId?: InputMaybe<UuidFilter>;
  type?: InputMaybe<EnumQuestionTypeFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export enum QuizScalarFieldEnum {
  CreatedAt = 'createdAt',
  DeletedAt = 'deletedAt',
  Id = 'id',
  NodeId = 'nodeId',
  Required = 'required',
  Title = 'title',
  UpdatedAt = 'updatedAt'
}

export type QuizScalarRelationFilter = {
  is?: InputMaybe<QuizWhereInput>;
  isNot?: InputMaybe<QuizWhereInput>;
};

export type QuizScalarWhereWithAggregatesInput = {
  AND?: InputMaybe<Array<QuizScalarWhereWithAggregatesInput>>;
  NOT?: InputMaybe<Array<QuizScalarWhereWithAggregatesInput>>;
  OR?: InputMaybe<Array<QuizScalarWhereWithAggregatesInput>>;
  createdAt?: InputMaybe<DateTimeWithAggregatesFilter>;
  deletedAt?: InputMaybe<DateTimeNullableWithAggregatesFilter>;
  id?: InputMaybe<UuidWithAggregatesFilter>;
  nodeId?: InputMaybe<UuidWithAggregatesFilter>;
  required?: InputMaybe<BoolWithAggregatesFilter>;
  title?: InputMaybe<StringNullableWithAggregatesFilter>;
  updatedAt?: InputMaybe<DateTimeWithAggregatesFilter>;
};

export type QuizUpdateInput = {
  attempts?: InputMaybe<QuizAttemptUpdateManyWithoutQuizNestedInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  deletedAt?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  node?: InputMaybe<SkillNodeUpdateOneRequiredWithoutQuizNestedInput>;
  questions?: InputMaybe<QuizQuestionUpdateManyWithoutQuizNestedInput>;
  required?: InputMaybe<BoolFieldUpdateOperationsInput>;
  title?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type QuizUpdateManyMutationInput = {
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  deletedAt?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  required?: InputMaybe<BoolFieldUpdateOperationsInput>;
  title?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type QuizUpdateOneRequiredWithoutAttemptsNestedInput = {
  connect?: InputMaybe<QuizWhereUniqueInput>;
  connectOrCreate?: InputMaybe<QuizCreateOrConnectWithoutAttemptsInput>;
  create?: InputMaybe<QuizCreateWithoutAttemptsInput>;
  update?: InputMaybe<QuizUpdateToOneWithWhereWithoutAttemptsInput>;
  upsert?: InputMaybe<QuizUpsertWithoutAttemptsInput>;
};

export type QuizUpdateOneRequiredWithoutQuestionsNestedInput = {
  connect?: InputMaybe<QuizWhereUniqueInput>;
  connectOrCreate?: InputMaybe<QuizCreateOrConnectWithoutQuestionsInput>;
  create?: InputMaybe<QuizCreateWithoutQuestionsInput>;
  update?: InputMaybe<QuizUpdateToOneWithWhereWithoutQuestionsInput>;
  upsert?: InputMaybe<QuizUpsertWithoutQuestionsInput>;
};

export type QuizUpdateOneWithoutNodeNestedInput = {
  connect?: InputMaybe<QuizWhereUniqueInput>;
  connectOrCreate?: InputMaybe<QuizCreateOrConnectWithoutNodeInput>;
  create?: InputMaybe<QuizCreateWithoutNodeInput>;
  delete?: InputMaybe<QuizWhereInput>;
  disconnect?: InputMaybe<QuizWhereInput>;
  update?: InputMaybe<QuizUpdateToOneWithWhereWithoutNodeInput>;
  upsert?: InputMaybe<QuizUpsertWithoutNodeInput>;
};

export type QuizUpdateToOneWithWhereWithoutAttemptsInput = {
  data: QuizUpdateWithoutAttemptsInput;
  where?: InputMaybe<QuizWhereInput>;
};

export type QuizUpdateToOneWithWhereWithoutNodeInput = {
  data: QuizUpdateWithoutNodeInput;
  where?: InputMaybe<QuizWhereInput>;
};

export type QuizUpdateToOneWithWhereWithoutQuestionsInput = {
  data: QuizUpdateWithoutQuestionsInput;
  where?: InputMaybe<QuizWhereInput>;
};

export type QuizUpdateWithoutAttemptsInput = {
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  deletedAt?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  node?: InputMaybe<SkillNodeUpdateOneRequiredWithoutQuizNestedInput>;
  questions?: InputMaybe<QuizQuestionUpdateManyWithoutQuizNestedInput>;
  required?: InputMaybe<BoolFieldUpdateOperationsInput>;
  title?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type QuizUpdateWithoutNodeInput = {
  attempts?: InputMaybe<QuizAttemptUpdateManyWithoutQuizNestedInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  deletedAt?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  questions?: InputMaybe<QuizQuestionUpdateManyWithoutQuizNestedInput>;
  required?: InputMaybe<BoolFieldUpdateOperationsInput>;
  title?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type QuizUpdateWithoutQuestionsInput = {
  attempts?: InputMaybe<QuizAttemptUpdateManyWithoutQuizNestedInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  deletedAt?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  node?: InputMaybe<SkillNodeUpdateOneRequiredWithoutQuizNestedInput>;
  required?: InputMaybe<BoolFieldUpdateOperationsInput>;
  title?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type QuizUpsertWithoutAttemptsInput = {
  create: QuizCreateWithoutAttemptsInput;
  update: QuizUpdateWithoutAttemptsInput;
  where?: InputMaybe<QuizWhereInput>;
};

export type QuizUpsertWithoutNodeInput = {
  create: QuizCreateWithoutNodeInput;
  update: QuizUpdateWithoutNodeInput;
  where?: InputMaybe<QuizWhereInput>;
};

export type QuizUpsertWithoutQuestionsInput = {
  create: QuizCreateWithoutQuestionsInput;
  update: QuizUpdateWithoutQuestionsInput;
  where?: InputMaybe<QuizWhereInput>;
};

export type QuizWhereInput = {
  AND?: InputMaybe<Array<QuizWhereInput>>;
  NOT?: InputMaybe<Array<QuizWhereInput>>;
  OR?: InputMaybe<Array<QuizWhereInput>>;
  attempts?: InputMaybe<QuizAttemptListRelationFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  deletedAt?: InputMaybe<DateTimeNullableFilter>;
  id?: InputMaybe<UuidFilter>;
  node?: InputMaybe<SkillNodeWhereInput>;
  nodeId?: InputMaybe<UuidFilter>;
  questions?: InputMaybe<QuizQuestionListRelationFilter>;
  required?: InputMaybe<BoolFilter>;
  title?: InputMaybe<StringNullableFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type QuizWhereUniqueInput = {
  AND?: InputMaybe<Array<QuizWhereInput>>;
  NOT?: InputMaybe<Array<QuizWhereInput>>;
  OR?: InputMaybe<Array<QuizWhereInput>>;
  attempts?: InputMaybe<QuizAttemptListRelationFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  deletedAt?: InputMaybe<DateTimeNullableFilter>;
  id?: InputMaybe<Scalars['String']['input']>;
  node?: InputMaybe<SkillNodeWhereInput>;
  nodeId?: InputMaybe<Scalars['String']['input']>;
  questions?: InputMaybe<QuizQuestionListRelationFilter>;
  required?: InputMaybe<BoolFilter>;
  title?: InputMaybe<StringNullableFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export enum Role {
  Admin = 'ADMIN',
  User = 'USER'
}

export type SkillNode = {
  __typename?: 'SkillNode';
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  lessons: Array<LessonBlocks>;
  orderInStep: Scalars['Int']['output'];
  posX?: Maybe<Scalars['Int']['output']>;
  posY?: Maybe<Scalars['Int']['output']>;
  prerequisites: Array<SkillNodePrerequisite>;
  progresses: Array<UserNodeProgress>;
  quiz?: Maybe<Quiz>;
  requiredFor: Array<SkillNodePrerequisite>;
  step: Scalars['Int']['output'];
  title: Scalars['String']['output'];
  tree: SkillTree;
  treeId: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};


export type SkillNodeLessonsArgs = {
  cursor?: InputMaybe<LessonBlocksWhereUniqueInput>;
  distinct?: InputMaybe<Array<LessonBlocksScalarFieldEnum>>;
  orderBy?: InputMaybe<Array<LessonBlocksOrderByWithRelationInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<LessonBlocksWhereInput>;
};


export type SkillNodePrerequisitesArgs = {
  cursor?: InputMaybe<SkillNodePrerequisiteWhereUniqueInput>;
  distinct?: InputMaybe<Array<SkillNodePrerequisiteScalarFieldEnum>>;
  orderBy?: InputMaybe<Array<SkillNodePrerequisiteOrderByWithRelationInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<SkillNodePrerequisiteWhereInput>;
};


export type SkillNodeProgressesArgs = {
  cursor?: InputMaybe<UserNodeProgressWhereUniqueInput>;
  distinct?: InputMaybe<Array<UserNodeProgressScalarFieldEnum>>;
  orderBy?: InputMaybe<Array<UserNodeProgressOrderByWithRelationInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<UserNodeProgressWhereInput>;
};


export type SkillNodeRequiredForArgs = {
  cursor?: InputMaybe<SkillNodePrerequisiteWhereUniqueInput>;
  distinct?: InputMaybe<Array<SkillNodePrerequisiteScalarFieldEnum>>;
  orderBy?: InputMaybe<Array<SkillNodePrerequisiteOrderByWithRelationInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<SkillNodePrerequisiteWhereInput>;
};

export type SkillNodeAvgOrderByAggregateInput = {
  orderInStep?: InputMaybe<SortOrder>;
  posX?: InputMaybe<SortOrder>;
  posY?: InputMaybe<SortOrder>;
  step?: InputMaybe<SortOrder>;
};

export type SkillNodeCountOrderByAggregateInput = {
  createdAt?: InputMaybe<SortOrder>;
  deletedAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  orderInStep?: InputMaybe<SortOrder>;
  posX?: InputMaybe<SortOrder>;
  posY?: InputMaybe<SortOrder>;
  step?: InputMaybe<SortOrder>;
  title?: InputMaybe<SortOrder>;
  treeId?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type SkillNodeCreateInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  deletedAt?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  lessons?: InputMaybe<LessonBlocksCreateNestedManyWithoutNodeInput>;
  orderInStep?: InputMaybe<Scalars['Int']['input']>;
  posX?: InputMaybe<Scalars['Int']['input']>;
  posY?: InputMaybe<Scalars['Int']['input']>;
  prerequisites?: InputMaybe<SkillNodePrerequisiteCreateNestedManyWithoutNodeInput>;
  progresses?: InputMaybe<UserNodeProgressCreateNestedManyWithoutNodeInput>;
  quiz?: InputMaybe<QuizCreateNestedOneWithoutNodeInput>;
  requiredFor?: InputMaybe<SkillNodePrerequisiteCreateNestedManyWithoutDependsOnInput>;
  step?: InputMaybe<Scalars['Int']['input']>;
  title: Scalars['String']['input'];
  tree: SkillTreeCreateNestedOneWithoutNodesInput;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type SkillNodeCreateManyInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  deletedAt?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  orderInStep?: InputMaybe<Scalars['Int']['input']>;
  posX?: InputMaybe<Scalars['Int']['input']>;
  posY?: InputMaybe<Scalars['Int']['input']>;
  step?: InputMaybe<Scalars['Int']['input']>;
  title: Scalars['String']['input'];
  treeId: Scalars['String']['input'];
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type SkillNodeCreateManyTreeInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  deletedAt?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  orderInStep?: InputMaybe<Scalars['Int']['input']>;
  posX?: InputMaybe<Scalars['Int']['input']>;
  posY?: InputMaybe<Scalars['Int']['input']>;
  step?: InputMaybe<Scalars['Int']['input']>;
  title: Scalars['String']['input'];
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type SkillNodeCreateManyTreeInputEnvelope = {
  data: Array<SkillNodeCreateManyTreeInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type SkillNodeCreateNestedManyWithoutTreeInput = {
  connect?: InputMaybe<Array<SkillNodeWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<SkillNodeCreateOrConnectWithoutTreeInput>>;
  create?: InputMaybe<Array<SkillNodeCreateWithoutTreeInput>>;
  createMany?: InputMaybe<SkillNodeCreateManyTreeInputEnvelope>;
};

export type SkillNodeCreateNestedOneWithoutLessonsInput = {
  connect?: InputMaybe<SkillNodeWhereUniqueInput>;
  connectOrCreate?: InputMaybe<SkillNodeCreateOrConnectWithoutLessonsInput>;
  create?: InputMaybe<SkillNodeCreateWithoutLessonsInput>;
};

export type SkillNodeCreateNestedOneWithoutPrerequisitesInput = {
  connect?: InputMaybe<SkillNodeWhereUniqueInput>;
  connectOrCreate?: InputMaybe<SkillNodeCreateOrConnectWithoutPrerequisitesInput>;
  create?: InputMaybe<SkillNodeCreateWithoutPrerequisitesInput>;
};

export type SkillNodeCreateNestedOneWithoutProgressesInput = {
  connect?: InputMaybe<SkillNodeWhereUniqueInput>;
  connectOrCreate?: InputMaybe<SkillNodeCreateOrConnectWithoutProgressesInput>;
  create?: InputMaybe<SkillNodeCreateWithoutProgressesInput>;
};

export type SkillNodeCreateNestedOneWithoutQuizInput = {
  connect?: InputMaybe<SkillNodeWhereUniqueInput>;
  connectOrCreate?: InputMaybe<SkillNodeCreateOrConnectWithoutQuizInput>;
  create?: InputMaybe<SkillNodeCreateWithoutQuizInput>;
};

export type SkillNodeCreateNestedOneWithoutRequiredForInput = {
  connect?: InputMaybe<SkillNodeWhereUniqueInput>;
  connectOrCreate?: InputMaybe<SkillNodeCreateOrConnectWithoutRequiredForInput>;
  create?: InputMaybe<SkillNodeCreateWithoutRequiredForInput>;
};

export type SkillNodeCreateOrConnectWithoutLessonsInput = {
  create: SkillNodeCreateWithoutLessonsInput;
  where: SkillNodeWhereUniqueInput;
};

export type SkillNodeCreateOrConnectWithoutPrerequisitesInput = {
  create: SkillNodeCreateWithoutPrerequisitesInput;
  where: SkillNodeWhereUniqueInput;
};

export type SkillNodeCreateOrConnectWithoutProgressesInput = {
  create: SkillNodeCreateWithoutProgressesInput;
  where: SkillNodeWhereUniqueInput;
};

export type SkillNodeCreateOrConnectWithoutQuizInput = {
  create: SkillNodeCreateWithoutQuizInput;
  where: SkillNodeWhereUniqueInput;
};

export type SkillNodeCreateOrConnectWithoutRequiredForInput = {
  create: SkillNodeCreateWithoutRequiredForInput;
  where: SkillNodeWhereUniqueInput;
};

export type SkillNodeCreateOrConnectWithoutTreeInput = {
  create: SkillNodeCreateWithoutTreeInput;
  where: SkillNodeWhereUniqueInput;
};

export type SkillNodeCreateWithoutLessonsInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  deletedAt?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  orderInStep?: InputMaybe<Scalars['Int']['input']>;
  posX?: InputMaybe<Scalars['Int']['input']>;
  posY?: InputMaybe<Scalars['Int']['input']>;
  prerequisites?: InputMaybe<SkillNodePrerequisiteCreateNestedManyWithoutNodeInput>;
  progresses?: InputMaybe<UserNodeProgressCreateNestedManyWithoutNodeInput>;
  quiz?: InputMaybe<QuizCreateNestedOneWithoutNodeInput>;
  requiredFor?: InputMaybe<SkillNodePrerequisiteCreateNestedManyWithoutDependsOnInput>;
  step?: InputMaybe<Scalars['Int']['input']>;
  title: Scalars['String']['input'];
  tree: SkillTreeCreateNestedOneWithoutNodesInput;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type SkillNodeCreateWithoutPrerequisitesInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  deletedAt?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  lessons?: InputMaybe<LessonBlocksCreateNestedManyWithoutNodeInput>;
  orderInStep?: InputMaybe<Scalars['Int']['input']>;
  posX?: InputMaybe<Scalars['Int']['input']>;
  posY?: InputMaybe<Scalars['Int']['input']>;
  progresses?: InputMaybe<UserNodeProgressCreateNestedManyWithoutNodeInput>;
  quiz?: InputMaybe<QuizCreateNestedOneWithoutNodeInput>;
  requiredFor?: InputMaybe<SkillNodePrerequisiteCreateNestedManyWithoutDependsOnInput>;
  step?: InputMaybe<Scalars['Int']['input']>;
  title: Scalars['String']['input'];
  tree: SkillTreeCreateNestedOneWithoutNodesInput;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type SkillNodeCreateWithoutProgressesInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  deletedAt?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  lessons?: InputMaybe<LessonBlocksCreateNestedManyWithoutNodeInput>;
  orderInStep?: InputMaybe<Scalars['Int']['input']>;
  posX?: InputMaybe<Scalars['Int']['input']>;
  posY?: InputMaybe<Scalars['Int']['input']>;
  prerequisites?: InputMaybe<SkillNodePrerequisiteCreateNestedManyWithoutNodeInput>;
  quiz?: InputMaybe<QuizCreateNestedOneWithoutNodeInput>;
  requiredFor?: InputMaybe<SkillNodePrerequisiteCreateNestedManyWithoutDependsOnInput>;
  step?: InputMaybe<Scalars['Int']['input']>;
  title: Scalars['String']['input'];
  tree: SkillTreeCreateNestedOneWithoutNodesInput;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type SkillNodeCreateWithoutQuizInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  deletedAt?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  lessons?: InputMaybe<LessonBlocksCreateNestedManyWithoutNodeInput>;
  orderInStep?: InputMaybe<Scalars['Int']['input']>;
  posX?: InputMaybe<Scalars['Int']['input']>;
  posY?: InputMaybe<Scalars['Int']['input']>;
  prerequisites?: InputMaybe<SkillNodePrerequisiteCreateNestedManyWithoutNodeInput>;
  progresses?: InputMaybe<UserNodeProgressCreateNestedManyWithoutNodeInput>;
  requiredFor?: InputMaybe<SkillNodePrerequisiteCreateNestedManyWithoutDependsOnInput>;
  step?: InputMaybe<Scalars['Int']['input']>;
  title: Scalars['String']['input'];
  tree: SkillTreeCreateNestedOneWithoutNodesInput;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type SkillNodeCreateWithoutRequiredForInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  deletedAt?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  lessons?: InputMaybe<LessonBlocksCreateNestedManyWithoutNodeInput>;
  orderInStep?: InputMaybe<Scalars['Int']['input']>;
  posX?: InputMaybe<Scalars['Int']['input']>;
  posY?: InputMaybe<Scalars['Int']['input']>;
  prerequisites?: InputMaybe<SkillNodePrerequisiteCreateNestedManyWithoutNodeInput>;
  progresses?: InputMaybe<UserNodeProgressCreateNestedManyWithoutNodeInput>;
  quiz?: InputMaybe<QuizCreateNestedOneWithoutNodeInput>;
  step?: InputMaybe<Scalars['Int']['input']>;
  title: Scalars['String']['input'];
  tree: SkillTreeCreateNestedOneWithoutNodesInput;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type SkillNodeCreateWithoutTreeInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  deletedAt?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  lessons?: InputMaybe<LessonBlocksCreateNestedManyWithoutNodeInput>;
  orderInStep?: InputMaybe<Scalars['Int']['input']>;
  posX?: InputMaybe<Scalars['Int']['input']>;
  posY?: InputMaybe<Scalars['Int']['input']>;
  prerequisites?: InputMaybe<SkillNodePrerequisiteCreateNestedManyWithoutNodeInput>;
  progresses?: InputMaybe<UserNodeProgressCreateNestedManyWithoutNodeInput>;
  quiz?: InputMaybe<QuizCreateNestedOneWithoutNodeInput>;
  requiredFor?: InputMaybe<SkillNodePrerequisiteCreateNestedManyWithoutDependsOnInput>;
  step?: InputMaybe<Scalars['Int']['input']>;
  title: Scalars['String']['input'];
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type SkillNodeListRelationFilter = {
  every?: InputMaybe<SkillNodeWhereInput>;
  none?: InputMaybe<SkillNodeWhereInput>;
  some?: InputMaybe<SkillNodeWhereInput>;
};

export type SkillNodeMaxOrderByAggregateInput = {
  createdAt?: InputMaybe<SortOrder>;
  deletedAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  orderInStep?: InputMaybe<SortOrder>;
  posX?: InputMaybe<SortOrder>;
  posY?: InputMaybe<SortOrder>;
  step?: InputMaybe<SortOrder>;
  title?: InputMaybe<SortOrder>;
  treeId?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type SkillNodeMinOrderByAggregateInput = {
  createdAt?: InputMaybe<SortOrder>;
  deletedAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  orderInStep?: InputMaybe<SortOrder>;
  posX?: InputMaybe<SortOrder>;
  posY?: InputMaybe<SortOrder>;
  step?: InputMaybe<SortOrder>;
  title?: InputMaybe<SortOrder>;
  treeId?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type SkillNodeOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type SkillNodeOrderByWithAggregationInput = {
  _avg?: InputMaybe<SkillNodeAvgOrderByAggregateInput>;
  _count?: InputMaybe<SkillNodeCountOrderByAggregateInput>;
  _max?: InputMaybe<SkillNodeMaxOrderByAggregateInput>;
  _min?: InputMaybe<SkillNodeMinOrderByAggregateInput>;
  _sum?: InputMaybe<SkillNodeSumOrderByAggregateInput>;
  createdAt?: InputMaybe<SortOrder>;
  deletedAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  orderInStep?: InputMaybe<SortOrder>;
  posX?: InputMaybe<SortOrder>;
  posY?: InputMaybe<SortOrder>;
  step?: InputMaybe<SortOrder>;
  title?: InputMaybe<SortOrder>;
  treeId?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type SkillNodeOrderByWithRelationInput = {
  createdAt?: InputMaybe<SortOrder>;
  deletedAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  lessons?: InputMaybe<LessonBlocksOrderByRelationAggregateInput>;
  orderInStep?: InputMaybe<SortOrder>;
  posX?: InputMaybe<SortOrder>;
  posY?: InputMaybe<SortOrder>;
  prerequisites?: InputMaybe<SkillNodePrerequisiteOrderByRelationAggregateInput>;
  progresses?: InputMaybe<UserNodeProgressOrderByRelationAggregateInput>;
  quiz?: InputMaybe<QuizOrderByWithRelationInput>;
  requiredFor?: InputMaybe<SkillNodePrerequisiteOrderByRelationAggregateInput>;
  step?: InputMaybe<SortOrder>;
  title?: InputMaybe<SortOrder>;
  tree?: InputMaybe<SkillTreeOrderByWithRelationInput>;
  treeId?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type SkillNodePrerequisite = {
  __typename?: 'SkillNodePrerequisite';
  dependsOn: SkillNode;
  dependsOnNodeId: Scalars['String']['output'];
  node: SkillNode;
  nodeId: Scalars['String']['output'];
};

export type SkillNodePrerequisiteCountOrderByAggregateInput = {
  dependsOnNodeId?: InputMaybe<SortOrder>;
  nodeId?: InputMaybe<SortOrder>;
};

export type SkillNodePrerequisiteCreateInput = {
  dependsOn: SkillNodeCreateNestedOneWithoutRequiredForInput;
  node: SkillNodeCreateNestedOneWithoutPrerequisitesInput;
};

export type SkillNodePrerequisiteCreateManyDependsOnInput = {
  nodeId: Scalars['String']['input'];
};

export type SkillNodePrerequisiteCreateManyDependsOnInputEnvelope = {
  data: Array<SkillNodePrerequisiteCreateManyDependsOnInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type SkillNodePrerequisiteCreateManyInput = {
  dependsOnNodeId: Scalars['String']['input'];
  nodeId: Scalars['String']['input'];
};

export type SkillNodePrerequisiteCreateManyNodeInput = {
  dependsOnNodeId: Scalars['String']['input'];
};

export type SkillNodePrerequisiteCreateManyNodeInputEnvelope = {
  data: Array<SkillNodePrerequisiteCreateManyNodeInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type SkillNodePrerequisiteCreateNestedManyWithoutDependsOnInput = {
  connect?: InputMaybe<Array<SkillNodePrerequisiteWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<SkillNodePrerequisiteCreateOrConnectWithoutDependsOnInput>>;
  create?: InputMaybe<Array<SkillNodePrerequisiteCreateWithoutDependsOnInput>>;
  createMany?: InputMaybe<SkillNodePrerequisiteCreateManyDependsOnInputEnvelope>;
};

export type SkillNodePrerequisiteCreateNestedManyWithoutNodeInput = {
  connect?: InputMaybe<Array<SkillNodePrerequisiteWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<SkillNodePrerequisiteCreateOrConnectWithoutNodeInput>>;
  create?: InputMaybe<Array<SkillNodePrerequisiteCreateWithoutNodeInput>>;
  createMany?: InputMaybe<SkillNodePrerequisiteCreateManyNodeInputEnvelope>;
};

export type SkillNodePrerequisiteCreateOrConnectWithoutDependsOnInput = {
  create: SkillNodePrerequisiteCreateWithoutDependsOnInput;
  where: SkillNodePrerequisiteWhereUniqueInput;
};

export type SkillNodePrerequisiteCreateOrConnectWithoutNodeInput = {
  create: SkillNodePrerequisiteCreateWithoutNodeInput;
  where: SkillNodePrerequisiteWhereUniqueInput;
};

export type SkillNodePrerequisiteCreateWithoutDependsOnInput = {
  node: SkillNodeCreateNestedOneWithoutPrerequisitesInput;
};

export type SkillNodePrerequisiteCreateWithoutNodeInput = {
  dependsOn: SkillNodeCreateNestedOneWithoutRequiredForInput;
};

export type SkillNodePrerequisiteListRelationFilter = {
  every?: InputMaybe<SkillNodePrerequisiteWhereInput>;
  none?: InputMaybe<SkillNodePrerequisiteWhereInput>;
  some?: InputMaybe<SkillNodePrerequisiteWhereInput>;
};

export type SkillNodePrerequisiteMaxOrderByAggregateInput = {
  dependsOnNodeId?: InputMaybe<SortOrder>;
  nodeId?: InputMaybe<SortOrder>;
};

export type SkillNodePrerequisiteMinOrderByAggregateInput = {
  dependsOnNodeId?: InputMaybe<SortOrder>;
  nodeId?: InputMaybe<SortOrder>;
};

export type SkillNodePrerequisiteNodeIdDependsOnNodeIdCompoundUniqueInput = {
  dependsOnNodeId: Scalars['String']['input'];
  nodeId: Scalars['String']['input'];
};

export type SkillNodePrerequisiteOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type SkillNodePrerequisiteOrderByWithAggregationInput = {
  _count?: InputMaybe<SkillNodePrerequisiteCountOrderByAggregateInput>;
  _max?: InputMaybe<SkillNodePrerequisiteMaxOrderByAggregateInput>;
  _min?: InputMaybe<SkillNodePrerequisiteMinOrderByAggregateInput>;
  dependsOnNodeId?: InputMaybe<SortOrder>;
  nodeId?: InputMaybe<SortOrder>;
};

export type SkillNodePrerequisiteOrderByWithRelationInput = {
  dependsOn?: InputMaybe<SkillNodeOrderByWithRelationInput>;
  dependsOnNodeId?: InputMaybe<SortOrder>;
  node?: InputMaybe<SkillNodeOrderByWithRelationInput>;
  nodeId?: InputMaybe<SortOrder>;
};

export enum SkillNodePrerequisiteScalarFieldEnum {
  DependsOnNodeId = 'dependsOnNodeId',
  NodeId = 'nodeId'
}

export type SkillNodePrerequisiteScalarWhereInput = {
  AND?: InputMaybe<Array<SkillNodePrerequisiteScalarWhereInput>>;
  NOT?: InputMaybe<Array<SkillNodePrerequisiteScalarWhereInput>>;
  OR?: InputMaybe<Array<SkillNodePrerequisiteScalarWhereInput>>;
  dependsOnNodeId?: InputMaybe<UuidFilter>;
  nodeId?: InputMaybe<UuidFilter>;
};

export type SkillNodePrerequisiteScalarWhereWithAggregatesInput = {
  AND?: InputMaybe<Array<SkillNodePrerequisiteScalarWhereWithAggregatesInput>>;
  NOT?: InputMaybe<Array<SkillNodePrerequisiteScalarWhereWithAggregatesInput>>;
  OR?: InputMaybe<Array<SkillNodePrerequisiteScalarWhereWithAggregatesInput>>;
  dependsOnNodeId?: InputMaybe<UuidWithAggregatesFilter>;
  nodeId?: InputMaybe<UuidWithAggregatesFilter>;
};

export type SkillNodePrerequisiteUpdateInput = {
  dependsOn?: InputMaybe<SkillNodeUpdateOneRequiredWithoutRequiredForNestedInput>;
  node?: InputMaybe<SkillNodeUpdateOneRequiredWithoutPrerequisitesNestedInput>;
};

export type SkillNodePrerequisiteUpdateManyMutationInput = {
  _?: InputMaybe<Scalars['NEVER']['input']>;
};

export type SkillNodePrerequisiteUpdateManyWithWhereWithoutDependsOnInput = {
  data: SkillNodePrerequisiteUpdateManyMutationInput;
  where: SkillNodePrerequisiteScalarWhereInput;
};

export type SkillNodePrerequisiteUpdateManyWithWhereWithoutNodeInput = {
  data: SkillNodePrerequisiteUpdateManyMutationInput;
  where: SkillNodePrerequisiteScalarWhereInput;
};

export type SkillNodePrerequisiteUpdateManyWithoutDependsOnNestedInput = {
  connect?: InputMaybe<Array<SkillNodePrerequisiteWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<SkillNodePrerequisiteCreateOrConnectWithoutDependsOnInput>>;
  create?: InputMaybe<Array<SkillNodePrerequisiteCreateWithoutDependsOnInput>>;
  createMany?: InputMaybe<SkillNodePrerequisiteCreateManyDependsOnInputEnvelope>;
  delete?: InputMaybe<Array<SkillNodePrerequisiteWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<SkillNodePrerequisiteScalarWhereInput>>;
  disconnect?: InputMaybe<Array<SkillNodePrerequisiteWhereUniqueInput>>;
  set?: InputMaybe<Array<SkillNodePrerequisiteWhereUniqueInput>>;
  update?: InputMaybe<Array<SkillNodePrerequisiteUpdateWithWhereUniqueWithoutDependsOnInput>>;
  updateMany?: InputMaybe<Array<SkillNodePrerequisiteUpdateManyWithWhereWithoutDependsOnInput>>;
  upsert?: InputMaybe<Array<SkillNodePrerequisiteUpsertWithWhereUniqueWithoutDependsOnInput>>;
};

export type SkillNodePrerequisiteUpdateManyWithoutNodeNestedInput = {
  connect?: InputMaybe<Array<SkillNodePrerequisiteWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<SkillNodePrerequisiteCreateOrConnectWithoutNodeInput>>;
  create?: InputMaybe<Array<SkillNodePrerequisiteCreateWithoutNodeInput>>;
  createMany?: InputMaybe<SkillNodePrerequisiteCreateManyNodeInputEnvelope>;
  delete?: InputMaybe<Array<SkillNodePrerequisiteWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<SkillNodePrerequisiteScalarWhereInput>>;
  disconnect?: InputMaybe<Array<SkillNodePrerequisiteWhereUniqueInput>>;
  set?: InputMaybe<Array<SkillNodePrerequisiteWhereUniqueInput>>;
  update?: InputMaybe<Array<SkillNodePrerequisiteUpdateWithWhereUniqueWithoutNodeInput>>;
  updateMany?: InputMaybe<Array<SkillNodePrerequisiteUpdateManyWithWhereWithoutNodeInput>>;
  upsert?: InputMaybe<Array<SkillNodePrerequisiteUpsertWithWhereUniqueWithoutNodeInput>>;
};

export type SkillNodePrerequisiteUpdateWithWhereUniqueWithoutDependsOnInput = {
  data: SkillNodePrerequisiteUpdateWithoutDependsOnInput;
  where: SkillNodePrerequisiteWhereUniqueInput;
};

export type SkillNodePrerequisiteUpdateWithWhereUniqueWithoutNodeInput = {
  data: SkillNodePrerequisiteUpdateWithoutNodeInput;
  where: SkillNodePrerequisiteWhereUniqueInput;
};

export type SkillNodePrerequisiteUpdateWithoutDependsOnInput = {
  node?: InputMaybe<SkillNodeUpdateOneRequiredWithoutPrerequisitesNestedInput>;
};

export type SkillNodePrerequisiteUpdateWithoutNodeInput = {
  dependsOn?: InputMaybe<SkillNodeUpdateOneRequiredWithoutRequiredForNestedInput>;
};

export type SkillNodePrerequisiteUpsertWithWhereUniqueWithoutDependsOnInput = {
  create: SkillNodePrerequisiteCreateWithoutDependsOnInput;
  update: SkillNodePrerequisiteUpdateWithoutDependsOnInput;
  where: SkillNodePrerequisiteWhereUniqueInput;
};

export type SkillNodePrerequisiteUpsertWithWhereUniqueWithoutNodeInput = {
  create: SkillNodePrerequisiteCreateWithoutNodeInput;
  update: SkillNodePrerequisiteUpdateWithoutNodeInput;
  where: SkillNodePrerequisiteWhereUniqueInput;
};

export type SkillNodePrerequisiteWhereInput = {
  AND?: InputMaybe<Array<SkillNodePrerequisiteWhereInput>>;
  NOT?: InputMaybe<Array<SkillNodePrerequisiteWhereInput>>;
  OR?: InputMaybe<Array<SkillNodePrerequisiteWhereInput>>;
  dependsOn?: InputMaybe<SkillNodeWhereInput>;
  dependsOnNodeId?: InputMaybe<UuidFilter>;
  node?: InputMaybe<SkillNodeWhereInput>;
  nodeId?: InputMaybe<UuidFilter>;
};

export type SkillNodePrerequisiteWhereUniqueInput = {
  AND?: InputMaybe<Array<SkillNodePrerequisiteWhereInput>>;
  NOT?: InputMaybe<Array<SkillNodePrerequisiteWhereInput>>;
  OR?: InputMaybe<Array<SkillNodePrerequisiteWhereInput>>;
  dependsOn?: InputMaybe<SkillNodeWhereInput>;
  dependsOnNodeId?: InputMaybe<UuidFilter>;
  node?: InputMaybe<SkillNodeWhereInput>;
  nodeId?: InputMaybe<UuidFilter>;
  nodeId_dependsOnNodeId?: InputMaybe<SkillNodePrerequisiteNodeIdDependsOnNodeIdCompoundUniqueInput>;
};

export enum SkillNodeScalarFieldEnum {
  CreatedAt = 'createdAt',
  DeletedAt = 'deletedAt',
  Id = 'id',
  OrderInStep = 'orderInStep',
  PosX = 'posX',
  PosY = 'posY',
  Step = 'step',
  Title = 'title',
  TreeId = 'treeId',
  UpdatedAt = 'updatedAt'
}

export type SkillNodeScalarRelationFilter = {
  is?: InputMaybe<SkillNodeWhereInput>;
  isNot?: InputMaybe<SkillNodeWhereInput>;
};

export type SkillNodeScalarWhereInput = {
  AND?: InputMaybe<Array<SkillNodeScalarWhereInput>>;
  NOT?: InputMaybe<Array<SkillNodeScalarWhereInput>>;
  OR?: InputMaybe<Array<SkillNodeScalarWhereInput>>;
  createdAt?: InputMaybe<DateTimeFilter>;
  deletedAt?: InputMaybe<DateTimeNullableFilter>;
  id?: InputMaybe<UuidFilter>;
  orderInStep?: InputMaybe<IntFilter>;
  posX?: InputMaybe<IntNullableFilter>;
  posY?: InputMaybe<IntNullableFilter>;
  step?: InputMaybe<IntFilter>;
  title?: InputMaybe<StringFilter>;
  treeId?: InputMaybe<UuidFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type SkillNodeScalarWhereWithAggregatesInput = {
  AND?: InputMaybe<Array<SkillNodeScalarWhereWithAggregatesInput>>;
  NOT?: InputMaybe<Array<SkillNodeScalarWhereWithAggregatesInput>>;
  OR?: InputMaybe<Array<SkillNodeScalarWhereWithAggregatesInput>>;
  createdAt?: InputMaybe<DateTimeWithAggregatesFilter>;
  deletedAt?: InputMaybe<DateTimeNullableWithAggregatesFilter>;
  id?: InputMaybe<UuidWithAggregatesFilter>;
  orderInStep?: InputMaybe<IntWithAggregatesFilter>;
  posX?: InputMaybe<IntNullableWithAggregatesFilter>;
  posY?: InputMaybe<IntNullableWithAggregatesFilter>;
  step?: InputMaybe<IntWithAggregatesFilter>;
  title?: InputMaybe<StringWithAggregatesFilter>;
  treeId?: InputMaybe<UuidWithAggregatesFilter>;
  updatedAt?: InputMaybe<DateTimeWithAggregatesFilter>;
};

export type SkillNodeSumOrderByAggregateInput = {
  orderInStep?: InputMaybe<SortOrder>;
  posX?: InputMaybe<SortOrder>;
  posY?: InputMaybe<SortOrder>;
  step?: InputMaybe<SortOrder>;
};

export type SkillNodeTreeIdPosXPosYCompoundUniqueInput = {
  posX: Scalars['Int']['input'];
  posY: Scalars['Int']['input'];
  treeId: Scalars['String']['input'];
};

export type SkillNodeTreeIdStepOrderInStepCompoundUniqueInput = {
  orderInStep: Scalars['Int']['input'];
  step: Scalars['Int']['input'];
  treeId: Scalars['String']['input'];
};

export type SkillNodeUpdateInput = {
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  deletedAt?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  lessons?: InputMaybe<LessonBlocksUpdateManyWithoutNodeNestedInput>;
  orderInStep?: InputMaybe<IntFieldUpdateOperationsInput>;
  posX?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  posY?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  prerequisites?: InputMaybe<SkillNodePrerequisiteUpdateManyWithoutNodeNestedInput>;
  progresses?: InputMaybe<UserNodeProgressUpdateManyWithoutNodeNestedInput>;
  quiz?: InputMaybe<QuizUpdateOneWithoutNodeNestedInput>;
  requiredFor?: InputMaybe<SkillNodePrerequisiteUpdateManyWithoutDependsOnNestedInput>;
  step?: InputMaybe<IntFieldUpdateOperationsInput>;
  title?: InputMaybe<StringFieldUpdateOperationsInput>;
  tree?: InputMaybe<SkillTreeUpdateOneRequiredWithoutNodesNestedInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type SkillNodeUpdateManyMutationInput = {
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  deletedAt?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  orderInStep?: InputMaybe<IntFieldUpdateOperationsInput>;
  posX?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  posY?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  step?: InputMaybe<IntFieldUpdateOperationsInput>;
  title?: InputMaybe<StringFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type SkillNodeUpdateManyWithWhereWithoutTreeInput = {
  data: SkillNodeUpdateManyMutationInput;
  where: SkillNodeScalarWhereInput;
};

export type SkillNodeUpdateManyWithoutTreeNestedInput = {
  connect?: InputMaybe<Array<SkillNodeWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<SkillNodeCreateOrConnectWithoutTreeInput>>;
  create?: InputMaybe<Array<SkillNodeCreateWithoutTreeInput>>;
  createMany?: InputMaybe<SkillNodeCreateManyTreeInputEnvelope>;
  delete?: InputMaybe<Array<SkillNodeWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<SkillNodeScalarWhereInput>>;
  disconnect?: InputMaybe<Array<SkillNodeWhereUniqueInput>>;
  set?: InputMaybe<Array<SkillNodeWhereUniqueInput>>;
  update?: InputMaybe<Array<SkillNodeUpdateWithWhereUniqueWithoutTreeInput>>;
  updateMany?: InputMaybe<Array<SkillNodeUpdateManyWithWhereWithoutTreeInput>>;
  upsert?: InputMaybe<Array<SkillNodeUpsertWithWhereUniqueWithoutTreeInput>>;
};

export type SkillNodeUpdateOneRequiredWithoutLessonsNestedInput = {
  connect?: InputMaybe<SkillNodeWhereUniqueInput>;
  connectOrCreate?: InputMaybe<SkillNodeCreateOrConnectWithoutLessonsInput>;
  create?: InputMaybe<SkillNodeCreateWithoutLessonsInput>;
  update?: InputMaybe<SkillNodeUpdateToOneWithWhereWithoutLessonsInput>;
  upsert?: InputMaybe<SkillNodeUpsertWithoutLessonsInput>;
};

export type SkillNodeUpdateOneRequiredWithoutPrerequisitesNestedInput = {
  connect?: InputMaybe<SkillNodeWhereUniqueInput>;
  connectOrCreate?: InputMaybe<SkillNodeCreateOrConnectWithoutPrerequisitesInput>;
  create?: InputMaybe<SkillNodeCreateWithoutPrerequisitesInput>;
  update?: InputMaybe<SkillNodeUpdateToOneWithWhereWithoutPrerequisitesInput>;
  upsert?: InputMaybe<SkillNodeUpsertWithoutPrerequisitesInput>;
};

export type SkillNodeUpdateOneRequiredWithoutProgressesNestedInput = {
  connect?: InputMaybe<SkillNodeWhereUniqueInput>;
  connectOrCreate?: InputMaybe<SkillNodeCreateOrConnectWithoutProgressesInput>;
  create?: InputMaybe<SkillNodeCreateWithoutProgressesInput>;
  update?: InputMaybe<SkillNodeUpdateToOneWithWhereWithoutProgressesInput>;
  upsert?: InputMaybe<SkillNodeUpsertWithoutProgressesInput>;
};

export type SkillNodeUpdateOneRequiredWithoutQuizNestedInput = {
  connect?: InputMaybe<SkillNodeWhereUniqueInput>;
  connectOrCreate?: InputMaybe<SkillNodeCreateOrConnectWithoutQuizInput>;
  create?: InputMaybe<SkillNodeCreateWithoutQuizInput>;
  update?: InputMaybe<SkillNodeUpdateToOneWithWhereWithoutQuizInput>;
  upsert?: InputMaybe<SkillNodeUpsertWithoutQuizInput>;
};

export type SkillNodeUpdateOneRequiredWithoutRequiredForNestedInput = {
  connect?: InputMaybe<SkillNodeWhereUniqueInput>;
  connectOrCreate?: InputMaybe<SkillNodeCreateOrConnectWithoutRequiredForInput>;
  create?: InputMaybe<SkillNodeCreateWithoutRequiredForInput>;
  update?: InputMaybe<SkillNodeUpdateToOneWithWhereWithoutRequiredForInput>;
  upsert?: InputMaybe<SkillNodeUpsertWithoutRequiredForInput>;
};

export type SkillNodeUpdateToOneWithWhereWithoutLessonsInput = {
  data: SkillNodeUpdateWithoutLessonsInput;
  where?: InputMaybe<SkillNodeWhereInput>;
};

export type SkillNodeUpdateToOneWithWhereWithoutPrerequisitesInput = {
  data: SkillNodeUpdateWithoutPrerequisitesInput;
  where?: InputMaybe<SkillNodeWhereInput>;
};

export type SkillNodeUpdateToOneWithWhereWithoutProgressesInput = {
  data: SkillNodeUpdateWithoutProgressesInput;
  where?: InputMaybe<SkillNodeWhereInput>;
};

export type SkillNodeUpdateToOneWithWhereWithoutQuizInput = {
  data: SkillNodeUpdateWithoutQuizInput;
  where?: InputMaybe<SkillNodeWhereInput>;
};

export type SkillNodeUpdateToOneWithWhereWithoutRequiredForInput = {
  data: SkillNodeUpdateWithoutRequiredForInput;
  where?: InputMaybe<SkillNodeWhereInput>;
};

export type SkillNodeUpdateWithWhereUniqueWithoutTreeInput = {
  data: SkillNodeUpdateWithoutTreeInput;
  where: SkillNodeWhereUniqueInput;
};

export type SkillNodeUpdateWithoutLessonsInput = {
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  deletedAt?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  orderInStep?: InputMaybe<IntFieldUpdateOperationsInput>;
  posX?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  posY?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  prerequisites?: InputMaybe<SkillNodePrerequisiteUpdateManyWithoutNodeNestedInput>;
  progresses?: InputMaybe<UserNodeProgressUpdateManyWithoutNodeNestedInput>;
  quiz?: InputMaybe<QuizUpdateOneWithoutNodeNestedInput>;
  requiredFor?: InputMaybe<SkillNodePrerequisiteUpdateManyWithoutDependsOnNestedInput>;
  step?: InputMaybe<IntFieldUpdateOperationsInput>;
  title?: InputMaybe<StringFieldUpdateOperationsInput>;
  tree?: InputMaybe<SkillTreeUpdateOneRequiredWithoutNodesNestedInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type SkillNodeUpdateWithoutPrerequisitesInput = {
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  deletedAt?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  lessons?: InputMaybe<LessonBlocksUpdateManyWithoutNodeNestedInput>;
  orderInStep?: InputMaybe<IntFieldUpdateOperationsInput>;
  posX?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  posY?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  progresses?: InputMaybe<UserNodeProgressUpdateManyWithoutNodeNestedInput>;
  quiz?: InputMaybe<QuizUpdateOneWithoutNodeNestedInput>;
  requiredFor?: InputMaybe<SkillNodePrerequisiteUpdateManyWithoutDependsOnNestedInput>;
  step?: InputMaybe<IntFieldUpdateOperationsInput>;
  title?: InputMaybe<StringFieldUpdateOperationsInput>;
  tree?: InputMaybe<SkillTreeUpdateOneRequiredWithoutNodesNestedInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type SkillNodeUpdateWithoutProgressesInput = {
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  deletedAt?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  lessons?: InputMaybe<LessonBlocksUpdateManyWithoutNodeNestedInput>;
  orderInStep?: InputMaybe<IntFieldUpdateOperationsInput>;
  posX?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  posY?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  prerequisites?: InputMaybe<SkillNodePrerequisiteUpdateManyWithoutNodeNestedInput>;
  quiz?: InputMaybe<QuizUpdateOneWithoutNodeNestedInput>;
  requiredFor?: InputMaybe<SkillNodePrerequisiteUpdateManyWithoutDependsOnNestedInput>;
  step?: InputMaybe<IntFieldUpdateOperationsInput>;
  title?: InputMaybe<StringFieldUpdateOperationsInput>;
  tree?: InputMaybe<SkillTreeUpdateOneRequiredWithoutNodesNestedInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type SkillNodeUpdateWithoutQuizInput = {
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  deletedAt?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  lessons?: InputMaybe<LessonBlocksUpdateManyWithoutNodeNestedInput>;
  orderInStep?: InputMaybe<IntFieldUpdateOperationsInput>;
  posX?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  posY?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  prerequisites?: InputMaybe<SkillNodePrerequisiteUpdateManyWithoutNodeNestedInput>;
  progresses?: InputMaybe<UserNodeProgressUpdateManyWithoutNodeNestedInput>;
  requiredFor?: InputMaybe<SkillNodePrerequisiteUpdateManyWithoutDependsOnNestedInput>;
  step?: InputMaybe<IntFieldUpdateOperationsInput>;
  title?: InputMaybe<StringFieldUpdateOperationsInput>;
  tree?: InputMaybe<SkillTreeUpdateOneRequiredWithoutNodesNestedInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type SkillNodeUpdateWithoutRequiredForInput = {
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  deletedAt?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  lessons?: InputMaybe<LessonBlocksUpdateManyWithoutNodeNestedInput>;
  orderInStep?: InputMaybe<IntFieldUpdateOperationsInput>;
  posX?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  posY?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  prerequisites?: InputMaybe<SkillNodePrerequisiteUpdateManyWithoutNodeNestedInput>;
  progresses?: InputMaybe<UserNodeProgressUpdateManyWithoutNodeNestedInput>;
  quiz?: InputMaybe<QuizUpdateOneWithoutNodeNestedInput>;
  step?: InputMaybe<IntFieldUpdateOperationsInput>;
  title?: InputMaybe<StringFieldUpdateOperationsInput>;
  tree?: InputMaybe<SkillTreeUpdateOneRequiredWithoutNodesNestedInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type SkillNodeUpdateWithoutTreeInput = {
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  deletedAt?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  lessons?: InputMaybe<LessonBlocksUpdateManyWithoutNodeNestedInput>;
  orderInStep?: InputMaybe<IntFieldUpdateOperationsInput>;
  posX?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  posY?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  prerequisites?: InputMaybe<SkillNodePrerequisiteUpdateManyWithoutNodeNestedInput>;
  progresses?: InputMaybe<UserNodeProgressUpdateManyWithoutNodeNestedInput>;
  quiz?: InputMaybe<QuizUpdateOneWithoutNodeNestedInput>;
  requiredFor?: InputMaybe<SkillNodePrerequisiteUpdateManyWithoutDependsOnNestedInput>;
  step?: InputMaybe<IntFieldUpdateOperationsInput>;
  title?: InputMaybe<StringFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type SkillNodeUpsertWithWhereUniqueWithoutTreeInput = {
  create: SkillNodeCreateWithoutTreeInput;
  update: SkillNodeUpdateWithoutTreeInput;
  where: SkillNodeWhereUniqueInput;
};

export type SkillNodeUpsertWithoutLessonsInput = {
  create: SkillNodeCreateWithoutLessonsInput;
  update: SkillNodeUpdateWithoutLessonsInput;
  where?: InputMaybe<SkillNodeWhereInput>;
};

export type SkillNodeUpsertWithoutPrerequisitesInput = {
  create: SkillNodeCreateWithoutPrerequisitesInput;
  update: SkillNodeUpdateWithoutPrerequisitesInput;
  where?: InputMaybe<SkillNodeWhereInput>;
};

export type SkillNodeUpsertWithoutProgressesInput = {
  create: SkillNodeCreateWithoutProgressesInput;
  update: SkillNodeUpdateWithoutProgressesInput;
  where?: InputMaybe<SkillNodeWhereInput>;
};

export type SkillNodeUpsertWithoutQuizInput = {
  create: SkillNodeCreateWithoutQuizInput;
  update: SkillNodeUpdateWithoutQuizInput;
  where?: InputMaybe<SkillNodeWhereInput>;
};

export type SkillNodeUpsertWithoutRequiredForInput = {
  create: SkillNodeCreateWithoutRequiredForInput;
  update: SkillNodeUpdateWithoutRequiredForInput;
  where?: InputMaybe<SkillNodeWhereInput>;
};

export type SkillNodeWhereInput = {
  AND?: InputMaybe<Array<SkillNodeWhereInput>>;
  NOT?: InputMaybe<Array<SkillNodeWhereInput>>;
  OR?: InputMaybe<Array<SkillNodeWhereInput>>;
  createdAt?: InputMaybe<DateTimeFilter>;
  deletedAt?: InputMaybe<DateTimeNullableFilter>;
  id?: InputMaybe<UuidFilter>;
  lessons?: InputMaybe<LessonBlocksListRelationFilter>;
  orderInStep?: InputMaybe<IntFilter>;
  posX?: InputMaybe<IntNullableFilter>;
  posY?: InputMaybe<IntNullableFilter>;
  prerequisites?: InputMaybe<SkillNodePrerequisiteListRelationFilter>;
  progresses?: InputMaybe<UserNodeProgressListRelationFilter>;
  quiz?: InputMaybe<QuizWhereInput>;
  requiredFor?: InputMaybe<SkillNodePrerequisiteListRelationFilter>;
  step?: InputMaybe<IntFilter>;
  title?: InputMaybe<StringFilter>;
  tree?: InputMaybe<SkillTreeWhereInput>;
  treeId?: InputMaybe<UuidFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type SkillNodeWhereUniqueInput = {
  AND?: InputMaybe<Array<SkillNodeWhereInput>>;
  NOT?: InputMaybe<Array<SkillNodeWhereInput>>;
  OR?: InputMaybe<Array<SkillNodeWhereInput>>;
  createdAt?: InputMaybe<DateTimeFilter>;
  deletedAt?: InputMaybe<DateTimeNullableFilter>;
  id?: InputMaybe<Scalars['String']['input']>;
  lessons?: InputMaybe<LessonBlocksListRelationFilter>;
  orderInStep?: InputMaybe<IntFilter>;
  posX?: InputMaybe<IntNullableFilter>;
  posY?: InputMaybe<IntNullableFilter>;
  prerequisites?: InputMaybe<SkillNodePrerequisiteListRelationFilter>;
  progresses?: InputMaybe<UserNodeProgressListRelationFilter>;
  quiz?: InputMaybe<QuizWhereInput>;
  requiredFor?: InputMaybe<SkillNodePrerequisiteListRelationFilter>;
  step?: InputMaybe<IntFilter>;
  title?: InputMaybe<StringFilter>;
  tree?: InputMaybe<SkillTreeWhereInput>;
  treeId?: InputMaybe<UuidFilter>;
  treeId_posX_posY?: InputMaybe<SkillNodeTreeIdPosXPosYCompoundUniqueInput>;
  treeId_step_orderInStep?: InputMaybe<SkillNodeTreeIdStepOrderInStepCompoundUniqueInput>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type SkillTree = {
  __typename?: 'SkillTree';
  course: Course;
  courseId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  nodes: Array<SkillNode>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};


export type SkillTreeNodesArgs = {
  cursor?: InputMaybe<SkillNodeWhereUniqueInput>;
  distinct?: InputMaybe<Array<SkillNodeScalarFieldEnum>>;
  orderBy?: InputMaybe<Array<SkillNodeOrderByWithRelationInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<SkillNodeWhereInput>;
};

export type SkillTreeCountOrderByAggregateInput = {
  courseId?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  deletedAt?: InputMaybe<SortOrder>;
  description?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  title?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type SkillTreeCreateInput = {
  course: CourseCreateNestedOneWithoutTreesInput;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  deletedAt?: InputMaybe<Scalars['DateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  nodes?: InputMaybe<SkillNodeCreateNestedManyWithoutTreeInput>;
  title: Scalars['String']['input'];
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type SkillTreeCreateManyCourseInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  deletedAt?: InputMaybe<Scalars['DateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type SkillTreeCreateManyCourseInputEnvelope = {
  data: Array<SkillTreeCreateManyCourseInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type SkillTreeCreateManyInput = {
  courseId: Scalars['String']['input'];
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  deletedAt?: InputMaybe<Scalars['DateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type SkillTreeCreateNestedManyWithoutCourseInput = {
  connect?: InputMaybe<Array<SkillTreeWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<SkillTreeCreateOrConnectWithoutCourseInput>>;
  create?: InputMaybe<Array<SkillTreeCreateWithoutCourseInput>>;
  createMany?: InputMaybe<SkillTreeCreateManyCourseInputEnvelope>;
};

export type SkillTreeCreateNestedOneWithoutNodesInput = {
  connect?: InputMaybe<SkillTreeWhereUniqueInput>;
  connectOrCreate?: InputMaybe<SkillTreeCreateOrConnectWithoutNodesInput>;
  create?: InputMaybe<SkillTreeCreateWithoutNodesInput>;
};

export type SkillTreeCreateOrConnectWithoutCourseInput = {
  create: SkillTreeCreateWithoutCourseInput;
  where: SkillTreeWhereUniqueInput;
};

export type SkillTreeCreateOrConnectWithoutNodesInput = {
  create: SkillTreeCreateWithoutNodesInput;
  where: SkillTreeWhereUniqueInput;
};

export type SkillTreeCreateWithoutCourseInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  deletedAt?: InputMaybe<Scalars['DateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  nodes?: InputMaybe<SkillNodeCreateNestedManyWithoutTreeInput>;
  title: Scalars['String']['input'];
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type SkillTreeCreateWithoutNodesInput = {
  course: CourseCreateNestedOneWithoutTreesInput;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  deletedAt?: InputMaybe<Scalars['DateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type SkillTreeListRelationFilter = {
  every?: InputMaybe<SkillTreeWhereInput>;
  none?: InputMaybe<SkillTreeWhereInput>;
  some?: InputMaybe<SkillTreeWhereInput>;
};

export type SkillTreeMaxOrderByAggregateInput = {
  courseId?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  deletedAt?: InputMaybe<SortOrder>;
  description?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  title?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type SkillTreeMinOrderByAggregateInput = {
  courseId?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  deletedAt?: InputMaybe<SortOrder>;
  description?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  title?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type SkillTreeOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type SkillTreeOrderByWithAggregationInput = {
  _count?: InputMaybe<SkillTreeCountOrderByAggregateInput>;
  _max?: InputMaybe<SkillTreeMaxOrderByAggregateInput>;
  _min?: InputMaybe<SkillTreeMinOrderByAggregateInput>;
  courseId?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  deletedAt?: InputMaybe<SortOrder>;
  description?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  title?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type SkillTreeOrderByWithRelationInput = {
  course?: InputMaybe<CourseOrderByWithRelationInput>;
  courseId?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  deletedAt?: InputMaybe<SortOrder>;
  description?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  nodes?: InputMaybe<SkillNodeOrderByRelationAggregateInput>;
  title?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export enum SkillTreeScalarFieldEnum {
  CourseId = 'courseId',
  CreatedAt = 'createdAt',
  DeletedAt = 'deletedAt',
  Description = 'description',
  Id = 'id',
  Title = 'title',
  UpdatedAt = 'updatedAt'
}

export type SkillTreeScalarRelationFilter = {
  is?: InputMaybe<SkillTreeWhereInput>;
  isNot?: InputMaybe<SkillTreeWhereInput>;
};

export type SkillTreeScalarWhereInput = {
  AND?: InputMaybe<Array<SkillTreeScalarWhereInput>>;
  NOT?: InputMaybe<Array<SkillTreeScalarWhereInput>>;
  OR?: InputMaybe<Array<SkillTreeScalarWhereInput>>;
  courseId?: InputMaybe<UuidFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  deletedAt?: InputMaybe<DateTimeNullableFilter>;
  description?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<UuidFilter>;
  title?: InputMaybe<StringFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type SkillTreeScalarWhereWithAggregatesInput = {
  AND?: InputMaybe<Array<SkillTreeScalarWhereWithAggregatesInput>>;
  NOT?: InputMaybe<Array<SkillTreeScalarWhereWithAggregatesInput>>;
  OR?: InputMaybe<Array<SkillTreeScalarWhereWithAggregatesInput>>;
  courseId?: InputMaybe<UuidWithAggregatesFilter>;
  createdAt?: InputMaybe<DateTimeWithAggregatesFilter>;
  deletedAt?: InputMaybe<DateTimeNullableWithAggregatesFilter>;
  description?: InputMaybe<StringNullableWithAggregatesFilter>;
  id?: InputMaybe<UuidWithAggregatesFilter>;
  title?: InputMaybe<StringWithAggregatesFilter>;
  updatedAt?: InputMaybe<DateTimeWithAggregatesFilter>;
};

export type SkillTreeUpdateInput = {
  course?: InputMaybe<CourseUpdateOneRequiredWithoutTreesNestedInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  deletedAt?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  description?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  nodes?: InputMaybe<SkillNodeUpdateManyWithoutTreeNestedInput>;
  title?: InputMaybe<StringFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type SkillTreeUpdateManyMutationInput = {
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  deletedAt?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  description?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  title?: InputMaybe<StringFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type SkillTreeUpdateManyWithWhereWithoutCourseInput = {
  data: SkillTreeUpdateManyMutationInput;
  where: SkillTreeScalarWhereInput;
};

export type SkillTreeUpdateManyWithoutCourseNestedInput = {
  connect?: InputMaybe<Array<SkillTreeWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<SkillTreeCreateOrConnectWithoutCourseInput>>;
  create?: InputMaybe<Array<SkillTreeCreateWithoutCourseInput>>;
  createMany?: InputMaybe<SkillTreeCreateManyCourseInputEnvelope>;
  delete?: InputMaybe<Array<SkillTreeWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<SkillTreeScalarWhereInput>>;
  disconnect?: InputMaybe<Array<SkillTreeWhereUniqueInput>>;
  set?: InputMaybe<Array<SkillTreeWhereUniqueInput>>;
  update?: InputMaybe<Array<SkillTreeUpdateWithWhereUniqueWithoutCourseInput>>;
  updateMany?: InputMaybe<Array<SkillTreeUpdateManyWithWhereWithoutCourseInput>>;
  upsert?: InputMaybe<Array<SkillTreeUpsertWithWhereUniqueWithoutCourseInput>>;
};

export type SkillTreeUpdateOneRequiredWithoutNodesNestedInput = {
  connect?: InputMaybe<SkillTreeWhereUniqueInput>;
  connectOrCreate?: InputMaybe<SkillTreeCreateOrConnectWithoutNodesInput>;
  create?: InputMaybe<SkillTreeCreateWithoutNodesInput>;
  update?: InputMaybe<SkillTreeUpdateToOneWithWhereWithoutNodesInput>;
  upsert?: InputMaybe<SkillTreeUpsertWithoutNodesInput>;
};

export type SkillTreeUpdateToOneWithWhereWithoutNodesInput = {
  data: SkillTreeUpdateWithoutNodesInput;
  where?: InputMaybe<SkillTreeWhereInput>;
};

export type SkillTreeUpdateWithWhereUniqueWithoutCourseInput = {
  data: SkillTreeUpdateWithoutCourseInput;
  where: SkillTreeWhereUniqueInput;
};

export type SkillTreeUpdateWithoutCourseInput = {
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  deletedAt?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  description?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  nodes?: InputMaybe<SkillNodeUpdateManyWithoutTreeNestedInput>;
  title?: InputMaybe<StringFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type SkillTreeUpdateWithoutNodesInput = {
  course?: InputMaybe<CourseUpdateOneRequiredWithoutTreesNestedInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  deletedAt?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  description?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  title?: InputMaybe<StringFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type SkillTreeUpsertWithWhereUniqueWithoutCourseInput = {
  create: SkillTreeCreateWithoutCourseInput;
  update: SkillTreeUpdateWithoutCourseInput;
  where: SkillTreeWhereUniqueInput;
};

export type SkillTreeUpsertWithoutNodesInput = {
  create: SkillTreeCreateWithoutNodesInput;
  update: SkillTreeUpdateWithoutNodesInput;
  where?: InputMaybe<SkillTreeWhereInput>;
};

export type SkillTreeWhereInput = {
  AND?: InputMaybe<Array<SkillTreeWhereInput>>;
  NOT?: InputMaybe<Array<SkillTreeWhereInput>>;
  OR?: InputMaybe<Array<SkillTreeWhereInput>>;
  course?: InputMaybe<CourseWhereInput>;
  courseId?: InputMaybe<UuidFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  deletedAt?: InputMaybe<DateTimeNullableFilter>;
  description?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<UuidFilter>;
  nodes?: InputMaybe<SkillNodeListRelationFilter>;
  title?: InputMaybe<StringFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type SkillTreeWhereUniqueInput = {
  AND?: InputMaybe<Array<SkillTreeWhereInput>>;
  NOT?: InputMaybe<Array<SkillTreeWhereInput>>;
  OR?: InputMaybe<Array<SkillTreeWhereInput>>;
  course?: InputMaybe<CourseWhereInput>;
  courseId?: InputMaybe<UuidFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  deletedAt?: InputMaybe<DateTimeNullableFilter>;
  description?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<Scalars['String']['input']>;
  nodes?: InputMaybe<SkillNodeListRelationFilter>;
  title?: InputMaybe<StringFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export enum SortOrder {
  Asc = 'asc',
  Desc = 'desc'
}

export type StringFieldUpdateOperationsInput = {
  set?: InputMaybe<Scalars['String']['input']>;
};

export type StringFilter = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  mode?: InputMaybe<QueryMode>;
  not?: InputMaybe<NestedStringFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type StringNullableFilter = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  mode?: InputMaybe<QueryMode>;
  not?: InputMaybe<NestedStringNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type StringNullableWithAggregatesFilter = {
  _count?: InputMaybe<NestedIntNullableFilter>;
  _max?: InputMaybe<NestedStringNullableFilter>;
  _min?: InputMaybe<NestedStringNullableFilter>;
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  mode?: InputMaybe<QueryMode>;
  not?: InputMaybe<NestedStringNullableWithAggregatesFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type StringWithAggregatesFilter = {
  _count?: InputMaybe<NestedIntFilter>;
  _max?: InputMaybe<NestedStringFilter>;
  _min?: InputMaybe<NestedStringFilter>;
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  mode?: InputMaybe<QueryMode>;
  not?: InputMaybe<NestedStringWithAggregatesFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export enum TransactionIsolationLevel {
  ReadCommitted = 'ReadCommitted',
  ReadUncommitted = 'ReadUncommitted',
  RepeatableRead = 'RepeatableRead',
  Serializable = 'Serializable'
}

export type UpdateCourseInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<CourseStatus>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateSkillNodeInput = {
  posX?: InputMaybe<Scalars['Int']['input']>;
  posY?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateSkillTreeInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  coursesAuthored: Array<Course>;
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  nodeProgress: Array<UserNodeProgress>;
  photoUrl?: Maybe<Scalars['String']['output']>;
  quizAttempts: Array<QuizAttempt>;
  role: Role;
  updatedAt: Scalars['DateTime']['output'];
};


export type UserCoursesAuthoredArgs = {
  cursor?: InputMaybe<CourseWhereUniqueInput>;
  distinct?: InputMaybe<Array<CourseScalarFieldEnum>>;
  orderBy?: InputMaybe<Array<CourseOrderByWithRelationInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<CourseWhereInput>;
};


export type UserNodeProgressArgs = {
  cursor?: InputMaybe<UserNodeProgressWhereUniqueInput>;
  distinct?: InputMaybe<Array<UserNodeProgressScalarFieldEnum>>;
  orderBy?: InputMaybe<Array<UserNodeProgressOrderByWithRelationInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<UserNodeProgressWhereInput>;
};


export type UserQuizAttemptsArgs = {
  cursor?: InputMaybe<QuizAttemptWhereUniqueInput>;
  distinct?: InputMaybe<Array<QuizAttemptScalarFieldEnum>>;
  orderBy?: InputMaybe<Array<QuizAttemptOrderByWithRelationInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<QuizAttemptWhereInput>;
};

export type UserCountOrderByAggregateInput = {
  createdAt?: InputMaybe<SortOrder>;
  email?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  photoUrl?: InputMaybe<SortOrder>;
  role?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type UserCreateInput = {
  coursesAuthored?: InputMaybe<CourseCreateNestedManyWithoutAuthorInput>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  email: Scalars['String']['input'];
  id: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  nodeProgress?: InputMaybe<UserNodeProgressCreateNestedManyWithoutUserInput>;
  photoUrl?: InputMaybe<Scalars['String']['input']>;
  quizAttempts?: InputMaybe<QuizAttemptCreateNestedManyWithoutUserInput>;
  role?: InputMaybe<Role>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type UserCreateManyInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  email: Scalars['String']['input'];
  id: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  photoUrl?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Role>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type UserCreateNestedOneWithoutCoursesAuthoredInput = {
  connect?: InputMaybe<UserWhereUniqueInput>;
  connectOrCreate?: InputMaybe<UserCreateOrConnectWithoutCoursesAuthoredInput>;
  create?: InputMaybe<UserCreateWithoutCoursesAuthoredInput>;
};

export type UserCreateNestedOneWithoutNodeProgressInput = {
  connect?: InputMaybe<UserWhereUniqueInput>;
  connectOrCreate?: InputMaybe<UserCreateOrConnectWithoutNodeProgressInput>;
  create?: InputMaybe<UserCreateWithoutNodeProgressInput>;
};

export type UserCreateNestedOneWithoutQuizAttemptsInput = {
  connect?: InputMaybe<UserWhereUniqueInput>;
  connectOrCreate?: InputMaybe<UserCreateOrConnectWithoutQuizAttemptsInput>;
  create?: InputMaybe<UserCreateWithoutQuizAttemptsInput>;
};

export type UserCreateOrConnectWithoutCoursesAuthoredInput = {
  create: UserCreateWithoutCoursesAuthoredInput;
  where: UserWhereUniqueInput;
};

export type UserCreateOrConnectWithoutNodeProgressInput = {
  create: UserCreateWithoutNodeProgressInput;
  where: UserWhereUniqueInput;
};

export type UserCreateOrConnectWithoutQuizAttemptsInput = {
  create: UserCreateWithoutQuizAttemptsInput;
  where: UserWhereUniqueInput;
};

export type UserCreateWithoutCoursesAuthoredInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  email: Scalars['String']['input'];
  id: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  nodeProgress?: InputMaybe<UserNodeProgressCreateNestedManyWithoutUserInput>;
  photoUrl?: InputMaybe<Scalars['String']['input']>;
  quizAttempts?: InputMaybe<QuizAttemptCreateNestedManyWithoutUserInput>;
  role?: InputMaybe<Role>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type UserCreateWithoutNodeProgressInput = {
  coursesAuthored?: InputMaybe<CourseCreateNestedManyWithoutAuthorInput>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  email: Scalars['String']['input'];
  id: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  photoUrl?: InputMaybe<Scalars['String']['input']>;
  quizAttempts?: InputMaybe<QuizAttemptCreateNestedManyWithoutUserInput>;
  role?: InputMaybe<Role>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type UserCreateWithoutQuizAttemptsInput = {
  coursesAuthored?: InputMaybe<CourseCreateNestedManyWithoutAuthorInput>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  email: Scalars['String']['input'];
  id: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  nodeProgress?: InputMaybe<UserNodeProgressCreateNestedManyWithoutUserInput>;
  photoUrl?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Role>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type UserMaxOrderByAggregateInput = {
  createdAt?: InputMaybe<SortOrder>;
  email?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  photoUrl?: InputMaybe<SortOrder>;
  role?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type UserMinOrderByAggregateInput = {
  createdAt?: InputMaybe<SortOrder>;
  email?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  photoUrl?: InputMaybe<SortOrder>;
  role?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type UserNodeProgress = {
  __typename?: 'UserNodeProgress';
  completedAt?: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  node: SkillNode;
  nodeId: Scalars['String']['output'];
  status: ProgressStatus;
  updatedAt: Scalars['DateTime']['output'];
  user: User;
  userId: Scalars['String']['output'];
};

export type UserNodeProgressCountOrderByAggregateInput = {
  completedAt?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  nodeId?: InputMaybe<SortOrder>;
  status?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
  userId?: InputMaybe<SortOrder>;
};

export type UserNodeProgressCreateInput = {
  completedAt?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  node: SkillNodeCreateNestedOneWithoutProgressesInput;
  status?: InputMaybe<ProgressStatus>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  user: UserCreateNestedOneWithoutNodeProgressInput;
};

export type UserNodeProgressCreateManyInput = {
  completedAt?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  nodeId: Scalars['String']['input'];
  status?: InputMaybe<ProgressStatus>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  userId: Scalars['String']['input'];
};

export type UserNodeProgressCreateManyNodeInput = {
  completedAt?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<ProgressStatus>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  userId: Scalars['String']['input'];
};

export type UserNodeProgressCreateManyNodeInputEnvelope = {
  data: Array<UserNodeProgressCreateManyNodeInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UserNodeProgressCreateManyUserInput = {
  completedAt?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  nodeId: Scalars['String']['input'];
  status?: InputMaybe<ProgressStatus>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type UserNodeProgressCreateManyUserInputEnvelope = {
  data: Array<UserNodeProgressCreateManyUserInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UserNodeProgressCreateNestedManyWithoutNodeInput = {
  connect?: InputMaybe<Array<UserNodeProgressWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<UserNodeProgressCreateOrConnectWithoutNodeInput>>;
  create?: InputMaybe<Array<UserNodeProgressCreateWithoutNodeInput>>;
  createMany?: InputMaybe<UserNodeProgressCreateManyNodeInputEnvelope>;
};

export type UserNodeProgressCreateNestedManyWithoutUserInput = {
  connect?: InputMaybe<Array<UserNodeProgressWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<UserNodeProgressCreateOrConnectWithoutUserInput>>;
  create?: InputMaybe<Array<UserNodeProgressCreateWithoutUserInput>>;
  createMany?: InputMaybe<UserNodeProgressCreateManyUserInputEnvelope>;
};

export type UserNodeProgressCreateOrConnectWithoutNodeInput = {
  create: UserNodeProgressCreateWithoutNodeInput;
  where: UserNodeProgressWhereUniqueInput;
};

export type UserNodeProgressCreateOrConnectWithoutUserInput = {
  create: UserNodeProgressCreateWithoutUserInput;
  where: UserNodeProgressWhereUniqueInput;
};

export type UserNodeProgressCreateWithoutNodeInput = {
  completedAt?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<ProgressStatus>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  user: UserCreateNestedOneWithoutNodeProgressInput;
};

export type UserNodeProgressCreateWithoutUserInput = {
  completedAt?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  node: SkillNodeCreateNestedOneWithoutProgressesInput;
  status?: InputMaybe<ProgressStatus>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type UserNodeProgressListRelationFilter = {
  every?: InputMaybe<UserNodeProgressWhereInput>;
  none?: InputMaybe<UserNodeProgressWhereInput>;
  some?: InputMaybe<UserNodeProgressWhereInput>;
};

export type UserNodeProgressMaxOrderByAggregateInput = {
  completedAt?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  nodeId?: InputMaybe<SortOrder>;
  status?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
  userId?: InputMaybe<SortOrder>;
};

export type UserNodeProgressMinOrderByAggregateInput = {
  completedAt?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  nodeId?: InputMaybe<SortOrder>;
  status?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
  userId?: InputMaybe<SortOrder>;
};

export type UserNodeProgressOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type UserNodeProgressOrderByWithAggregationInput = {
  _count?: InputMaybe<UserNodeProgressCountOrderByAggregateInput>;
  _max?: InputMaybe<UserNodeProgressMaxOrderByAggregateInput>;
  _min?: InputMaybe<UserNodeProgressMinOrderByAggregateInput>;
  completedAt?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  nodeId?: InputMaybe<SortOrder>;
  status?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
  userId?: InputMaybe<SortOrder>;
};

export type UserNodeProgressOrderByWithRelationInput = {
  completedAt?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  node?: InputMaybe<SkillNodeOrderByWithRelationInput>;
  nodeId?: InputMaybe<SortOrder>;
  status?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
  user?: InputMaybe<UserOrderByWithRelationInput>;
  userId?: InputMaybe<SortOrder>;
};

export enum UserNodeProgressScalarFieldEnum {
  CompletedAt = 'completedAt',
  CreatedAt = 'createdAt',
  Id = 'id',
  NodeId = 'nodeId',
  Status = 'status',
  UpdatedAt = 'updatedAt',
  UserId = 'userId'
}

export type UserNodeProgressScalarWhereInput = {
  AND?: InputMaybe<Array<UserNodeProgressScalarWhereInput>>;
  NOT?: InputMaybe<Array<UserNodeProgressScalarWhereInput>>;
  OR?: InputMaybe<Array<UserNodeProgressScalarWhereInput>>;
  completedAt?: InputMaybe<DateTimeNullableFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<UuidFilter>;
  nodeId?: InputMaybe<UuidFilter>;
  status?: InputMaybe<EnumProgressStatusFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
  userId?: InputMaybe<StringFilter>;
};

export type UserNodeProgressScalarWhereWithAggregatesInput = {
  AND?: InputMaybe<Array<UserNodeProgressScalarWhereWithAggregatesInput>>;
  NOT?: InputMaybe<Array<UserNodeProgressScalarWhereWithAggregatesInput>>;
  OR?: InputMaybe<Array<UserNodeProgressScalarWhereWithAggregatesInput>>;
  completedAt?: InputMaybe<DateTimeNullableWithAggregatesFilter>;
  createdAt?: InputMaybe<DateTimeWithAggregatesFilter>;
  id?: InputMaybe<UuidWithAggregatesFilter>;
  nodeId?: InputMaybe<UuidWithAggregatesFilter>;
  status?: InputMaybe<EnumProgressStatusWithAggregatesFilter>;
  updatedAt?: InputMaybe<DateTimeWithAggregatesFilter>;
  userId?: InputMaybe<StringWithAggregatesFilter>;
};

export type UserNodeProgressUpdateInput = {
  completedAt?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  node?: InputMaybe<SkillNodeUpdateOneRequiredWithoutProgressesNestedInput>;
  status?: InputMaybe<EnumProgressStatusFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  user?: InputMaybe<UserUpdateOneRequiredWithoutNodeProgressNestedInput>;
};

export type UserNodeProgressUpdateManyMutationInput = {
  completedAt?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  status?: InputMaybe<EnumProgressStatusFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type UserNodeProgressUpdateManyWithWhereWithoutNodeInput = {
  data: UserNodeProgressUpdateManyMutationInput;
  where: UserNodeProgressScalarWhereInput;
};

export type UserNodeProgressUpdateManyWithWhereWithoutUserInput = {
  data: UserNodeProgressUpdateManyMutationInput;
  where: UserNodeProgressScalarWhereInput;
};

export type UserNodeProgressUpdateManyWithoutNodeNestedInput = {
  connect?: InputMaybe<Array<UserNodeProgressWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<UserNodeProgressCreateOrConnectWithoutNodeInput>>;
  create?: InputMaybe<Array<UserNodeProgressCreateWithoutNodeInput>>;
  createMany?: InputMaybe<UserNodeProgressCreateManyNodeInputEnvelope>;
  delete?: InputMaybe<Array<UserNodeProgressWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<UserNodeProgressScalarWhereInput>>;
  disconnect?: InputMaybe<Array<UserNodeProgressWhereUniqueInput>>;
  set?: InputMaybe<Array<UserNodeProgressWhereUniqueInput>>;
  update?: InputMaybe<Array<UserNodeProgressUpdateWithWhereUniqueWithoutNodeInput>>;
  updateMany?: InputMaybe<Array<UserNodeProgressUpdateManyWithWhereWithoutNodeInput>>;
  upsert?: InputMaybe<Array<UserNodeProgressUpsertWithWhereUniqueWithoutNodeInput>>;
};

export type UserNodeProgressUpdateManyWithoutUserNestedInput = {
  connect?: InputMaybe<Array<UserNodeProgressWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<UserNodeProgressCreateOrConnectWithoutUserInput>>;
  create?: InputMaybe<Array<UserNodeProgressCreateWithoutUserInput>>;
  createMany?: InputMaybe<UserNodeProgressCreateManyUserInputEnvelope>;
  delete?: InputMaybe<Array<UserNodeProgressWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<UserNodeProgressScalarWhereInput>>;
  disconnect?: InputMaybe<Array<UserNodeProgressWhereUniqueInput>>;
  set?: InputMaybe<Array<UserNodeProgressWhereUniqueInput>>;
  update?: InputMaybe<Array<UserNodeProgressUpdateWithWhereUniqueWithoutUserInput>>;
  updateMany?: InputMaybe<Array<UserNodeProgressUpdateManyWithWhereWithoutUserInput>>;
  upsert?: InputMaybe<Array<UserNodeProgressUpsertWithWhereUniqueWithoutUserInput>>;
};

export type UserNodeProgressUpdateWithWhereUniqueWithoutNodeInput = {
  data: UserNodeProgressUpdateWithoutNodeInput;
  where: UserNodeProgressWhereUniqueInput;
};

export type UserNodeProgressUpdateWithWhereUniqueWithoutUserInput = {
  data: UserNodeProgressUpdateWithoutUserInput;
  where: UserNodeProgressWhereUniqueInput;
};

export type UserNodeProgressUpdateWithoutNodeInput = {
  completedAt?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  status?: InputMaybe<EnumProgressStatusFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  user?: InputMaybe<UserUpdateOneRequiredWithoutNodeProgressNestedInput>;
};

export type UserNodeProgressUpdateWithoutUserInput = {
  completedAt?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  node?: InputMaybe<SkillNodeUpdateOneRequiredWithoutProgressesNestedInput>;
  status?: InputMaybe<EnumProgressStatusFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type UserNodeProgressUpsertWithWhereUniqueWithoutNodeInput = {
  create: UserNodeProgressCreateWithoutNodeInput;
  update: UserNodeProgressUpdateWithoutNodeInput;
  where: UserNodeProgressWhereUniqueInput;
};

export type UserNodeProgressUpsertWithWhereUniqueWithoutUserInput = {
  create: UserNodeProgressCreateWithoutUserInput;
  update: UserNodeProgressUpdateWithoutUserInput;
  where: UserNodeProgressWhereUniqueInput;
};

export type UserNodeProgressUserIdNodeIdCompoundUniqueInput = {
  nodeId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};

export type UserNodeProgressWhereInput = {
  AND?: InputMaybe<Array<UserNodeProgressWhereInput>>;
  NOT?: InputMaybe<Array<UserNodeProgressWhereInput>>;
  OR?: InputMaybe<Array<UserNodeProgressWhereInput>>;
  completedAt?: InputMaybe<DateTimeNullableFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<UuidFilter>;
  node?: InputMaybe<SkillNodeWhereInput>;
  nodeId?: InputMaybe<UuidFilter>;
  status?: InputMaybe<EnumProgressStatusFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
  user?: InputMaybe<UserWhereInput>;
  userId?: InputMaybe<StringFilter>;
};

export type UserNodeProgressWhereUniqueInput = {
  AND?: InputMaybe<Array<UserNodeProgressWhereInput>>;
  NOT?: InputMaybe<Array<UserNodeProgressWhereInput>>;
  OR?: InputMaybe<Array<UserNodeProgressWhereInput>>;
  completedAt?: InputMaybe<DateTimeNullableFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<Scalars['String']['input']>;
  node?: InputMaybe<SkillNodeWhereInput>;
  nodeId?: InputMaybe<UuidFilter>;
  status?: InputMaybe<EnumProgressStatusFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
  user?: InputMaybe<UserWhereInput>;
  userId?: InputMaybe<StringFilter>;
  userId_nodeId?: InputMaybe<UserNodeProgressUserIdNodeIdCompoundUniqueInput>;
};

export type UserOrderByWithAggregationInput = {
  _count?: InputMaybe<UserCountOrderByAggregateInput>;
  _max?: InputMaybe<UserMaxOrderByAggregateInput>;
  _min?: InputMaybe<UserMinOrderByAggregateInput>;
  createdAt?: InputMaybe<SortOrder>;
  email?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  photoUrl?: InputMaybe<SortOrder>;
  role?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type UserOrderByWithRelationInput = {
  coursesAuthored?: InputMaybe<CourseOrderByRelationAggregateInput>;
  createdAt?: InputMaybe<SortOrder>;
  email?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  nodeProgress?: InputMaybe<UserNodeProgressOrderByRelationAggregateInput>;
  photoUrl?: InputMaybe<SortOrder>;
  quizAttempts?: InputMaybe<QuizAttemptOrderByRelationAggregateInput>;
  role?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export enum UserScalarFieldEnum {
  CreatedAt = 'createdAt',
  Email = 'email',
  Id = 'id',
  Name = 'name',
  PhotoUrl = 'photoUrl',
  Role = 'role',
  UpdatedAt = 'updatedAt'
}

export type UserScalarRelationFilter = {
  is?: InputMaybe<UserWhereInput>;
  isNot?: InputMaybe<UserWhereInput>;
};

export type UserScalarWhereWithAggregatesInput = {
  AND?: InputMaybe<Array<UserScalarWhereWithAggregatesInput>>;
  NOT?: InputMaybe<Array<UserScalarWhereWithAggregatesInput>>;
  OR?: InputMaybe<Array<UserScalarWhereWithAggregatesInput>>;
  createdAt?: InputMaybe<DateTimeWithAggregatesFilter>;
  email?: InputMaybe<StringWithAggregatesFilter>;
  id?: InputMaybe<StringWithAggregatesFilter>;
  name?: InputMaybe<StringNullableWithAggregatesFilter>;
  photoUrl?: InputMaybe<StringNullableWithAggregatesFilter>;
  role?: InputMaybe<EnumRoleWithAggregatesFilter>;
  updatedAt?: InputMaybe<DateTimeWithAggregatesFilter>;
};

export type UserUpdateInput = {
  coursesAuthored?: InputMaybe<CourseUpdateManyWithoutAuthorNestedInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  email?: InputMaybe<StringFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  name?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  nodeProgress?: InputMaybe<UserNodeProgressUpdateManyWithoutUserNestedInput>;
  photoUrl?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  quizAttempts?: InputMaybe<QuizAttemptUpdateManyWithoutUserNestedInput>;
  role?: InputMaybe<EnumRoleFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type UserUpdateManyMutationInput = {
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  email?: InputMaybe<StringFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  name?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  photoUrl?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  role?: InputMaybe<EnumRoleFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type UserUpdateOneRequiredWithoutCoursesAuthoredNestedInput = {
  connect?: InputMaybe<UserWhereUniqueInput>;
  connectOrCreate?: InputMaybe<UserCreateOrConnectWithoutCoursesAuthoredInput>;
  create?: InputMaybe<UserCreateWithoutCoursesAuthoredInput>;
  update?: InputMaybe<UserUpdateToOneWithWhereWithoutCoursesAuthoredInput>;
  upsert?: InputMaybe<UserUpsertWithoutCoursesAuthoredInput>;
};

export type UserUpdateOneRequiredWithoutNodeProgressNestedInput = {
  connect?: InputMaybe<UserWhereUniqueInput>;
  connectOrCreate?: InputMaybe<UserCreateOrConnectWithoutNodeProgressInput>;
  create?: InputMaybe<UserCreateWithoutNodeProgressInput>;
  update?: InputMaybe<UserUpdateToOneWithWhereWithoutNodeProgressInput>;
  upsert?: InputMaybe<UserUpsertWithoutNodeProgressInput>;
};

export type UserUpdateOneRequiredWithoutQuizAttemptsNestedInput = {
  connect?: InputMaybe<UserWhereUniqueInput>;
  connectOrCreate?: InputMaybe<UserCreateOrConnectWithoutQuizAttemptsInput>;
  create?: InputMaybe<UserCreateWithoutQuizAttemptsInput>;
  update?: InputMaybe<UserUpdateToOneWithWhereWithoutQuizAttemptsInput>;
  upsert?: InputMaybe<UserUpsertWithoutQuizAttemptsInput>;
};

export type UserUpdateToOneWithWhereWithoutCoursesAuthoredInput = {
  data: UserUpdateWithoutCoursesAuthoredInput;
  where?: InputMaybe<UserWhereInput>;
};

export type UserUpdateToOneWithWhereWithoutNodeProgressInput = {
  data: UserUpdateWithoutNodeProgressInput;
  where?: InputMaybe<UserWhereInput>;
};

export type UserUpdateToOneWithWhereWithoutQuizAttemptsInput = {
  data: UserUpdateWithoutQuizAttemptsInput;
  where?: InputMaybe<UserWhereInput>;
};

export type UserUpdateWithoutCoursesAuthoredInput = {
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  email?: InputMaybe<StringFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  name?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  nodeProgress?: InputMaybe<UserNodeProgressUpdateManyWithoutUserNestedInput>;
  photoUrl?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  quizAttempts?: InputMaybe<QuizAttemptUpdateManyWithoutUserNestedInput>;
  role?: InputMaybe<EnumRoleFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type UserUpdateWithoutNodeProgressInput = {
  coursesAuthored?: InputMaybe<CourseUpdateManyWithoutAuthorNestedInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  email?: InputMaybe<StringFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  name?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  photoUrl?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  quizAttempts?: InputMaybe<QuizAttemptUpdateManyWithoutUserNestedInput>;
  role?: InputMaybe<EnumRoleFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type UserUpdateWithoutQuizAttemptsInput = {
  coursesAuthored?: InputMaybe<CourseUpdateManyWithoutAuthorNestedInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  email?: InputMaybe<StringFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  name?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  nodeProgress?: InputMaybe<UserNodeProgressUpdateManyWithoutUserNestedInput>;
  photoUrl?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  role?: InputMaybe<EnumRoleFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type UserUpsertWithoutCoursesAuthoredInput = {
  create: UserCreateWithoutCoursesAuthoredInput;
  update: UserUpdateWithoutCoursesAuthoredInput;
  where?: InputMaybe<UserWhereInput>;
};

export type UserUpsertWithoutNodeProgressInput = {
  create: UserCreateWithoutNodeProgressInput;
  update: UserUpdateWithoutNodeProgressInput;
  where?: InputMaybe<UserWhereInput>;
};

export type UserUpsertWithoutQuizAttemptsInput = {
  create: UserCreateWithoutQuizAttemptsInput;
  update: UserUpdateWithoutQuizAttemptsInput;
  where?: InputMaybe<UserWhereInput>;
};

export type UserWhereInput = {
  AND?: InputMaybe<Array<UserWhereInput>>;
  NOT?: InputMaybe<Array<UserWhereInput>>;
  OR?: InputMaybe<Array<UserWhereInput>>;
  coursesAuthored?: InputMaybe<CourseListRelationFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  email?: InputMaybe<StringFilter>;
  id?: InputMaybe<StringFilter>;
  name?: InputMaybe<StringNullableFilter>;
  nodeProgress?: InputMaybe<UserNodeProgressListRelationFilter>;
  photoUrl?: InputMaybe<StringNullableFilter>;
  quizAttempts?: InputMaybe<QuizAttemptListRelationFilter>;
  role?: InputMaybe<EnumRoleFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type UserWhereUniqueInput = {
  AND?: InputMaybe<Array<UserWhereInput>>;
  NOT?: InputMaybe<Array<UserWhereInput>>;
  OR?: InputMaybe<Array<UserWhereInput>>;
  coursesAuthored?: InputMaybe<CourseListRelationFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<StringNullableFilter>;
  nodeProgress?: InputMaybe<UserNodeProgressListRelationFilter>;
  photoUrl?: InputMaybe<StringNullableFilter>;
  quizAttempts?: InputMaybe<QuizAttemptListRelationFilter>;
  role?: InputMaybe<EnumRoleFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type UuidFilter = {
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  mode?: InputMaybe<QueryMode>;
  not?: InputMaybe<NestedUuidFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type UuidWithAggregatesFilter = {
  _count?: InputMaybe<NestedIntFilter>;
  _max?: InputMaybe<NestedStringFilter>;
  _min?: InputMaybe<NestedStringFilter>;
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  mode?: InputMaybe<QueryMode>;
  not?: InputMaybe<NestedUuidWithAggregatesFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
};
