import { gql } from "@apollo/client";

export const PRIMARY_PROFILE = gql`
    query PrimaryProfile($address: AddressEVM!, $chainID: ChainID!) {
        address(address: $address, chainID: $chainID) {
            chainID
            wallet {
                primaryProfile {
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
`;
