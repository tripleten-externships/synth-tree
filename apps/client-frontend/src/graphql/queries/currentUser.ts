import { gql } from "@apollo/client";

export const SYNC_CURRENT_USER = gql`
  mutation SyncCurrentUser($name: String, $photoUrl: String) {
    syncCurrentUser(name: $name, photoUrl: $photoUrl) {
      id
      email
      name
      photoUrl
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
    role: string;
    stats?: {
      courses: number;
      nodes: number;
      quizzes: number;
    };
  };
}
