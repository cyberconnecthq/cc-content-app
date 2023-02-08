import { gql } from "@apollo/client";

export const PROFILES_BY_IDS = gql`
  query profilesByIDs($profileIDs: [ProfileID!]!, $myAddress: AddressEVM!) {
    profilesByIDs(profileIDs: $profileIDs) {
      owner {
        address
      }
      isSubscribedByMe(me: $myAddress)
      handle
      profileID
      metadata
      avatar
    }
  }
`;
