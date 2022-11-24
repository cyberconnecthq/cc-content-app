import React, { useEffect, useState } from "react";
import Image from "next/image";
import SubscribeBtn from "../Buttons/SubscribeBtn";
import { IProfileCard } from "../../types";
import { parseURL } from "../../helpers/functions";

const ProfileCard = ({
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
    <div className="profile-card">
      <div className="profile-card-img">
        <div>
          <Image
            src={src}
            alt="avatar"
            width={80}
            height={80}
            onError={() => setSrc("/assets/avatar-placeholder.svg")}
            placeholder="blur"
            blurDataURL="/assets/avatar-placeholder.svg"
          />
        </div>
        <SubscribeBtn
          profileID={profileID}
          isSubscribedByMe={isSubscribedByMe}
        />
      </div>
      <div>
        <div className="profile-card-name">{data.name}</div>
        <div className="profile-card-handle">@{handle}</div>
        <div className="profile-card-bio">{data.bio}</div>
      </div>
    </div>
  );
};

export default ProfileCard;
