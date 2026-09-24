import { gql } from "@apollo/client";

export const UPDATE_COURSE_MUTATION = gql`
  mutation UpdateCourse($id: ID!, $input: UpdateCourseInput!) {
    updateCourse(id: $id, input: $input) {
      id
      title
      status
      description
    }
  }
`;
