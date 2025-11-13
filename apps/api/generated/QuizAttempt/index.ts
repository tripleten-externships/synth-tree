export {
  QuizAttemptObject,
  QuizAttemptIdFieldObject,
  QuizAttemptQuizIdFieldObject,
  QuizAttemptUserIdFieldObject,
  QuizAttemptPassedFieldObject,
  QuizAttemptTakenAtFieldObject,
  QuizAttemptQuizFieldObject,
  QuizAttemptUserFieldObject,
  QuizAttemptAnswersFieldObject
} from './object.base';
export {
  createManyQuizAttemptMutation,
  createOneQuizAttemptMutation,
  deleteManyQuizAttemptMutation,
  deleteOneQuizAttemptMutation,
  updateManyQuizAttemptMutation,
  updateOneQuizAttemptMutation,
  upsertOneQuizAttemptMutation,
  createManyQuizAttemptMutationObject,
  createOneQuizAttemptMutationObject,
  deleteManyQuizAttemptMutationObject,
  deleteOneQuizAttemptMutationObject,
  updateManyQuizAttemptMutationObject,
  updateOneQuizAttemptMutationObject,
  upsertOneQuizAttemptMutationObject
} from './mutations';
export {
  findFirstQuizAttemptQuery,
  findManyQuizAttemptQuery,
  countQuizAttemptQuery,
  findUniqueQuizAttemptQuery,
  findFirstQuizAttemptQueryObject,
  findManyQuizAttemptQueryObject,
  countQuizAttemptQueryObject,
  findUniqueQuizAttemptQueryObject
} from './queries';
