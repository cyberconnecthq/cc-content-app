import { gql } from "@apollo/client";

export const ACCOUNTS = gql`
  query Accounts($address: AddressEVM!) {
    address(address: $address) {
      wallet {
        profiles {
          totalCount
          edges {
            node {
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
    }
  }
`;
