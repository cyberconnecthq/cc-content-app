import { useRouter } from "next/router";
import { parseURL, timeSince } from "../../helpers/functions";
import SubscribeBtn from "@/components/Buttons/SubscribeBtn";
import Panel from "@/components/Panel";
import Navbar from "@/components/Navbar";
import { CHAIN_ID } from "../../helpers/constants";
import { useCancellableQuery } from "../../hooks/useCancellableQuery";
import { PROFILE_BY_HANDLE } from "../../graphql";
import Image from "next/image";
import React from "react";
import { useLazyQuery } from "@apollo/client";
import Avatar from "@/components/Avatar";
import AccessCover from "@/components/AccessCover";

import { AuthContext } from "../../context/auth";
import { formatDate } from "@/helpers/functions";
// @ts-ignore
import LitJsSdk from "@lit-protocol/sdk-browser";
import { TailSpin } from "react-loading-icons";

const decryptWithLit = async (
  encryptedSymmetricKey: string,
  blob: Blob,
  profileId: string
) => {
  const client = new LitJsSdk.LitNodeClient({ alertWhenUnauthorized: false });
  await client.connect();
  const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: "goerli" });
  const chain = "goerli";

  const evmContractConditions = [
    {
      permanent: false,
      contractAddress: "0xa52cc9b8219dce25bc791a8b253dec61f16d5ff0",
      functionName: "isSubscribedByMe",
      functionParams: [profileId, ":userAddress"],
      functionAbi: {
        inputs: [
          {
            internalType: "uint256",
            name: "profileId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "me",
            type: "address",
          },
        ],
        name: "isSubscribedByMe",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      chain: "goerli",
      returnValueTest: {
        key: "",
        comparator: "=",
        value: "true",
      },
    },
  ];

  const symmetricKey = await client.getEncryptionKey({
    evmContractConditions,
    toDecrypt: encryptedSymmetricKey,
    chain: "goerli",
    authSig,
  });

  const decryptedString = await LitJsSdk.decryptString(blob, symmetricKey);

  return decryptedString;
};
const decryptWithLitUnifiedConditions = async (
  encryptedSymmetricKey: string,
  blob: Blob,
  profileId: string,
  address: string
) => {
  const client = new LitJsSdk.LitNodeClient({ alertWhenUnauthorized: false });
  await client.connect();
  const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: "goerli" });
  const chain = "goerli";

  const unifiedAccessControlConditions = [
    {
      conditionType: "evmBasic",
      contractAddress: "",
      standardContractType: "",
      chain,
      method: "",
      parameters: [":userAddress"],
      returnValueTest: {
        comparator: "=",
        value: address,
      },
    },
    { operator: "or" },
    {
      conditionType: "evmContract",
      permanent: false,
      contractAddress: "0xa52cc9b8219dce25bc791a8b253dec61f16d5ff0",
      functionName: "isSubscribedByMe",
      functionParams: [profileId, ":userAddress"],
      functionAbi: {
        inputs: [
          {
            internalType: "uint256",
            name: "profileId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "me",
            type: "address",
          },
        ],
        name: "isSubscribedByMe",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      chain: "goerli",
      returnValueTest: {
        key: "",
        comparator: "=",
        value: "true",
      },
    },
  ];

  const symmetricKey = await client.getEncryptionKey({
    unifiedAccessControlConditions,
    toDecrypt: encryptedSymmetricKey,
    chain: "goerli",
    authSig,
  });

  const decryptedString = await LitJsSdk.decryptString(blob, symmetricKey);

  return decryptedString;
};

const Post = () => {
  const { accessToken, address } = React.useContext(AuthContext);
  const router = useRouter();
  const [post, setPost] = React.useState<any>(null);
  const [profile, setProfile] = React.useState<any>(null);
  const [getProfile] = useLazyQuery(PROFILE_BY_HANDLE);
  const [content, setContent] = React.useState<any>("");
  const [accessFailed, setAccessFailed] = React.useState<boolean>(true);
  const [validating, setValidating] = React.useState<boolean>(true);

  React.useEffect(() => {
    const { handle, cid } = router.query;
    setValidating(true);

    if (handle && cid) {
      getPostFromIPFS(cid as string, address as string);
      const getAddressInfo = async () => {
        try {
          let query = await getProfile({
            variables: {
              handle,
              // chainID: CHAIN_ID,
            },
          });

          const res = await query;
          setProfile(res.data.profileByHandle);
        } catch (error) {
          console.error(error);
        }
      };

      getAddressInfo();
    }
  }, [router.query, getProfile, accessToken, address]);

  const getPostFromIPFS = async (cid: string, address: string) => {
    const res = await fetch(parseURL(cid as string));
    if (res.status === 200) {
      const data = await res.json();

      setPost(data);
      console.log("data", data);

      const encryptedStringBlobResp = await fetch(
        parseURL(JSON.parse(data.content).contentHash.ipfshash)
      );

      const blob = await encryptedStringBlobResp.blob();

      const { encryptedSymmetricKey } = JSON.parse(data.content);

      if (!accessToken || !address) {
        setAccessFailed(true);
        setValidating(false);
        return;
      }

      try {
        const content = await decryptWithLitUnifiedConditions(
          encryptedSymmetricKey,
          blob,
          router.query.profileID as string,
          address as string
        );
        setContent(content);
        setAccessFailed(false);
        setValidating(false);
      } catch (error) {
        try {
          const content = await decryptWithLit(
            encryptedSymmetricKey,
            blob,
            router.query.profileID as string
          );
          setContent(content);
          setAccessFailed(false);
          setValidating(false);
        } catch (error) {
          setAccessFailed(true);
          setValidating(false);
          console.error(error);
          setAccessFailed(true);
          setValidating(false);
        }
      }
    }
  };

  return (
    <div className="container">
      <Navbar />
      <div className="wrapper">
        {post && (
          <div className="pt-8 grow">
            <div className="flex gap-x-4">
              <Avatar value={profile?.handle} size={50} />
              <div>
                <div className="font-semibold text-lg">{profile?.handle}</div>
                <div className="text-stone-500 text-sm">
                  {formatDate(post.issue_date)}
                </div>
              </div>
            </div>
            <div className="text-center py-8">
              <Image
                className="object-cover  "
                src={post.image}
                width={800}
                height={400}
                alt={post.description}
              />
            </div>
            {!accessFailed ? (
              <div className="px-24 mx-auto">
                <div className="text-4xl font-bold">{post.name}</div>
                <div className="my-8 text-gray-500">{post.description}</div>
                <div className="text-xl">{content}</div>
              </div>
            ) : (
              <div className="px-24 mx-auto pt-8 ">
                <div className="text-3xl">🔒 This post is protected.</div>
                {validating ? (
                  <div className="flex items-center gap-x-2 mt-4">
                    <TailSpin
                      stroke="#000"
                      height={20}
                      className="m-0"
                      strokeWidth={2}
                    />
                    <div>Validating your access...</div>
                  </div>
                ) : (
                  <div className="mt-6 ">
                    <div className="mb-4">
                      You don&apos;t have access to this post, subscribe to view
                    </div>
                    <SubscribeBtn
                      profileID={Number(router.query.profileID)}
                      isSubscribedByMe={false}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        <div className="wrapper-details">
          <Panel />
        </div>
      </div>
    </div>
  );
};

export default Post;
