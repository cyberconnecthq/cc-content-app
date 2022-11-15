import React, { useEffect, useState } from "react";
import Image from "next/image";
import SubscribeBtn from "../Buttons/SubscribeBtn";
import { IProfileCard } from "../../types";
import { parseURL } from "../../helpers/functions";
import Avatar from "@/components/Avatar";

const ProfileCard = ({
  handle,
  avatar,
  metadata,
  profileID,
  isSubscribedByMe,
}: IProfileCard) => {
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
    <div className="profile-card">
      <div className="flex items-center justify-between mb-3">
        <div className="shrink-0">
          <Avatar value={handle} size={80} />
        </div>
        <div className="grow-0">
          <SubscribeBtn
            profileID={profileID}
            isSubscribedByMe={isSubscribedByMe}
          />
        </div>
      </div>
      <div>
        <div className="profile-card-name">{data.name}</div>
        <div className="profile-card-handle">@{handle}</div>
      </div>
    </div>
  );
};

export default ProfileCard;
