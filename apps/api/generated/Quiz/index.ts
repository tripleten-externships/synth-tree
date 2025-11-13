export {
  QuizObject,
  QuizIdFieldObject,
  QuizNodeIdFieldObject,
  QuizTitleFieldObject,
  QuizRequiredFieldObject,
  QuizCreatedAtFieldObject,
  QuizUpdatedAtFieldObject,
  QuizDeletedAtFieldObject,
  QuizNodeFieldObject,
  QuizQuestionsFieldObject,
  QuizAttemptsFieldObject
} from './object.base';
export {
  createManyQuizMutation,
  createOneQuizMutation,
  deleteManyQuizMutation,
  deleteOneQuizMutation,
  updateManyQuizMutation,
  updateOneQuizMutation,
  upsertOneQuizMutation,
  createManyQuizMutationObject,
  createOneQuizMutationObject,
  deleteManyQuizMutationObject,
  deleteOneQuizMutationObject,
  updateManyQuizMutationObject,
  updateOneQuizMutationObject,
  upsertOneQuizMutationObject
} from './mutations';
export {
  findFirstQuizQuery,
  findManyQuizQuery,
  countQuizQuery,
  findUniqueQuizQuery,
  findFirstQuizQueryObject,
  findManyQuizQueryObject,
  countQuizQueryObject,
  findUniqueQuizQueryObject
} from './queries';
