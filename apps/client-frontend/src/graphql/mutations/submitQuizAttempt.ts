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
          type
          canonicalAnswer
          options {
            id
            text
            isCorrect
          }
        }
      }
    }
  }
`;
