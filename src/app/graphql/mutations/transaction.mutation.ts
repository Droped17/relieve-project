import { gql } from "@apollo/client";

export const UPLOAD_IMAGE = gql`
  mutation UploadImage($imageUrl: String!, $transactionId: ID!) {
    uploadImage(imageUrl: $imageUrl, transactionId: $transactionId)
  }
`;