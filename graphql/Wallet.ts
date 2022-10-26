import { gql } from "@apollo/client";

export const WALLET = gql`
    query Wallet($address: AddressEVM!, $chainID: ChainID!) {
        wallet(address: $address, chainID: $chainID) {
            id
            chainID
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
                        essences {
                            totalCount
                            edges {
                                node {
                                    essenceID
                                    tokenURI
                                    createdBy {
                                        handle
                                        metadata
                                        avatar
                                    }
                                }
                            }
                        }
                    }
                    cursor
                }
            }
        }
    }
`;
