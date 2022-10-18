import { useContext } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_SET_SUBSCRIBE_DATA_TYPED_DATA, RELAY } from "../../graphql";
import { AuthContext } from "../../context/auth";
import { getSubscriberSVGData, pinJSONToIPFS } from "../../helpers/functions";

function SetSubscribeBtn({ option }: { option: string; }) {
    const { provider, address, accessToken, profileID, handle, checkNetwork } = useContext(AuthContext);
    const [createSetSubscribeDataTypedData] = useMutation(CREATE_SET_SUBSCRIBE_DATA_TYPED_DATA);
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

            /* Construct the metadata object for the Subscribe NFT */
            const metadata = {
                image_data: getSubscriberSVGData(),
                name: `@${handle}'s subscriber`,
                description: `@${handle}'s subscriber on CyberConnect Content app`,
            };

            /* Upload metadata to IPFS */
            const ipfsHash = await pinJSONToIPFS(metadata);

            let middelware;
            if (option === "free") {
                middelware = {
                    subscribeFree: true
                }
            } else {
                middelware = {
                    subscribePaid: {
                        /* Address that will receive the amount */
                        recipient: account,
                        /* Amount that needs to be paid to subscribe */
                        amount: 1,
                        /* The currency for the  amount. Chainlink token contract on Goerli */
                        currency: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
                        /* If it require the subscriber to hold a NFT */
                        nftRequired: false,
                        /* The contract of the NFT that the subscriber needs to hold */
                        nftAddress: "0x0000000000000000000000000000000000000000"
                    }
                }
            }

            /* Create typed data in a readable format */
            const typedDataResult = await createSetSubscribeDataTypedData({
                variables: {
                    input: {
                        options: {
                            /* The chain id on which the Subscribe NFT will be minted on */
                            chainID: chainID
                        },
                        /* The user's profile id for which the rules are enabled */
                        profileId: profileID,
                        /* URL for the json object containing data about the Subscribe NFT */
                        tokenURI: `https://cyberconnect.mypinata.cloud/ipfs/${ipfsHash}`,
                        middleware: middelware
                    }
                }
            });
            const typedData =
                typedDataResult.data?.createSetSubscribeDataTypedData?.typedData;
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
            alert(`Successfully set the middleware for subscribe!`);
        } catch (error) {
            /* Display error message */
            alert(error.message);
        }
    };

    return (
        <button
            className="set-subscribe-btn"
            onClick={handleOnClick}
        >
            Set Subscribe
        </button>
    );
}

export default SetSubscribeBtn;
