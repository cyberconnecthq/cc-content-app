import { useContext, useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_SUBSCRIBE_TYPED_DATA, RELAY } from "../../graphql";
import { AuthContext } from "../../context/auth";
import { ModalContext } from "../../context/modal";
import { BiCheck } from "react-icons/bi";

function SubscribeBtn({
  profileID,
  isSubscribedByMe,
}: {
  profileID: number;
  isSubscribedByMe: boolean;
}) {
  const { accessToken, connectWallet, checkNetwork } = useContext(AuthContext);
  const { handleModal } = useContext(ModalContext);
  const [createSubscribeTypedData] = useMutation(CREATE_SUBSCRIBE_TYPED_DATA);
  const [relay] = useMutation(RELAY);

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

      /* Get the address from the provider */
      const address = await signer.getAddress();

      /* Get the network from the provider */
      const network = await provider.getNetwork();

      /* Get the chain id from the network */
      // const chainID = network.chainId;

      /* Create typed data in a readable format */
      const typedDataResult = await createSubscribeTypedData({
        variables: {
          input: {
            options: {},
            profileIDs: [profileID],
          },
        },
      });
      const typedData =
        typedDataResult.data?.createSubscribeTypedData?.typedData;
      const message = typedData.data;
      const typedDataID = typedData.id;

      /* Get the signature for the message signed with the wallet */
      const fromAddress = address;
      const params = [fromAddress, message];
      const method = "eth_signTypedData_v4";
      const signature = await signer.provider.send(method, params);

      console.log("signature", signature);

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
      handleModal("success", "Subscribed to profile!");
    } catch (error) {
      /* Display error message */
      const message = error.message as string;
      handleModal("error", message);
    }
  };

  return (
    <button
      className={`px-3 py-1 rounded-full border-black border hover:bg-stone-900 hover:text-white ease-in duration-100 text-xs flex items-center ${
        isSubscribedByMe ? "bg-stone-900 text-white" : "bg-white text-black"
      }`}
      onClick={handleOnClick}
      disabled={isSubscribedByMe}
    >
      {isSubscribedByMe ? (
        <>
          <BiCheck size={20} />
          Subscribed
        </>
      ) : (
        "Subscribe"
      )}
    </button>
  );
}

export default SubscribeBtn;
