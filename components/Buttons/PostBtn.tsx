import { useContext, MouseEvent } from "react";
import { useMutation } from "@apollo/client";
import { pinJSONToIPFS, renderSVGData } from "../../helpers/functions";
import { CREATE_REGISTER_ESSENCE_TYPED_DATA, RELAY } from "../../graphql";
import { IEssenceMetadata, Version } from "../../types";
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

            /* Function to render the svg data for the NFT */
            /* (default if the user doesn't pass a image url) */
            const svg_data = renderSVGData(post);

            /* Collect user input for NFT image */
            const nftImageURL = prompt("NFT image URL:");

            /* Create the metadata for the NFT */
            const metadata: IEssenceMetadata = {
                version: Version.V1,
                app_id: "cyberconnect",
                lang: "en",
                issue_date: new Date().toISOString(),
                content: post,
                media: [],
                tags: [],
                image: nftImageURL ? nftImageURL : "",
                image_data: !nftImageURL ? svg_data : "",
                name: `@${handle}'s post`,
                description: `@${handle}'s post on CyberConnect Content app`,
                animation_url: "",
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
