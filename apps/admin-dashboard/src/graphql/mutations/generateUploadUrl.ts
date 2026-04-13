import { gql } from "@apollo/client";

export const GENERATE_UPLOAD_URL = gql`
  mutation GenerateUploadUrl(
    $fileName: String!
    $contentType: String!
    $fileSize: Int!
  ) {
    generateUploadUrl(
      fileName: $fileName
      contentType: $contentType
      fileSize: $fileSize
    ) {
      uploadUrl
      fileKey
      publicUrl
    }
  }
`;

