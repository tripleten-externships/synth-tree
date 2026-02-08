import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

interface Course {
  id: string;
  title: string;
}

interface GetMyCoursesResponse {
  adminMyCoursesWithContent: Course[];
}

const GET_MY_COURSES = gql`
  query GetMyCourses {
    adminMyCoursesWithContent(limit: 1) {
      id
      title
    }
  }
`;

export function useTestConnection() {
  const { data, loading, error } = useQuery<GetMyCoursesResponse>(GET_MY_COURSES, {
    fetchPolicy: "cache-and-network",
  });

  if (error) {
    console.error("GraphQL connection test failed:", error);
  }

  return {
    connected: !error && !loading,
    loading,
    error,
    courses: data?.adminMyCoursesWithContent ?? [],
  };
}