import React, { useEffect, useState } from "react";
import Image from "next/image";
import CollectBtn from "../Buttons/CollectBtn";
import SubscribeBtn from "../Buttons/SubscribeBtn";
import { IPostCard } from "../../types";
import { parseURL, timeSince } from "../../helpers/functions";
import Loader from "../Loader";
import Avatar from "@/components/Avatar";
import Link from "next/link";
import { useRouter } from "next/router";

const PostCard = ({
  essenceID,
  tokenURI,
  createdBy,
  isCollectedByMe,
  isIndexed,
}: IPostCard) => {
  const router = useRouter();
  const { avatar, handle, profileID, metadata, owner } = createdBy;
  const [name, setName] = useState("");
  const [data, setData] = useState<any>({
    image: "",
    image_data: "",
    content: "",
    issue_date: "",
    attributes: [],
    name: "",
    tags: [],
    description: "",
  });
  const [loadFromIPFSFailed, setLoadFromIPFSFailed] = useState(false);

  const [nftSrc, setNftSrc] = useState(
    data.image ? parseURL(data.image) : data.image_data
  );

  useEffect(() => {
    if (!tokenURI) return;
    (async () => {
      setData({
        image: "",
        image_data: "",
        content: "",
        issue_date: "",
        attributes: [],
      });
      try {
        const res = await fetch(parseURL(tokenURI));
        if (res.status === 200) {
          const data = await res.json();
          console.log("data", data);
          setData(data);
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, [tokenURI]);

  useEffect(() => {
    if (!metadata) return;
    (async () => {
      setName("");
      try {
        const res = await fetch(parseURL(metadata));
        if (res.status === 200) {
          const data = await res.json();
          setName(data?.name);
        } else {
          setLoadFromIPFSFailed(true);
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, [metadata]);

  const viewDetail = (e: any) => {
    router.push(
      `/${handle}/${encodeURIComponent(
        tokenURI
      )}?essenceID=${essenceID}&profileID=${profileID}&isCollectedByMe=${isCollectedByMe}`
    );
  };

  const goToProfile = (e: any) => {
    if (owner?.address) {
      router.push(`/u/${owner.address}`);
    }
  };

  return (
    <>
      {!loadFromIPFSFailed && data?.content && data.tags.includes("lit") && (
        <div className="mt-8">
          <div className="flex border border-gray-300 p-4 rounded-xl  hover:bg-neutral-50 justify-between">
            <div className="flex flex-col" onClick={goToProfile}>
              <div className="flex gap-x-4">
                <div>
                  <Avatar value={handle} size={50} />
                </div>
                <div className="flex items-center gap-x-4">
                  <div className="flex items-center">
                    <div>{name}</div>
                    <div>@{handle} •</div>
                  </div>
                  <div>{timeSince(new Date(data.issue_date))}</div>
                </div>
              </div>
              <div className="mt-4 cursor-pointer" onClick={viewDetail}>
                <div className="text-xl font-bold">{data.name}</div>
                <div className="text-base mt-4">{data.description}</div>
              </div>
              <div className="mt-16">
                {isIndexed ? (
                  <SubscribeBtn
                    isSubscribedByMe={false}
                    profileID={profileID}
                  />
                ) : (
                  <Loader />
                )}
              </div>
            </div>
            <div onClick={viewDetail} className="cursor-pointer">
              <Image
                className="rounded-xl"
                src={data?.image}
                alt="nft"
                width={350}
                height={350}
                onError={() => setNftSrc("/assets/essence-placeholder.svg")}
                placeholder="blur"
                blurDataURL="/assets/essence-placeholder.svg"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostCard;
