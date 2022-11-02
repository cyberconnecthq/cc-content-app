import { gql } from "@apollo/client";

export const ADDRESS = gql`
    query Address($address: AddressEVM!, $chainID: ChainID!) {
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
                                            profileID
                                        }
                                    }
                                }
                            }
                        }
                        cursor
                    }
                }
                primaryProfile {
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
            }
        }
    }
`;
