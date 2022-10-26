import { useContext } from "react";
import { ethers } from "ethers";
import ProfileNFTABI from "../../abi/ProfileNFT.json";
import { PROFILE_NFT_CONTRACT, PROFILE_NFT_OPERATOR } from "../../helpers/constants";
import { pinJSONToIPFS } from "../../helpers/functions";
import { randUserName, randAvatar, randPhrase, randFullName, } from "@ngneat/falso";
import { IProfileMetadata, ISignupInput } from "../../types";
import { AuthContext } from "../../context/auth";
import { ModalContext } from "../../context/modal";

function SignupBtn({ handle, avatar, name, bio }: ISignupInput) {
    const { provider, address, primayProfileID, setPrimayProfileID, primaryHandle, setPrimaryHandle, setIsCreatingProfile, checkNetwork } = useContext(AuthContext);
    const { handleModal } = useContext(ModalContext);

    const handleOnClick = async () => {
        try {
            /* Check if the user connected with wallet */
            if (!(provider && address)) {
                throw Error("You need to Connect wallet.");
            }

            /* Check if the network is the correct one */
            await checkNetwork(provider);

            /* Construct metadata schema */
            const metadata: IProfileMetadata = {
                name: name || randFullName(),
                bio: bio || randPhrase(),
                handle: handle || randUserName(),
                version: "1.0.0",
            };

            /* Upload metadata to IPFS */
            const ipfsHash = await pinJSONToIPFS(metadata);

            /* Get the signer from the provider */
            const signer = provider.getSigner();

            /* Get the contract instance */
            const contract = new ethers.Contract(
                PROFILE_NFT_CONTRACT,
                ProfileNFTABI,
                signer
            );

            /* Call the createProfile function to create the profile */
            const tx = await contract.createProfile(
                /* CreateProfileParams */
                {
                    to: address,
                    handle: handle || randUserName(),
                    avatar: avatar || randAvatar({ size: 200 }),
                    metadata: ipfsHash,
                    operator: PROFILE_NFT_OPERATOR,
                },
                /* preData */
                0x0,
                /* postData */
                0x0,
            );

            /* Close Signup Modal */
            handleModal(null, "");

            /* Set the isCreatingProfile in the state variables */
            setIsCreatingProfile(true);

            /* Wait for the transaction to be mined */
            await tx.wait();

            /* Log the transaction hash */
            console.log("~~ Tx hash ~~");
            console.log(tx.hash);

            /* Call the getProfileIdByHandle function to get the profile id */
            const newProfileID = await contract.getProfileIdByHandle(handle);

            /* Set the primary profileID in the state variables */
            setPrimayProfileID(primayProfileID || Number(newProfileID));

            /* Set the primary handle in the state variables */
            setPrimaryHandle(primaryHandle || handle);

            /* Display success message */
            handleModal("success", "Profile was created!");
        } catch (error) {
            /* Set the isCreatingProfile in the state variables */
            setIsCreatingProfile(false);

            /* Display error message */
            const message = error.message as string;
            handleModal("error", message);
        }
    };

    return (
        <button
            className="signup-btn"
            onClick={handleOnClick}
        >
            Sign up
        </button>
    );
}

export default SignupBtn;
