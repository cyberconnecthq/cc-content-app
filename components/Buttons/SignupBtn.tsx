import { useContext } from "react";
import { ethers } from "ethers";
import ProfileNFTABI from "../../abi/ProfileNFT.json";
import { PROFILE_NFT_CONTRACT, PROFILE_NFT_OPERATOR } from "../../helpers/constants";
import { pinJSONToIPFS } from "../../helpers/functions";
import { randUserName, randAvatar, randPhrase, randFullName, } from "@ngneat/falso";
import { IProfileMetadata } from "../../types";
import { AuthContext } from "../../context/auth";

function SignupBtn() {
    const { provider, address, setProfileID, setHandle, checkNetwork } = useContext(AuthContext);

    const handleOnClick = async () => {
        try {
            /* Check if the user connected with wallet */
            if (!(provider && address)) {
                throw Error("Connect with MetaMask.");
            }

            /* Check if the network is the correct one */
            await checkNetwork(provider);

            /* Collect user input */
            const handle = prompt("Handle:") || randUserName();
            const avatar = prompt("Avatar URL:") || randAvatar({ size: 200 });
            const name = prompt("Name:") || randFullName();
            const bio = prompt("Bio:") || randPhrase();

            /* Construct metadata schema */
            const metadata: IProfileMetadata = {
                name: name,
                bio: bio,
                handle: handle,
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
                    handle: handle,
                    avatar: avatar,
                    metadata: ipfsHash,
                    operator: PROFILE_NFT_OPERATOR,
                },
                /* preData */
                0x0,
                /* postData */
                0x0
            );

            /* Wait for the transaction to be mined */
            await tx.wait();

            /* Log the transaction hash */
            console.log("~~ Tx hash ~~");
            console.log(tx.hash);

            /* Call the getProfileIdByHandle function to get the profile id */
            const profileID = await contract.getProfileIdByHandle(handle);

            /* Set the profileID in the state variables */
            setProfileID(Number(profileID));

            /* Set the handle in the state variables */
            setHandle(handle);

            /* Display success message */
            alert("Successfully created the profile!");
        } catch (error) {
            /* Display error message */
            alert(error.message);
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
