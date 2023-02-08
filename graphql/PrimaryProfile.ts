import { gql } from "@apollo/client";

export const PRIMARY_PROFILE = gql`
  query PrimaryProfile($address: AddressEVM!) {
    address(address: $address) {
      chainID
      wallet {
        primaryProfile {
          id
          profileID
          handle
          metadata
          avatar
          isPrimary
        }
      }
    }
  }
`;
