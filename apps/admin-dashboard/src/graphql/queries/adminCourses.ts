import { gql } from "@apollo/client";

// Source document for graphql-codegen. The component consumes the
// generated `useAdminGetAllCoursesQuery` hook + `AdminGetAllCoursesDocument`
// from @synth-tree/api-types, but the operation must live under the codegen
// `documents` globs so it keeps being generated.
export const ADMIN_GET_ALL_COURSES_QUERY = gql`
  query AdminGetAllCourses {
    adminGetAllCourses {
      id
      title
      status
      updatedAt
      author {
        id
        name
      }
    }
  }
`;
