import { gql } from "@apollo/client";

export const SYNC_CURRENT_USER = gql`
  mutation SyncCurrentUser($name: String, $photoUrl: String) {
    syncCurrentUser(name: $name, photoUrl: $photoUrl) {
      id
      email
      name
      photoUrl
      role
      # One passed attempt per quiz, so retakes aren't double-counted.
      quizAttempts(where: { passed: { equals: true } }, distinct: [quizId]) {
        id
        quizId
      }
    }
  }
`;

export interface SyncCurrentUserResponse {
  syncCurrentUser: {
    id: string;
    email: string;
    name: string;
    photoUrl: string;
    role: string;
    quizAttempts: {
      id: string;
      quizId: string;
    }[];
  };
}
