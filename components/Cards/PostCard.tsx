import React, { useEffect, useState } from "react";
import Image from "next/image";
import CollectBtn from "../Buttons/CollectBtn";
import { IPostCard } from "../../types";
import { parseURL } from "../../helpers/functions";

const PostCard = ({ essenceID, tokenURI, createdBy }: IPostCard) => {
    const { avatar, handle, profileID, metadata } = createdBy;
    const [name, setName] = useState("");
    const [data, setData] = useState({
        image: "",
        image_data: "",
        content: "",
        attributes: [],
    });

    useEffect(() => {
        if (!tokenURI) return;
        (async () => {
            setData({
                image: "",
                image_data: "",
                content: "",
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
                }
            } catch (error) {
                console.error(error);
            }
        })();
    }, [metadata]);

    return (
        <>
            {
                data?.attributes?.length === 0 &&
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
            }
        </>
    );
};

export default PostCard;