import { gql } from "@apollo/client";

export const USER_INFO_BY_ADDRESS = gql`
    query UserInfoByAddress($address: AddressEVM!) {
        address(address: $address) {
            goerliWallet {
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
                        }
                        cursor
                    }
                }
            }
        }
    }
`;
