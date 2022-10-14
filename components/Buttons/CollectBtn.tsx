import { Web3Provider } from "@ethersproject/providers";
import { useMutation } from "@apollo/client";
import { CREATE_COLLECT_ESSENCE_TYPED_DATA, RELAY } from "../../graphql";
import { AuthContext } from "../../context/auth";

function CollectBtn({
    provider,
    namespaceName,
    chainID,
    profileID,
    essenceID
}: {
    provider: Web3Provider | null;
    namespaceName: string;
    chainID: number;
    profileID: number;
    essenceID: number;
}) {
    const [createCollectEssenceTypedData] = useMutation(
        CREATE_COLLECT_ESSENCE_TYPED_DATA
    );
    const [relay] = useMutation(RELAY);

    const handleOnClick = async () => {
        try {
            if (!provider) {
                throw Error("No provier detected.");
            }

            // Check for the chain id
            const network = await provider.getNetwork();
            const chainId = network.chainId;

            if (chainId !== chainID) {
                throw Error("Wrong chain.");
            }

            const signer = provider.getSigner();
            const fromAddress = await signer.getAddress();

            // Create typed data
            const typedDataResult = await createCollectEssenceTypedData({
                variables: {
                    input: {
                        options: {
                            namespaceName: namespaceName,
                            chainID: chainID
                        },
                        collector: fromAddress,
                        profileID: profileID,
                        essenceID: essenceID
                    }
                }
            });
            const typedData =
                typedDataResult.data?.createCollectEssenceTypedData?.typedData;
            const message = typedData.data;
            const typedDataID = typedData.id;

            // Get signature for typed data
            const params = [fromAddress, message];
            const method = "eth_signTypedData_v4";
            const signature = await signer.provider.send(method, params);

            // Relay
            const relayResult = await relay({
                variables: {
                    input: {
                        typedDataID: typedDataID,
                        signature: signature
                    }
                }
            });
            const txHash = relayResult.data?.relay?.relayTransaction?.txHash;
            console.log("~~ Tx hash ~~");
            console.log(txHash);

            /* Display success message */
            alert(`Successfully collected the essence!`);
        } catch (error) {
            /* Display error message */
            alert(error.message);
        }
    };

    return (
        <button className="collect-btn" onClick={handleOnClick}>
            Collect
        </button>
    );
}

export default CollectBtn;
