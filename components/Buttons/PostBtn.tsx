import { useContext, MouseEvent } from "react";
import { useMutation } from "@apollo/client";
import { pinJSONToIPFS } from "../../helpers/functions";
import { CREATE_REGISTER_ESSENCE_TYPED_DATA, RELAY } from "../../graphql";
import { Metadata, Version } from "../../types";
import { AuthContext } from "../../context/auth";

function PostBtn({ post }: { post: string }) {
    const { provider, address, accessToken, profileID, handle, checkNetwork } = useContext(AuthContext);
    const [createRegisterEssenceTypedData] = useMutation(CREATE_REGISTER_ESSENCE_TYPED_DATA);
    const [relay] = useMutation(RELAY);

    const handleOnClick = async (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        try {
            /* Check if the user connected with wallet */
            if (!(provider && address)) {
                throw Error("Connect with MetaMask.");
            }

            /* Check if the has signed in */
            if (!accessToken) {
                throw Error("Youn need to Sign in.");
            }

            /* Check if the has signed up */
            if (!profileID) {
                throw Error("Youn need to Sign up.");
            }

            /* Check if the network is the correct one */
            await checkNetwork(provider);

            /* Render the svg data for the NFT */
            const svg = `
            <svg width="350" height="350" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <rect x="0" y="0" width="350" height="350" rx="8" fill="#fdf5f2" stroke="rgba(235, 87, 87, 0.3)" stroke-width="2" />
                <defs>
                    <path id="path1" d="M20,10 H330 M20,40 H330 M20,70 H330 M20,100 H330 M20,130 H330 M20,160 H330 M20,190 H330 M20,220 H330 M20,250 H330 M20,280 H330"></path>
                </defs>
                <use xlink:href="#path1" x="0" y="35" stroke="transparent" stroke-width="1" />
                <text transform="translate(0,35)" fill="#000" font-size="20">
                    <textPath xlink:href="#path1">${post}</textPath>
                </text>
            </svg>`;
            const svg_data = `data:image/svg+xml;base64,${btoa(svg)}`;

            /* Collect user input for NFT image */
            const nftImageURL = prompt("NFT image URL:");

            /* Create the metadata for the NFT */
            const metadata: Metadata = {
                version: Version.V1,
                image: nftImageURL ? nftImageURL : "",
                image_data: !nftImageURL ? svg_data : "",
                name: `@${handle}'s post`,
                description: `@${handle}'s post on CyberConnect Content app`,
                content: post,
                issue_date: new Date().toISOString(),
            };

            /* Upload metadata to IPFS */
            const ipfsHash = await pinJSONToIPFS(metadata);

            /* Get the signer from the provider */
            const signer = provider.getSigner();

            /* Get the network from the provider */
            const network = await provider.getNetwork();

            /* Get the chain id from the network */
            const chainID = network.chainId;

            /* Create typed data in a readable format */
            const typedDataResult = await createRegisterEssenceTypedData({
                variables: {
                    input: {
                        options: {
                            chainID: chainID
                        },
                        profileID: profileID,
                        name: "Post",
                        symbol: "POST",
                        tokenURI: `https://cyberconnect.mypinata.cloud/ipfs/${ipfsHash}`,
                        middleware: {
                            collectFree: true,
                        },
                        transferable: true
                    }
                }
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
                        signature: signature
                    }
                }
            });
            const txHash = relayResult.data?.relay?.relayTransaction?.txHash;

            /* Log the transaction hash */
            console.log("~~ Tx hash ~~");
            console.log(txHash);

            /* Display success message */
            alert("Successfully created the post!");
        } catch (error) {
            /* Display error message */
            alert(error.message);
        }
    };

    return (
        <button
            className="post-btn"
            type="submit"
            onClick={handleOnClick}
        >
            Post
        </button>
    );
}

export default PostBtn;
