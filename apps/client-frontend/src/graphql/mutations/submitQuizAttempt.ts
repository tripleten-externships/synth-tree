import { gql } from "@apollo/client";

export const SUBMIT_QUIZ_ATTEMPT = gql`
  mutation SubmitQuizAttempt($quizId: ID!, $answers: [QuizAnswerInput!]!) {
    submitQuizAttempt(quizId: $quizId, answers: $answers) {
      id
      passed
      answers {
        id
        questionId
        answer
        isCorrect
        question {
          id
          prompt
          explanation
          type
          canonicalAnswer
          options(orderBy: [{ order: asc }]) {
            id
            text
            isCorrect
          }
        }
      }
    }
  }
`;
