import React, { useEffect, useState } from "react";
import Image from "next/image";
import SubscribeBtn from "../Buttons/SubscribeBtn";
import { IProfileCard } from "../../types";
import { parseURL } from "../../helpers/functions";

const SuggestedProfileCard = ({
  handle,
  avatar,
  metadata,
  profileID,
  isSubscribedByMe,
}: any) => {
  const [src, setSrc] = useState(parseURL(avatar));
  const [data, setData] = useState({
    name: "",
    bio: "",
  });

  useEffect(() => {
    if (!metadata) return;
    (async () => {
      setData({
        name: "",
        bio: "",
      });
      try {
        const res = await fetch(parseURL(metadata));
        if (res.status === 200) {
          const data = await res.json();
          setData(data);
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, [metadata]);

  return (
    <div className="panel-profile-card">
      <div className="panel-profile-card-img">
        <Image
          src={src}
          alt="avatar"
          width={42}
          height={42}
          onError={() => setSrc("/assets/avatar-placeholder.svg")}
          placeholder="blur"
          blurDataURL="/assets/avatar-placeholder.svg"
        />
      </div>
      <div className="profile-card-user">
        <div>{data.name}</div>
        <div>@{handle}</div>
      </div>
      <SubscribeBtn profileID={profileID} isSubscribedByMe={isSubscribedByMe} />
    </div>
  );
};

export default SuggestedProfileCard;
