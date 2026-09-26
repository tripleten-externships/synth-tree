import { gql } from "@apollo/client";

// Source document for graphql-codegen. The component consumes the generated
// `useUpdateSkillNodeMutation` hook from @synth-tree/api-types, but the
// operation must live under the codegen `documents` globs so it keeps being
// generated. Mirrors the pattern in ./updateCourse.ts.
//
// Used by the builder canvas (SYN-66) to persist a node's posX/posY after a
// drag. The resolver treats omitted input fields as "don't touch", so we send
// only posX/posY. Returning id/posX/posY lets Apollo write the new coordinates
// straight into the cache.
export const UPDATE_SKILL_NODE_MUTATION = gql`
  mutation UpdateSkillNode($id: ID!, $input: UpdateSkillNodeInput!) {
    updateSkillNode(id: $id, input: $input) {
      id
      posX
      posY
    }
  }
`;
