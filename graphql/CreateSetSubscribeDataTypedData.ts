import { gql } from "@apollo/client";

export const CREATE_SET_SUBSCRIBE_DATA_TYPED_DATA = gql`
  mutation CreateSetSubscribeDataTypedData(
    $input: CreateSetSubscribeDataTypedDataInput!
  ) {
    createSetSubscribeDataTypedData(input: $input) {
      typedData {
        id
        sender
        data
        nonce
      }
    }
  }
`;
