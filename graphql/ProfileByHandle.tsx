import { gql } from "@apollo/client";

export const PROFILE_BY_HANDLE = gql`
  query profileByHandle($chainID: ChainID!, $handle: String!) {
    profileByHandle(chainID: $chainID, handle: $handle) {
      handle
      profileID
      metadata
      avatar
    }
  }
`;
