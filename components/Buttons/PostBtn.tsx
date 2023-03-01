import { useContext } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import { pinJSONToIPFS, getEssenceSVGData } from "../../helpers/functions";
import {
	CREATE_REGISTER_ESSENCE_TYPED_DATA,
	RELAY,
	RELAY_ACTION_STATUS,
} from "../../graphql";
import { IEssenceMetadata, IPostInput } from "../../types";
import { randPhrase } from "@ngneat/falso";
import { AuthContext } from "../../context/auth";
import { ModalContext } from "../../context/modal";
import { v4 as uuidv4 } from "uuid";

function PostBtn({ nftImageURL, content, middleware }: IPostInput) {
	const {
		accessToken,
		primaryProfile,
		indexingPosts,
		setIndexingPosts,
		connectWallet,
		checkNetwork,
	} = useContext(AuthContext);
	const { handleModal } = useContext(ModalContext);
	const [createRegisterEssenceTypedData] = useMutation(
		CREATE_REGISTER_ESSENCE_TYPED_DATA
	);
	const [getRelayActionStatus] = useLazyQuery(RELAY_ACTION_STATUS);
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

			/* Function to render the svg data for the NFT */
			/* (default if the user doesn't pass a image url) */
			const svg_data = getEssenceSVGData();

			/* Construct the metadata object for the Essence NFT */
			const metadata: IEssenceMetadata = {
				metadata_id: uuidv4(),
				version: "1.0.0",
				app_id: "cyberconnect-bnbt",
				lang: "en",
				issue_date: new Date().toISOString(),
				content: content || randPhrase(),
				media: [],
				tags: [],
				image: nftImageURL ? nftImageURL : "",
				image_data: !nftImageURL ? svg_data : "",
				name: `@${primaryProfile?.handle}'s post`,
				description: `@${primaryProfile?.handle}'s post on CyberConnect Content app`,
				animation_url: "",
				external_url: "",
				attributes: [],
			};

			/* Upload metadata to IPFS */
			const ipfsHash = await pinJSONToIPFS(metadata);

			/* Get the signer from the provider */
			const signer = provider.getSigner();

			/* Get the address from the provider */
			const address = await signer.getAddress();

			/* Get the network from the provider */
			const network = await provider.getNetwork();

			/* Create typed data in a readable format */
			const typedDataResult = await createRegisterEssenceTypedData({
				variables: {
					input: {
						/* The profile id under which the Essence is registered */
						profileID: primaryProfile?.profileID,
						/* Name of the Essence */
						name: "Post",
						/* Symbol of the Essence */
						symbol: "POST",
						/* URL for the json object containing data about content and the Essence NFT */
						tokenURI: `https://cyberconnect.mypinata.cloud/ipfs/${ipfsHash}`,
						/* Middleware that allows users to collect the Essence NFT for free */
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
						/* Set if the Essence should be transferable or not */
						transferable: true,
					},
				},
			});

			const typedData =
				typedDataResult.data?.createRegisterEssenceTypedData?.typedData;
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

			const relayActionId = relayResult.data.relay.relayActionId;

			/* Close Post Modal */
			handleModal(null, "");

			const relayingPost = {
				createdBy: {
					handle: primaryProfile?.handle,
					avatar: primaryProfile?.avatar,
					metadata: primaryProfile?.metadata,
					profileID: primaryProfile?.profileID,
				},
				essenceID: 0, // Value will be updated once it's indexed
				tokenURI: `https://cyberconnect.mypinata.cloud/ipfs/${ipfsHash}`,
				isIndexed: false,
				isCollectedByMe: false,
				collectMw: undefined,
				relayActionId: relayActionId,
			};

			localStorage.setItem(
				"relayingPosts",
				JSON.stringify([...indexingPosts, relayingPost])
			);
			/* Set the indexingPosts in the state variables */
			setIndexingPosts([...indexingPosts, relayingPost]);

			/* Display success message */
			handleModal("success", "Post was created!");
		} catch (error) {
			/* Set the indexingPosts in the state variables */
			setIndexingPosts([...indexingPosts]);

			/* Display error message */
			const message = error.message as string;
			handleModal("error", message);
		}
	};

	return (
		<button className="post-btn" type="submit" onClick={handleOnClick}>
			Post
		</button>
	);
}

export default PostBtn;
