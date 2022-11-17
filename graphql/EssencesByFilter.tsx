import { gql } from "@apollo/client";

export const ESSENCES_BY_FILTER = gql`
  query essencesByFilter($appID: String) {
    essenceByFilter(appID: $appID) {
      essenceID
      tokenURI
      createdBy {
        avatar
        handle
        profileID
        metadata
      }
    }
  }
`;
