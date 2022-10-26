import { useContext } from "react";
import { useMutation } from "@apollo/client";
import { pinJSONToIPFS, getEssenceSVGData } from "../../helpers/functions";
import { CREATE_REGISTER_ESSENCE_TYPED_DATA, RELAY } from "../../graphql";
import { IEssenceMetadata, Version, IPostInput } from "../../types";
import { randPhrase } from "@ngneat/falso";
import { AuthContext } from "../../context/auth";
import { ModalContext } from "../../context/modal";
import { v4 as uuidv4 } from "uuid";

function PostBtn({ nftImageURL, content }: IPostInput) {
    const { provider, address, accessToken, profileID, handle, checkNetwork } = useContext(AuthContext);
    const { handleModal } = useContext(ModalContext);
    const [createRegisterEssenceTypedData] = useMutation(CREATE_REGISTER_ESSENCE_TYPED_DATA);
    const [relay] = useMutation(RELAY);

    const handleOnClick = async () => {
        try {
            /* Check if the user connected with wallet */
            if (!(provider && address)) {
                throw Error("You need to Connect wallet.");
            }

            /* Check if the user logged in */
            if (!(accessToken)) {
                throw Error("You need to Sign in.");
            }

            /* Check if the has signed up */
            if (!profileID) {
                throw Error("Youn need to Sign up.");
            }

            /* Check if the network is the correct one */
            await checkNetwork(provider);

            /* Function to render the svg data for the NFT */
            /* (default if the user doesn't pass a image url) */
            const svg_data = getEssenceSVGData();

            /* Construct the metadata object for the Essence NFT */
            const metadata: IEssenceMetadata = {
                metadata_id: uuidv4(),
                version: Version.V1,
                app_id: "cyberconnect",
                lang: "en",
                issue_date: new Date().toISOString(),
                content: content || randPhrase(),
                media: [],
                tags: [],
                image: nftImageURL ? nftImageURL : "",
                image_data: !nftImageURL ? svg_data : "",
                name: `@${handle}'s post`,
                description: `@${handle}'s post on CyberConnect Content app`,
                animation_url: "",
                external_url: "",
                attributes: [],
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
                            /* The chain id on which the Essence NFT will be minted on */
                            chainID: chainID
                        },
                        /* The profile id under which the Essence is registered */
                        profileID: profileID,
                        /* Name of the Essence */
                        name: "Post",
                        /* Symbol of the Essence */
                        symbol: "POST",
                        /* URL for the json object containing data about content and the Essence NFT */
                        tokenURI: `https://cyberconnect.mypinata.cloud/ipfs/${ipfsHash}`,
                        /* Middleware that allows users to collect the Essence NFT for free */
                        middleware: {
                            collectFree: true,
                        },
                        /* Set if the Essence should be transferable or not */
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
            handleModal("success", "Post was created!");
        } catch (error) {
            /* Display error message */
            const message = error.message as string;
            handleModal("error", message);
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
