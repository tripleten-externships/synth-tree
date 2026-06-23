import { gql } from "@apollo/client";

export const START_NODE_PROGRESS = gql`
  mutation StartNodeProgress($nodeId: ID!) {
    startNodeProgress(nodeId: $nodeId) {
      id
      status
    }
  }
`;
