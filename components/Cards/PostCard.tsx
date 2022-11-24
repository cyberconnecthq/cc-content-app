import React, { useEffect, useState } from "react";
import Image from "next/image";
import SubscribeBtn from "../Buttons/SubscribeBtn";
import { IPostCard } from "../../types";
import { parseURL, timeSince } from "../../helpers/functions";
import Loader from "../Loader";
import Avatar from "@/components/Avatar";
import { AiOutlineFileProtect } from "react-icons/ai";
import { useRouter } from "next/router";
import { formatDate } from "@/helpers/functions";

const PostCard = ({
  essenceID,
  tokenURI,
  createdBy,
  isCollectedByMe,
  isIndexed,
}: IPostCard) => {
  const router = useRouter();
  const { handle, profileID, metadata, owner } = createdBy;

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

  const viewDetail = () => {
    router.push(
      `/${handle}/${encodeURIComponent(
        tokenURI
      )}?essenceID=${essenceID}&profileID=${profileID}&isCollectedByMe=${isCollectedByMe}`
    );
  };

  const goToProfile = () => {
    if (owner?.address) {
      router.push(`/u/${owner.address}`);
    }
  };

  return (
    <>
      {!loadFromIPFSFailed && data?.content && data.tags.includes("lit-v1.2") && (
        <div className="mt-8">
          <div className="flex border border-gray-300 p-4 rounded-xl  hover:bg-neutral-50 justify-between gap-x-4">
            <div className="flex flex-col">
              <div
                className="flex gap-x-4 cursor-pointer"
                onClick={goToProfile}
              >
                <div>
                  <Avatar value={handle} size={50} />
                </div>
                <div className="flex items-center gap-x-1">
                  <div className="flex flex-col">
                    <div className="leading-6">{name}</div>
                    <div className="leading-6 text-gray-500 text-xs">
                      @{handle}
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-xs mt-4">
                {formatDate(new Date(data.issue_date))}
              </div>
              <div className="mt-4 cursor-pointer" onClick={viewDetail}>
                <div className="text-xl font-bold">{data.name}</div>
                <div className="text-base mt-4">{data.description}</div>
              </div>
              <div className="mt-16 grow flex items-end  w-full">
                {isIndexed ? (
                  <SubscribeBtn
                    isSubscribedByMe={owner.primaryProfile.isSubscribedByMe}
                    profileID={profileID}
                  />
                ) : (
                  <Loader />
                )}
              </div>
            </div>
            <div
              onClick={viewDetail}
              className="cursor-pointer shrink-0  flex flex-col justify-between"
            >
              <Image
                className="rounded-xl object-cover"
                src={data?.image}
                alt="nft"
                width={280}
                height={200}
                placeholder="blur"
                blurDataURL="/assets/essence-placeholder.svg"
              />

              <div className="flex items-center gap-x-1">
                <AiOutlineFileProtect
                  size={18}
                  className="m-0 text-slate-500"
                />
                <span className="text-right text-sm text-slate-500">
                  This post is protected by Lit Protocol
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostCard;
