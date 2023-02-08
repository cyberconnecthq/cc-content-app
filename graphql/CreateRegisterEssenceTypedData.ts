import { gql } from "@apollo/client";

export const CREATE_REGISTER_ESSENCE_TYPED_DATA = gql`
  mutation CreateRegisterEssenceTypedData(
    $input: CreateRegisterEssenceTypedDataInput!
  ) {
    createRegisterEssenceTypedData(input: $input) {
      typedData {
        id
        sender
        data
        nonce
      }
    }
  }
`;
