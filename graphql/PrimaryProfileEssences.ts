import { gql } from "@apollo/client";

export const PRIMARY_PROFILE_ESSENCES = gql`
  query PrimaryProfileEssences($address: AddressEVM!) {
    address(address: $address) {
      wallet {
        primaryProfile {
          essences {
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
                }
                isCollectedByMe(me: $address)
              }
            }
          }
        }
      }
    }
  }
`;
