import { gql } from "@apollo/client";

export const BROWSE_COURSES_QUERY = gql`
  query BrowseCourses(
    $search: String
    $category: String
    $page: Int
    $limit: Int
  ) {
    browseCourses(
      search: $search
      category: $category
      page: $page
      limit: $limit
    ) {
      id
      title
      description
      status
      createdAt
      updatedAt
      author {
        id
        name
        email
      }
    }
  }
`;

export const BROWSE_COURSE_QUERY = gql`
  query BrowseCourse($id: ID!) {
    browseCourse(id: $id) {
      id
      title
      description
      status
      createdAt
      updatedAt
      author {
        id
        name
        email
      }
      trees {
        id
        title
        description
      }
    }
  }
`;
