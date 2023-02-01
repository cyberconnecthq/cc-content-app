import { gql } from "@apollo/client";

export const ESSENCES_BY_FILTER = gql`
  query essencesByFilter($appID: String, $me: AddressEVM!) {
    essenceByFilter(appID: $appID) {
      essenceID
      tokenURI
      createdBy {
        avatar
        handle
        profileID
        metadata
      }
      collectMw {
        contractAddress
        type
      }
      isCollectedByMe(me: $me)
    }
  }
`;
