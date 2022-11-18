import { gql } from "@apollo/client";

export const PRIMARY_PROFILE_ESSENCES = gql`
  query PrimaryProfileEssences(
    $address: AddressEVM!
    $chainID: ChainID!
    $myAddress: AddressEVM!
  ) {
    address(address: $address, chainID: $chainID) {
      chainID
      wallet {
        primaryProfile {
          essences(first: 100) {
            totalCount
            edges {
              node {
                essenceID
                tokenURI
                createdBy {
                  handle
                  metadata
                  avatar
                  profileID
                  owner {
                    address
                    primaryProfile {
                      isSubscribedByMe(me: $myAddress)
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
