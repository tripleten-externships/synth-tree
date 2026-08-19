import { gql } from "@apollo/client";

// answers: a list of JSON strings, one per question, each of the shape
//   { "questionId": "...", "answer": { "selectedOptionIds": ["..."] } }   // choice
//   { "questionId": "...", "answer": { "text": "..." } }                  // open
// The server creates the attempt and grades it (see gradeQuizAttempt / SYN-54).
export const SUBMIT_QUIZ_ATTEMPT = gql`
  mutation SubmitQuizAttempt($quizId: ID!, $answers: [String!]!) {
    submitQuizAttempt(quizId: $quizId, answers: $answers) {
      id
      passed
    }
  }
`;
