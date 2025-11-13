import * as User from './User';
import * as Course from './Course';
import * as SkillTree from './SkillTree';
import * as SkillNode from './SkillNode';
import * as SkillNodePrerequisite from './SkillNodePrerequisite';
import * as LessonBlocks from './LessonBlocks';
import * as Quiz from './Quiz';
import * as QuizQuestion from './QuizQuestion';
import * as QuizOption from './QuizOption';
import * as QuizAttempt from './QuizAttempt';
import * as QuizAttemptAnswer from './QuizAttemptAnswer';
import * as UserNodeProgress from './UserNodeProgress';
import { builder } from '../builder';
import * as Objects from './objects';

type Model = Objects.Model;

export const Cruds: Record<
  Objects.Model,
  {
    Object: any;
    queries: Record<string, Function>;
    mutations: Record<string, Function>;
  }
> = {
  User: {
    Object: User.UserObject,
    queries: {
      findFirst: User.findFirstUserQueryObject,
      findMany: User.findManyUserQueryObject,
      count: User.countUserQueryObject,
      findUnique: User.findUniqueUserQueryObject,
    },
    mutations: {
      createMany: User.createManyUserMutationObject,
      createOne: User.createOneUserMutationObject,
      deleteMany: User.deleteManyUserMutationObject,
      deleteOne: User.deleteOneUserMutationObject,
      updateMany: User.updateManyUserMutationObject,
      updateOne: User.updateOneUserMutationObject,
      upsertOne: User.upsertOneUserMutationObject,
    },
  },
  Course: {
    Object: Course.CourseObject,
    queries: {
      findFirst: Course.findFirstCourseQueryObject,
      findMany: Course.findManyCourseQueryObject,
      count: Course.countCourseQueryObject,
      findUnique: Course.findUniqueCourseQueryObject,
    },
    mutations: {
      createMany: Course.createManyCourseMutationObject,
      createOne: Course.createOneCourseMutationObject,
      deleteMany: Course.deleteManyCourseMutationObject,
      deleteOne: Course.deleteOneCourseMutationObject,
      updateMany: Course.updateManyCourseMutationObject,
      updateOne: Course.updateOneCourseMutationObject,
      upsertOne: Course.upsertOneCourseMutationObject,
    },
  },
  SkillTree: {
    Object: SkillTree.SkillTreeObject,
    queries: {
      findFirst: SkillTree.findFirstSkillTreeQueryObject,
      findMany: SkillTree.findManySkillTreeQueryObject,
      count: SkillTree.countSkillTreeQueryObject,
      findUnique: SkillTree.findUniqueSkillTreeQueryObject,
    },
    mutations: {
      createMany: SkillTree.createManySkillTreeMutationObject,
      createOne: SkillTree.createOneSkillTreeMutationObject,
      deleteMany: SkillTree.deleteManySkillTreeMutationObject,
      deleteOne: SkillTree.deleteOneSkillTreeMutationObject,
      updateMany: SkillTree.updateManySkillTreeMutationObject,
      updateOne: SkillTree.updateOneSkillTreeMutationObject,
      upsertOne: SkillTree.upsertOneSkillTreeMutationObject,
    },
  },
  SkillNode: {
    Object: SkillNode.SkillNodeObject,
    queries: {
      findFirst: SkillNode.findFirstSkillNodeQueryObject,
      findMany: SkillNode.findManySkillNodeQueryObject,
      count: SkillNode.countSkillNodeQueryObject,
      findUnique: SkillNode.findUniqueSkillNodeQueryObject,
    },
    mutations: {
      createMany: SkillNode.createManySkillNodeMutationObject,
      createOne: SkillNode.createOneSkillNodeMutationObject,
      deleteMany: SkillNode.deleteManySkillNodeMutationObject,
      deleteOne: SkillNode.deleteOneSkillNodeMutationObject,
      updateMany: SkillNode.updateManySkillNodeMutationObject,
      updateOne: SkillNode.updateOneSkillNodeMutationObject,
      upsertOne: SkillNode.upsertOneSkillNodeMutationObject,
    },
  },
  SkillNodePrerequisite: {
    Object: SkillNodePrerequisite.SkillNodePrerequisiteObject,
    queries: {
      findFirst: SkillNodePrerequisite.findFirstSkillNodePrerequisiteQueryObject,
      findMany: SkillNodePrerequisite.findManySkillNodePrerequisiteQueryObject,
      count: SkillNodePrerequisite.countSkillNodePrerequisiteQueryObject,
      findUnique: SkillNodePrerequisite.findUniqueSkillNodePrerequisiteQueryObject,
    },
    mutations: {
      createMany: SkillNodePrerequisite.createManySkillNodePrerequisiteMutationObject,
      createOne: SkillNodePrerequisite.createOneSkillNodePrerequisiteMutationObject,
      deleteMany: SkillNodePrerequisite.deleteManySkillNodePrerequisiteMutationObject,
      deleteOne: SkillNodePrerequisite.deleteOneSkillNodePrerequisiteMutationObject,
      updateMany: SkillNodePrerequisite.updateManySkillNodePrerequisiteMutationObject,
      updateOne: SkillNodePrerequisite.updateOneSkillNodePrerequisiteMutationObject,
      upsertOne: SkillNodePrerequisite.upsertOneSkillNodePrerequisiteMutationObject,
    },
  },
  LessonBlocks: {
    Object: LessonBlocks.LessonBlocksObject,
    queries: {
      findFirst: LessonBlocks.findFirstLessonBlocksQueryObject,
      findMany: LessonBlocks.findManyLessonBlocksQueryObject,
      count: LessonBlocks.countLessonBlocksQueryObject,
      findUnique: LessonBlocks.findUniqueLessonBlocksQueryObject,
    },
    mutations: {
      createMany: LessonBlocks.createManyLessonBlocksMutationObject,
      createOne: LessonBlocks.createOneLessonBlocksMutationObject,
      deleteMany: LessonBlocks.deleteManyLessonBlocksMutationObject,
      deleteOne: LessonBlocks.deleteOneLessonBlocksMutationObject,
      updateMany: LessonBlocks.updateManyLessonBlocksMutationObject,
      updateOne: LessonBlocks.updateOneLessonBlocksMutationObject,
      upsertOne: LessonBlocks.upsertOneLessonBlocksMutationObject,
    },
  },
  Quiz: {
    Object: Quiz.QuizObject,
    queries: {
      findFirst: Quiz.findFirstQuizQueryObject,
      findMany: Quiz.findManyQuizQueryObject,
      count: Quiz.countQuizQueryObject,
      findUnique: Quiz.findUniqueQuizQueryObject,
    },
    mutations: {
      createMany: Quiz.createManyQuizMutationObject,
      createOne: Quiz.createOneQuizMutationObject,
      deleteMany: Quiz.deleteManyQuizMutationObject,
      deleteOne: Quiz.deleteOneQuizMutationObject,
      updateMany: Quiz.updateManyQuizMutationObject,
      updateOne: Quiz.updateOneQuizMutationObject,
      upsertOne: Quiz.upsertOneQuizMutationObject,
    },
  },
  QuizQuestion: {
    Object: QuizQuestion.QuizQuestionObject,
    queries: {
      findFirst: QuizQuestion.findFirstQuizQuestionQueryObject,
      findMany: QuizQuestion.findManyQuizQuestionQueryObject,
      count: QuizQuestion.countQuizQuestionQueryObject,
      findUnique: QuizQuestion.findUniqueQuizQuestionQueryObject,
    },
    mutations: {
      createMany: QuizQuestion.createManyQuizQuestionMutationObject,
      createOne: QuizQuestion.createOneQuizQuestionMutationObject,
      deleteMany: QuizQuestion.deleteManyQuizQuestionMutationObject,
      deleteOne: QuizQuestion.deleteOneQuizQuestionMutationObject,
      updateMany: QuizQuestion.updateManyQuizQuestionMutationObject,
      updateOne: QuizQuestion.updateOneQuizQuestionMutationObject,
      upsertOne: QuizQuestion.upsertOneQuizQuestionMutationObject,
    },
  },
  QuizOption: {
    Object: QuizOption.QuizOptionObject,
    queries: {
      findFirst: QuizOption.findFirstQuizOptionQueryObject,
      findMany: QuizOption.findManyQuizOptionQueryObject,
      count: QuizOption.countQuizOptionQueryObject,
      findUnique: QuizOption.findUniqueQuizOptionQueryObject,
    },
    mutations: {
      createMany: QuizOption.createManyQuizOptionMutationObject,
      createOne: QuizOption.createOneQuizOptionMutationObject,
      deleteMany: QuizOption.deleteManyQuizOptionMutationObject,
      deleteOne: QuizOption.deleteOneQuizOptionMutationObject,
      updateMany: QuizOption.updateManyQuizOptionMutationObject,
      updateOne: QuizOption.updateOneQuizOptionMutationObject,
      upsertOne: QuizOption.upsertOneQuizOptionMutationObject,
    },
  },
  QuizAttempt: {
    Object: QuizAttempt.QuizAttemptObject,
    queries: {
      findFirst: QuizAttempt.findFirstQuizAttemptQueryObject,
      findMany: QuizAttempt.findManyQuizAttemptQueryObject,
      count: QuizAttempt.countQuizAttemptQueryObject,
      findUnique: QuizAttempt.findUniqueQuizAttemptQueryObject,
    },
    mutations: {
      createMany: QuizAttempt.createManyQuizAttemptMutationObject,
      createOne: QuizAttempt.createOneQuizAttemptMutationObject,
      deleteMany: QuizAttempt.deleteManyQuizAttemptMutationObject,
      deleteOne: QuizAttempt.deleteOneQuizAttemptMutationObject,
      updateMany: QuizAttempt.updateManyQuizAttemptMutationObject,
      updateOne: QuizAttempt.updateOneQuizAttemptMutationObject,
      upsertOne: QuizAttempt.upsertOneQuizAttemptMutationObject,
    },
  },
  QuizAttemptAnswer: {
    Object: QuizAttemptAnswer.QuizAttemptAnswerObject,
    queries: {
      findFirst: QuizAttemptAnswer.findFirstQuizAttemptAnswerQueryObject,
      findMany: QuizAttemptAnswer.findManyQuizAttemptAnswerQueryObject,
      count: QuizAttemptAnswer.countQuizAttemptAnswerQueryObject,
      findUnique: QuizAttemptAnswer.findUniqueQuizAttemptAnswerQueryObject,
    },
    mutations: {
      createMany: QuizAttemptAnswer.createManyQuizAttemptAnswerMutationObject,
      createOne: QuizAttemptAnswer.createOneQuizAttemptAnswerMutationObject,
      deleteMany: QuizAttemptAnswer.deleteManyQuizAttemptAnswerMutationObject,
      deleteOne: QuizAttemptAnswer.deleteOneQuizAttemptAnswerMutationObject,
      updateMany: QuizAttemptAnswer.updateManyQuizAttemptAnswerMutationObject,
      updateOne: QuizAttemptAnswer.updateOneQuizAttemptAnswerMutationObject,
      upsertOne: QuizAttemptAnswer.upsertOneQuizAttemptAnswerMutationObject,
    },
  },
  UserNodeProgress: {
    Object: UserNodeProgress.UserNodeProgressObject,
    queries: {
      findFirst: UserNodeProgress.findFirstUserNodeProgressQueryObject,
      findMany: UserNodeProgress.findManyUserNodeProgressQueryObject,
      count: UserNodeProgress.countUserNodeProgressQueryObject,
      findUnique: UserNodeProgress.findUniqueUserNodeProgressQueryObject,
    },
    mutations: {
      createMany: UserNodeProgress.createManyUserNodeProgressMutationObject,
      createOne: UserNodeProgress.createOneUserNodeProgressMutationObject,
      deleteMany: UserNodeProgress.deleteManyUserNodeProgressMutationObject,
      deleteOne: UserNodeProgress.deleteOneUserNodeProgressMutationObject,
      updateMany: UserNodeProgress.updateManyUserNodeProgressMutationObject,
      updateOne: UserNodeProgress.updateOneUserNodeProgressMutationObject,
      upsertOne: UserNodeProgress.upsertOneUserNodeProgressMutationObject,
    },
  },
};

const crudEntries = Object.entries(Cruds);

type ResolverType = "Query" | "Mutation";
function generateResolversByType(type: ResolverType, opts?: CrudOptions) {
  return crudEntries
    .filter(([modelName]) => includeModel(modelName, opts))
    .map(([modelName, config]) => {
      const resolverEntries = Object.entries(config[type === "Query" ? "queries" : "mutations"]);

      return resolverEntries.map(([operationName, resolverObjectDefiner]) => {
        const resolverName = operationName + modelName;
        const isntPrismaFieldList = ["count", "deleteMany", "updateMany"];
        const isPrismaField = !isntPrismaFieldList.includes(operationName);

        const getFields = (t: any) => {
          const field = resolverObjectDefiner(t);
          const handledField = opts?.handleResolver
            ? opts.handleResolver({
                field,
                modelName: modelName as Model,
                operationName,
                resolverName,
                t,
                isPrismaField,
                type,
              })
            : field;

          return {
            [resolverName]: isPrismaField
              ? t.prismaField(handledField)
              : t.field(handledField),
          }
        }

        return type === "Query"
          ? builder.queryFields((t) => getFields(t))
          : builder.mutationFields((t) => getFields(t));
      });
    });
}

export function generateAllObjects(opts?: CrudOptions) {
  return crudEntries
    .filter(([md]) => includeModel(md, opts))
    .map(([modelName, { Object }]) => {
      return builder.prismaObject(modelName as Model, Object); // Objects is all imports
    });
}

export function generateAllQueries(opts?: CrudOptions) {
  generateResolversByType("Query", opts);
}

export function generateAllMutations(opts?: CrudOptions) {
  generateResolversByType("Mutation", opts);
}

export function generateAllResolvers(opts?: CrudOptions) {
  generateResolversByType("Mutation", opts);
  generateResolversByType("Query", opts);
}

type CrudOptions = {
  include?: Model[];
  exclude?: Model[];
  /**
   * Caution: This is not type safe
   * Wrap all queries/mutations to override args, run extra code in resolve function (ie: throw errors, logs), apply plugins, etc.
   */
  handleResolver?: (props: {
    modelName: Model;
    field: any;
    operationName: string;
    resolverName: string;
    t: any;
    isPrismaField: boolean;
    type: ResolverType;
  }) => any;
};

const includeModel = (model: string, opts?: CrudOptions): boolean => {
  if (!opts) return true;
  if (opts.include) return opts.include.includes(model as Model);
  if (opts.exclude) return !opts.exclude.includes(model as Model);
  return true;
};

export function generateAllCrud(opts?: CrudOptions) {
  generateAllObjects(opts);
  generateAllQueries(opts);
  generateAllMutations(opts);
}
