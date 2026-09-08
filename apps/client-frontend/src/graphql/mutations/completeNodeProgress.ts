import { gql } from "@apollo/client";

export const COMPLETE_NODE_PROGRESS = gql`
  mutation CompleteNodeProgress($nodeId: ID!) {
    completeNodeProgress(nodeId: $nodeId) {
      id
      status
    }
  }
`;
