import { gql } from "@apollo/client";

export const MY_PROGRESS_QUERY = gql`
  query MyProgress {
    myProgress {
      id
      status
      updatedAt
      node {
        id
        title
        tree {
          id
          title
          course {
            id
            title
          }
        }
      }
    }
  }
`;
