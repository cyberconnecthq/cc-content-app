import { useContext, useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_COLLECT_ESSENCE_TYPED_DATA, RELAY } from "../../graphql";
import { AuthContext } from "../../context/auth";
import { ModalContext } from "../../context/modal";
import { ethers, BigNumber } from "ethers";
import ERC20ABI from "../../abi/ERC20.json";

function CollectBtn({
	profileID,
	essenceID,
	isCollectedByMe,
	collectMw,
}: {
	profileID: number;
	essenceID: number;
	isCollectedByMe: boolean;
	collectMw: Record<string, any>;
}) {
	const { accessToken, connectWallet, checkNetwork } = useContext(AuthContext);
	const { handleModal } = useContext(ModalContext);
	const [createCollectEssenceTypedData] = useMutation(
		CREATE_COLLECT_ESSENCE_TYPED_DATA
	);
	const [relay] = useMutation(RELAY);
	const [stateCollect, setStateCollect] = useState(isCollectedByMe);

	const handleOnClick = async () => {
		try {
			/* Check if the user logged in */
			if (!accessToken) {
				throw Error("You need to Sign in.");
			}

			/* Connect wallet and get provider */
			const provider = await connectWallet();

			/* Check if the network is the correct one */
			await checkNetwork(provider);

			/* Get the signer from the provider */
			const signer = provider.getSigner();

			// const ERC20Contract = new ethers.Contract(
			// 	"0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
			// 	ERC20ABI,
			// 	signer
			// );

			/* Get the address from the provider */
			const address = await signer.getAddress();

			// if (collectMw) {
			//   console.log("collectMw", collectMw.contractAddress);
			//   const allowance = await ERC20Contract.allowance(
			//     "0x370CA01D7314e3EEa59d57E343323bB7e9De24C6",
			//     collectMw.contractAddress
			//   );
			//   console.log("allowance", allowance.toString());
			//   let needApprove = allowance.gte(BigNumber.from("10000000000000000000"));
			//   console.log("needApprove", needApprove);
			// }
			// return;
			//
			// await ERC20Contract.approve(
			//   "0x415648c28adb31629418498264f55d54e4c324db",
			//   "10000000000000000000"
			// );
			//
			/* Get the network from the provider */
			const network = await provider.getNetwork();

			/* Create typed data in a readable format */
			const typedDataResult = await createCollectEssenceTypedData({
				variables: {
					input: {
						collector: address,
						profileID: profileID,
						essenceID: essenceID,
					},
				},
			});

			const typedData =
				typedDataResult.data?.createCollectEssenceTypedData?.typedData;
			const message = typedData.data;
			const typedDataID = typedData.id;

			/* Get the signature for the message signed with the wallet */
			const params = [address, message];
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

			/* Set the state to true */
			setStateCollect(true);

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
			disabled={stateCollect}
		>
			{stateCollect ? "Collected" : "Collect"}
		</button>
	);
}

export default CollectBtn;
