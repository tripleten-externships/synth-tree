import { gql } from "@apollo/client";

// Source document for graphql-codegen. The lesson editor consumes the
// generated `useAdminLessonQuizQuery` hook from @synth-tree/api-types, but the
// operation has to live under the codegen `documents` globs to keep being
// generated.
//
// isCorrect, canonicalAnswer and explanation are answer-key fields that the API
// only reveals to admins, which is who the editor runs as.
export const ADMIN_LESSON_QUIZ_QUERY = gql`
  query AdminLessonQuiz($nodeId: ID!) {
    adminSkillNode(id: $nodeId) {
      id
      quiz {
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
  }
`;
