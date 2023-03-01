import { useContext } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_SET_ESSENCE_DATA_TYPED_DATA, RELAY } from "../../graphql";
import { AuthContext } from "../../context/auth";
import { ModalContext } from "../../context/modal";

function SetEssenceBtn({
	essence,
	middleware,
}: {
	essence: {
		essenceID: number;
		tokenURI: string;
	};
	middleware: string;
}) {
	const { accessToken, primaryProfile, connectWallet, checkNetwork } =
		useContext(AuthContext);
	const { handleModal } = useContext(ModalContext);
	const [createSetEssenceDataTypedData] = useMutation(
		CREATE_SET_ESSENCE_DATA_TYPED_DATA
	);
	const [relay] = useMutation(RELAY);

	const handleOnClick = async () => {
		try {
			/* Check if the user logged in */
			if (!accessToken) {
				throw Error("You need to Sign in.");
			}

			/* Check if the has signed up */
			if (!primaryProfile?.profileID) {
				throw Error("Youn need to mint a profile.");
			}

			/* Connect wallet and get provider */
			const provider = await connectWallet();

			/* Check if the network is the correct one */
			await checkNetwork(provider);

			/* Get the signer from the provider */
			const signer = provider.getSigner();

			/* Get the address from the provider */
			const address = await signer.getAddress();

			/* Get the network from the provider */
			const network = await provider.getNetwork();

			/* Create typed data in a readable format */
			const typedDataResult = await createSetEssenceDataTypedData({
				variables: {
					input: {
						/* The id of the essence the middleware is set for */
						essenceId: essence.essenceID,
						/* The id of the profile that created the essence */
						profileId: primaryProfile?.profileID,
						/* URL for the json object containing data about content and the Essence NFT */
						tokenURI: essence.tokenURI,
						/* The middleware that will be set for the essence */
						middleware:
							middleware === "free"
								? { collectFree: true }
								: {
									collectPaid: {
										/* Address that will receive the amount */
										recipient: address,
										/* Number of times the Essence can be collected */
										totalSupply: "1000",
										/* Amount that needs to be paid to collect essence */
										amount: "1000000000000000000",
										/* The currency for the  amount. Chainlink token contract on Goerli */
										currency: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
										/* If it require that the collector is also subscribed */
										subscribeRequired: false,
									},
								},
					},
				},
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
						signature: signature,
					},
				},
			});
			const txHash = relayResult.data?.relay?.relayTransaction?.txHash;

			/* Log the transation hash */
			console.log("~~ Tx hash ~~");
			console.log(txHash);

			/* Display success message */
			handleModal("success", "Essence middleware was set!");
		} catch (error) {
			console.log(error);
			/* Display error message */
			const message = error.message as string;
			handleModal("error", message);
		}
	};

	return (
		<button
			className="set-essence-btn"
			onClick={handleOnClick}
			disabled={!Boolean(essence.essenceID)}
		>
			Set Essence
		</button>
	);
}

export default SetEssenceBtn;
