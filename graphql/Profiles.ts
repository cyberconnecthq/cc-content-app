import { gql } from "@apollo/client";

export const PROFILES = gql`
    query Profiles {
        profiles(first: 10) {
            edges {
                node {
                    handle
                    profileID
                }
            }
        }
    }
`;
