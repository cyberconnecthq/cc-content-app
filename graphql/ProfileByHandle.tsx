import { gql } from "@apollo/client";

export const PROFILE_BY_HANDLE = gql`
  query profileByHandle( $handle: String!) {
    profileByHandle( handle: $handle) {
      handle
      profileID
      metadata
      avatar
    }
  }
`;
