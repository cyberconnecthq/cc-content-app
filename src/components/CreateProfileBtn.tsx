import { ethers } from "ethers";
import { Web3Provider } from "@ethersproject/providers";
import ProfileNFTABI from "../abi/ProfileNFT.json";
import { PROFILE_NFT_CONTRACT, PROFILE_NFT_OPERATOR } from "../helpers/constants";
import { pinJSONToIPFS } from "../helpers/functions";
import { randUserName, randAvatar, randPhrase, randFullName, } from "@ngneat/falso";
import { IProfileMetadata } from "../types";

function CreateProfileBtn({
    provider,
    address,
    checkNetwork,
    setProfileID,
    setHandle,
    disabled,
}: {
    provider: Web3Provider | undefined,
    address: string | undefined,
    checkNetwork: (provider: Web3Provider) => Promise<void>,
    setProfileID: (profileID: number) => void,
    setHandle: (handle: string) => void,
    disabled: boolean,
}) {
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
            console.log("IPFS Hash:", metadata);
            /* Upload metadata to IPFS */
            const ipfsHash = await pinJSONToIPFS(metadata);
            console.log("IPFS Hash:", ipfsHash);
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

            /* Set the handle in the state variable */
            setHandle(handle);

            /* Display success message */
            alert("Successfully created the profile!");

        } catch (error) {
            /* Display error message */
            alert(error.message);
        }
    };

    return (
        <button onClick={handleOnClick} disabled={disabled}>
            Create Profile
        </button>
    );
}

export default CreateProfileBtn;
