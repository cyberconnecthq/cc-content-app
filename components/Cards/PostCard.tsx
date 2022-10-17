import React, { useEffect, useState } from "react";
import Image from "next/image";
import CollectBtn from "../Buttons/CollectBtn";
import { IPostCard } from "../../types";
import { parseURL } from "../../helpers/functions";

export const PostCard = ({ essenceID, profileID, tokenURI,
    avatar, handle, name }: IPostCard) => {
    const [data, setData] = useState({
        image: "",
        image_data: "",
        content: ""
    });

    useEffect(() => {
        if (!tokenURI) return;
        (async () => {
            setData({
                image: "",
                image_data: "",
                content: ""
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

    return (
        <div className="post">
            <div className="post-info space-between">
                <div className="center">
                    <Image src={avatar} alt="avatar" width={50} height={50} />
                    <div>
                        <div className="post-name">{name}</div>
                        <div className="post-handle">@{handle}</div>
                    </div>
                </div>
                <CollectBtn
                    profileID={profileID}
                    essenceID={essenceID}
                />
            </div>
            <div className="post-content">{data.content}</div>
        </div>
    );
};