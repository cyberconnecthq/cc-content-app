import { gql } from "@apollo/client";

export const CREATE_CREATE_PROFILE_TYPED_DATA = gql`
  mutation createCreateProfileTypedData($to:AddressEVM!, $handle:String!, $avatar:URL!, $metadata:CID!, $operator:AddressEVM!) {
    createCreateProfileTypedData(input:{
      to:$to
      handle:$handle,
    avatar: $avatar,
    metadata: $metadata,
    operator: $operator
    }){
    typedDataID
    }
}
`;



