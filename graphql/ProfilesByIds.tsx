import { gql } from "@apollo/client";

export const PROFILES_BY_IDS = gql`
  query profilesByIDs(
    $chainID: ChainID!
    $profileIDs: [ProfileID!]!
    $myAddress: AddressEVM!
  ) {
    profilesByIDs(chainID: $chainID, profileIDs: $profileIDs) {
      owner {
        address
        primaryProfile {
          isSubscribedByMe(me: $myAddress)
        }
      }
      handle
      profileID
      metadata
      avatar
    }
  }
`;
