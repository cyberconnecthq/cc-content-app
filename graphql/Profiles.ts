import { gql } from "@apollo/client";

export const PROFILES = gql`
    query Profiles {
        profiles(first: 6, chainID: 5) {
            edges {
                node {
                    handle
                    profileID
                    metadata
                    avatar
                }
            }
        }
    }
`;
