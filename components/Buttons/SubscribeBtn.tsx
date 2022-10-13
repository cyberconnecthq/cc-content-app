import { useContext } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_SUBSCRIBE_TYPED_DATA, RELAY } from "../../graphql";
import { AuthContext } from "../../context/auth";

function SubscribeBtn({ profileID }: { profileID: number; }) {
    const { provider, address, accessToken, checkNetwork } = useContext(AuthContext);
    const [createSubscribeTypedData] = useMutation(CREATE_SUBSCRIBE_TYPED_DATA);
    const [relay] = useMutation(RELAY);

    const handleOnClick = async () => {
        try {
            /* Check if the user connected with wallet */
            if (!(provider && address)) {
                throw Error("Connect with MetaMask.");
            }

            /* Check if the user logged in */
            if (!(accessToken)) {
                throw Error("You need to log in first.");
            }

            /* Check if the network is the correct one */
            await checkNetwork(provider);

            /* Get the signer from the provider */
            const signer = provider.getSigner();

            /* Get the network from the provider */
            const network = await provider.getNetwork();

            /* Get the chain id from the network */
            const chainID = network.chainId;

            /* Create typed data in a readable format */
            const typedDataResult = await createSubscribeTypedData({
                variables: {
                    input: {
                        options: {
                            chainID: chainID
                        },
                        profileIDs: [profileID]
                    }
                }
            });
            const typedData =
                typedDataResult.data?.createSubscribeTypedData?.typedData;
            const message = typedData.data;
            const typedDataID = typedData.id;

            /* Get the signature for the message signed with the wallet */
            const fromAddress = await signer.getAddress();
            const params = [fromAddress, message];
            const method = "eth_signTypedData_v4";
            const signature = await signer.provider.send(method, params);

            /* Call the relay to broadcast the transaction */
            const relayResult = await relay({
                variables: {
                    input: {
                        typedDataID: typedDataID,
                        signature: signature
                    }
                }
            });
            const txHash = relayResult.data?.relay?.relayTransaction?.txHash;

            /* Log the transation hash */
            console.log("~~ Tx hash ~~");
            console.log(txHash);

            /* Display success message */
            alert(`Successfully subscribed to profile!`);
        } catch (error) {
            /* Display error message */
            alert(error.message);
        }
    };

    return (
        <button
            className="subscribe-btn"
            onClick={handleOnClick}
        >
            Subscribe
        </button>
    );
}

export default SubscribeBtn;
