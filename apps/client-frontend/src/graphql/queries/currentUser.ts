import { gql } from "@apollo/client";

export const SYNC_CURRENT_USER = gql`
  mutation SyncCurrentUser($name: String, $photoUrl: String) {
    syncCurrentUser(name: $name, photoUrl: $photoUrl) {
      id
      email
      name
      photoUrl
      role
      quizAttempts {
        id
        passed
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
      passed: boolean | null;
    }[];
  };
}
