import { gql } from "@apollo/client";

export const CURRENT_USER_STATS_QUERY = gql`
  query CurrentUserStats {
    currentUser {
      id
      xp {
        totalXp
      }
      streak {
        currentDays
      }
    }
  }
`;

export const SYNC_CURRENT_USER = gql`
  mutation SyncCurrentUser($name: String, $photoUrl: String, $timezone: String) {
    syncCurrentUser(name: $name, photoUrl: $photoUrl, timezone: $timezone) {
      id
      email
      name
      photoUrl
      timezone
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
    timezone: string;
    role: string;
    quizAttempts: {
      id: string;
      quizId: string;
    }[];
  };
}
