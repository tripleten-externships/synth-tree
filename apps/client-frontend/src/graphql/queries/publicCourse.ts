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
            questions {
              id
              prompt
              type
              options {
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

