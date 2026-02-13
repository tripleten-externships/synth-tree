import { gql } from "@apollo/client";

export const LESSON_BLOCKS_QUERY = gql`
  query LessonBlocks($nodeId: ID!) {
    lessonBlocks(nodeId: $nodeId) {
      id
      type
      content
      caption
      order
    }
  }
`;
