import { gql } from "@apollo/client";

export const RELAY = gql`
  mutation Relay($input: RelayInput!) {
    relay(input: $input) {
      relayActionId
      # relayTransaction {
      #     id
      #     txHash
      #     typedData {
      #         id
      #         chainID
      #         sender
      #         data
      #         nonce
      #     }
      # }
    }
  }
`;
