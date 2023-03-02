import { useContext, useState } from "react";
import {
	PROFILE_NFT_OPERATOR,
} from "../../helpers/constants";
import { pinJSONToIPFS } from "../../helpers/functions";
import {
	randUserName,
	randAvatar,
	randPhrase,
	randFullName,
} from "@ngneat/falso";
import { IProfileMetadata, ISignupInput } from "../../types";
import { AuthContext } from "../../context/auth";
import { ModalContext } from "../../context/modal";
import { CREATE_CREATE_PROFILE_TYPED_DATA, RELAY, RELAY_ACTION_STATUS, PROFILE_BY_HANDLE, PRIMARY_PROFILE } from "../../graphql";
import { useMutation, useLazyQuery } from "@apollo/client";
import { useCancellableQuery } from "../../hooks/useCancellableQuery";


function SignupBtn({ handle, avatar, name, bio, operator }: ISignupInput) {
	// const router = useRouter();
	const { address, indexingProfiles, setIndexingProfiles, connectWallet, checkNetwork, setPrimaryProfile } =
		useContext(AuthContext);
	const { handleModal } = useContext(ModalContext);
    const [createTypedData, { data: dataCreateTypedData, loading: loadingCreateTypedData, error: errorCreateTypedData }] = useMutation(CREATE_CREATE_PROFILE_TYPED_DATA);
    const [relay, { data: relayData, loading: relayLoading, error: relayError }] = useMutation(RELAY);
    const [relayActionStatus, { data: relayActionStatusData, loading: relayActionStatusLoading, error: relayActionStatusError }] = useLazyQuery(RELAY_ACTION_STATUS);
    const [profileByHandle, { data: profileByHandleData, loading: profileByHandleLoading, error: profileByHandleError }] = useLazyQuery(PROFILE_BY_HANDLE);
    const [primaryProfile] = useLazyQuery(PRIMARY_PROFILE);
	
	
	const pollRelayActionStatus = async (id: string) => {
		console.log("start polling");
		const relayActionStatusResult = await relayActionStatus({variables:{relayActionId:id}, fetchPolicy:"network-only"});
		console.log("relayActionStatusResult", relayActionStatusResult);
		if (relayActionStatusResult.data?.relayActionStatus?.txHash) {
			handleModal("success", "Profile was created!");
		  return;
		} else if (relayActionStatusResult.data?.relayActionStatus?.reason) {
			alert("Error: " + relayActionStatusResult.data?.relayActionStatus?.reason);
			return;
		}
		await new Promise((resolve) => setTimeout(resolve, 1000));
		await pollRelayActionStatus(id);
	  };

	const handleOnClick = async () => {
		try {
			/* Connect wallet and get provider */
			const provider = await connectWallet();

			/* Check if the network is the correct one */
			await checkNetwork(provider);

			const profileName = name || randFullName();
			const profileHandle = handle || randUserName();
			const profileAvatar = avatar || randAvatar();
			const profileBio = bio || randPhrase();

			/* Construct metadata schema */
			const metadata: IProfileMetadata = {
				name: profileName,
				bio: profileBio,
				handle: profileHandle,
				version: "1.0.0",
			};

			/* Upload metadata to IPFS */
			const ipfsHash = await pinJSONToIPFS(metadata);

			/* Get the signer from the provider */
			const signer = provider.getSigner();

			/* Get the address from the provider */
			const address = await signer.getAddress();
            

            const createTypedDataResult = await createTypedData({variables:{to: address,
                handle: handle || randUserName(),
                avatar: avatar || randAvatar({ size: 200 }),
                metadata: ipfsHash,
                operator: operator || PROFILE_NFT_OPERATOR}});
            console.log("createTypedDataResult", createTypedDataResult);
            console.log(createTypedDataResult.data)
            const typedDataId = createTypedDataResult.data?.createCreateProfileTypedData?.typedDataID;
            console.log("typedDataId", typedDataId);

            const relayResult = await relay({variables:{input:{typedDataID:typedDataId}}});
            console.log("relayResult", relayResult);
            const relayActionId = relayResult.data?.relay?.relayActionId;
            console.log("relayActionId", relayActionId);

			/* Close Signup Modal */
			handleModal(null, "");
			/* Set the indexingProfiles in the state variables */
            await pollRelayActionStatus(relayActionId);
            console.log("peroidic polling end");
			

			/* Call the getProfileIdByHandle function to get the profile id */
			// const profileID = await contract.getProfileIdByHandle(handle);
            const profileIdData = await profileByHandle({variables:{handle:handle || randUserName()}});
            const profileID = profileIdData.data?.profileByHandle?.id;
			
			/* Set the primary profile */
			const res = await primaryProfile({variables:{address:address}});
			const primaryProfileRes = res?.data?.address?.wallet?.primaryProfile;
			console.log("primaryProfileRes", primaryProfileRes);
			setPrimaryProfile(primaryProfileRes);
			
			/* Set the indexingProfiles in the state variables */
			setIndexingProfiles([
				...indexingProfiles,
				{
					profileID: Number(profileID),
					handle: profileHandle,
					avatar: profileAvatar,
					metadata: ipfsHash,
					isIndexed: false,
				},
			]);

		} catch (error) {
			/* Set the indexingProfiles in the state variables */
			setIndexingProfiles([...indexingProfiles]);

			/* Display error message */
			const message = error.message as string;
			handleModal("error", message);
		}
	};

	return (
		<button
			className="signup-btn"
			onClick={handleOnClick}>
			Mint Profile
		</button>
	);
}

export default SignupBtn;
