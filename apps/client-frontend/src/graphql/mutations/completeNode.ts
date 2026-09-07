import { gql } from "@apollo/client";

export const COMPLETE_NODE = gql `
  mutation CompleteNode($nodeId: ID!) {
    completeNode(nodeId: $nodeId) {
      id
      status
    }
  }
`;
