import { gql } from "@apollo/client";

export const ACCOUNTS = gql`
    query Accounts($address: AddressEVM!, $chainID: ChainID!) {
        address(address: $address, chainID: $chainID) {
            chainID
            wallet {
                profiles {
                    totalCount
                    edges {
                        node {
                            id
                            profileID
                            handle
                            metadata
                            avatar
                            isPrimary
                        }
                    }
                }
            }
        }
    }
`;
