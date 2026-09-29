import { gql } from "@apollo/client";

export const SYNC_CURRENT_USER = gql`
  mutation SyncCurrentUser($name: String, $photoUrl: String, $timezone: String) {
    syncCurrentUser(name: $name, photoUrl: $photoUrl, timezone: $timezone) {
      id
      email
      name
      photoUrl
      timezone
      role
      # stats will work once backend supports it
      # stats {
      #   courses
      #   nodes
      #   quizzes
      # }
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
    stats?: {
      courses: number;
      nodes: number;
      quizzes: number;
    };
  };
}
