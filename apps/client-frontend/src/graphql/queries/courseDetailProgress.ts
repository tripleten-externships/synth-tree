import { gql } from "@apollo/client";

// Server-side course aggregate (SYN-38). Used by the course page and by the
// Home course grid's per-card progress bars.
export const COURSE_DETAIL_PROGRESS_QUERY = gql`
  query CourseDetailProgress($courseId: ID!) {
    courseProgress(courseId: $courseId) {
      courseId
      totalNodes
      inProgressNodes
      completedNodes
      completionPercentage
      xpEarned
    }
  }
`;
