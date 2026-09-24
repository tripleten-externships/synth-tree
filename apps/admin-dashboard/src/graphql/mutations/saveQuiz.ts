import { gql } from "@apollo/client";

// Source documents for graphql-codegen; the lesson editor uses the generated
// `useSaveQuizMutation` / `useDeleteQuizMutation` hooks.

export const SAVE_QUIZ_MUTATION = gql`
  mutation SaveQuiz($nodeId: ID!, $input: SaveQuizInput!) {
    saveQuiz(nodeId: $nodeId, input: $input) {
      id
      title
      required
      questions(orderBy: [{ order: asc }]) {
        id
        type
        prompt
        explanation
        canonicalAnswer
        options(orderBy: [{ order: asc }]) {
          id
          text
          isCorrect
        }
      }
    }
  }
`;

export const DELETE_QUIZ_MUTATION = gql`
  mutation DeleteQuiz($id: ID!) {
    deleteQuiz(id: $id) {
      id
    }
  }
`;
