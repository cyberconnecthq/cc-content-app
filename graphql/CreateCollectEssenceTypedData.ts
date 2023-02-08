import { gql } from "@apollo/client";

export const CREATE_COLLECT_ESSENCE_TYPED_DATA = gql`
  mutation CreateCollectEssenceTypedData(
    $input: CreateCollectEssenceTypedDataInput!
  ) {
    createCollectEssenceTypedData(input: $input) {
      typedData {
        id
        sender
        data
        nonce
      }
    }
  }
`;
