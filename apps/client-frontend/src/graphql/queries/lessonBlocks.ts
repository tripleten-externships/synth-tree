import { gql } from "@apollo/client";

export const LESSON_BLOCKS_QUERY = gql`
  query LessonBlocksByNode($nodeId: ID!) {
    lessonBlocksByNode(nodeId: $nodeId) {
      id
      type
      html
      url
      caption
      order
    }
  }
`;
