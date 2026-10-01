import { gql } from "@apollo/client";

export const REQUEST_IMAGE_UPLOAD_URL_MUTATION = gql`
  mutation RequestImageUploadUrl(
    $fileName: String!
    $contentType: String!
    $fileSize: Int!
  ) {
    requestImageUploadUrl(
      fileName: $fileName
      contentType: $contentType
      fileSize: $fileSize
    ) {
      uploadUrl
      objectUrl
    }
  }
`;
