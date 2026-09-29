import { gql } from "@apollo/client";

export const COURSE_DETAIL_PROGRESS_QUERY = gql`
  query CourseDetailProgress($courseId: ID!) {
    courseProgress(courseId: $courseId) {
      courseId
      totalNodes
      completedNodes
      completionPercentage
      xpEarned
    }
  }
`;
