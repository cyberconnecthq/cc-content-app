import { useContext } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_SET_ESSENCE_DATA_TYPED_DATA, RELAY } from "../../graphql";
import { AuthContext } from "../../context/auth";

function SetEssenceBtn({ option }: { option: string; }) {
    const { provider, address, accessToken, profileID, checkNetwork } = useContext(AuthContext);
    const [createSetEssenceDataTypedData] = useMutation(CREATE_SET_ESSENCE_DATA_TYPED_DATA);
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

            /* Check if the has signed up */
            if (!profileID) {
                throw Error("Youn need to Sign up.");
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

            /* Collect user input */
            const essenceID = prompt("Enter the essence ID") || 1;

            /* Create typed data in a readable format */
            let middelware;
            if (option === "free") {
                middelware = {
                    collectFree: true
                }
            } else {
                middelware = {
                    collectPaid: {
                        /* Address that will receive the amount */
                        recipient: account,
                        /* Number of times the Essence can be collected */
                        totalSupply: 1000,
                        /* Amount that needs to be paid to collect essence */
                        amount: 1,
                        /* The currency for the  amount. Chainlink token contract on Goerli */
                        currency: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
                        /* If it require that the collector is also subscribed */
                        subscribeRequired: false
                    }
                }
            }
            const typedDataResult = await createSetEssenceDataTypedData({
                variables: {
                    input: {
                        options: {
                            /* The chain id on which the Essence NFT will be minted on */
                            chainID: chainID
                        },
                        /* The id of the essence the middleware is set for */
                        essenceId: Number(essenceID),
                        /* The id of the profile that created the essence */
                        profileId: profileID,
                        /* URL for the json object containing data about content and the Essence NFT */
                        tokenURI: `https://cyberconnect.mypinata.cloud/ipfs/QmWeusbdbY2SEry1GEiJpmzd3Frp29wMNS3ZbNN21hLbVw`,
                        /* The middleware that will be set for the essence */
                        middleware: middelware
                    }
                }
            });
            const typedData =
                typedDataResult.data?.createSetEssenceDataTypedData?.typedData;
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
            alert(`Successfully set the middleware for essence!`);
        } catch (error) {
            /* Display error message */
            alert(error.message);
        }
    };

    return (
        <button
            className="set-essence-btn"
            onClick={handleOnClick}
        >
            Set Essence
        </button>
    );
}

export default SetEssenceBtn;
