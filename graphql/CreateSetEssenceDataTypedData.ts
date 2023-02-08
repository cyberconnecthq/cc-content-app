import { gql } from "@apollo/client";

export const CREATE_SET_ESSENCE_DATA_TYPED_DATA = gql`
  mutation CreateSetEssenceDataTypedData(
    $input: CreateSetEssenceDataTypedDataInput!
  ) {
    createSetEssenceDataTypedData(input: $input) {
      typedData {
        id
        sender
        data
        nonce
      }
    }
  }
`;
