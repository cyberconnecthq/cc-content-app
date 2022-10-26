import { useContext } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_COLLECT_ESSENCE_TYPED_DATA, RELAY } from "../../graphql";
import { AuthContext } from "../../context/auth";
import { ModalContext } from "../../context/modal";

function CollectBtn({ profileID, essenceID }: { profileID: number, essenceID: number; }) {
    const { provider, address, accessToken, checkNetwork } = useContext(AuthContext);
    const { handleModal } = useContext(ModalContext);
    const [createCollectEssenceTypedData] = useMutation(
        CREATE_COLLECT_ESSENCE_TYPED_DATA
    );
    const [relay] = useMutation(RELAY);

    const handleOnClick = async () => {
        try {
            /* Check if the user connected with wallet */
            if (!(provider && address)) {
                throw Error("You need to Connect wallet.");
            }

            /* Check if the user logged in */
            if (!(accessToken)) {
                throw Error("You need to Sign in.");
            }

            /* Check if the network is the correct one */
            await checkNetwork(provider);

            /* Get the signer from the provider */
            const signer = provider.getSigner();

            /* Get the address from the provider */
            const account = await signer.getAddress();

            /* Get the network from the provider */
            const network = await provider.getNetwork();

            /* Get the chain id from the network */
            const chainID = network.chainId;

            /* Create typed data in a readable format */
            const typedDataResult = await createCollectEssenceTypedData({
                variables: {
                    input: {
                        options: {
                            chainID: chainID
                        },
                        collector: account,
                        profileID: profileID,
                        essenceID: essenceID
                    }
                }
            });

            const typedData =
                typedDataResult.data?.createCollectEssenceTypedData?.typedData;
            const message = typedData.data;
            const typedDataID = typedData.id;

            /* Get the signature for the message signed with the wallet */
            const params = [account, message];
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
            handleModal("success", "Post was collected!");
        } catch (error) {
            /* Display error message */
            const message = error.message as string;
            handleModal("error", message);
        }
    };

    return (
        <button
            className="collect-btn"
            onClick={handleOnClick}
        >
            Collect
        </button>
    );
}

export default CollectBtn;
