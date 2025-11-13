export {
  QuizOptionObject,
  QuizOptionIdFieldObject,
  QuizOptionQuestionIdFieldObject,
  QuizOptionTextFieldObject,
  QuizOptionIsCorrectFieldObject,
  QuizOptionCreatedAtFieldObject,
  QuizOptionUpdatedAtFieldObject,
  QuizOptionQuestionFieldObject
} from './object.base';
export {
  createManyQuizOptionMutation,
  createOneQuizOptionMutation,
  deleteManyQuizOptionMutation,
  deleteOneQuizOptionMutation,
  updateManyQuizOptionMutation,
  updateOneQuizOptionMutation,
  upsertOneQuizOptionMutation,
  createManyQuizOptionMutationObject,
  createOneQuizOptionMutationObject,
  deleteManyQuizOptionMutationObject,
  deleteOneQuizOptionMutationObject,
  updateManyQuizOptionMutationObject,
  updateOneQuizOptionMutationObject,
  upsertOneQuizOptionMutationObject
} from './mutations';
export {
  findFirstQuizOptionQuery,
  findManyQuizOptionQuery,
  countQuizOptionQuery,
  findUniqueQuizOptionQuery,
  findFirstQuizOptionQueryObject,
  findManyQuizOptionQueryObject,
  countQuizOptionQueryObject,
  findUniqueQuizOptionQueryObject
} from './queries';
