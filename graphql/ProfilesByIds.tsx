import { gql } from "@apollo/client";

export const PROFILES_BY_IDS = gql`
    query profilesByIDs($chainID: ChainID!, $profileIDs: [ProfileID!]!) {
        profilesByIDs(chainID: $chainID, profileIDs: $profileIDs) {
            isSubscribedByMe
            handle
            profileID
            metadata
            avatar
            isSubscribedByMe
        }
    }
`;
