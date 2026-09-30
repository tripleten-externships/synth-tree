import { gql } from "@apollo/client";

export const PUBLIC_COURSE_QUERY = gql`
  query PublicCourse($id: ID!) {
    publicCourse(id: $id) {
      id
      title
      description
      status
      trees {
        id
        title
        description
        nodes {
          id
          title
          step
          orderInStep
          quiz {
            id
            title
            required
            # Sorted explicitly: without an orderBy the rows come back in
            # whatever order Postgres stores them, so an edited question or
            # answer could move once an author changes it.
            questions(orderBy: [{ order: asc }]) {
              id
              prompt
              type
              options(orderBy: [{ order: asc }]) {
                id
                text
              }
            }
          }
        }
      }
    }
  }
`;

export const PUBLIC_GET_ALL_COURSES_QUERY = gql`
  query PublicGetAllCourses {
    publicGetAllCourses {
      id
      title
      description
      status
      trees {
        id
        title
        description
      }
    }
  }
`;
