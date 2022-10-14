import React, { useEffect, useState } from "react";
import Image from "next/image";
import CollectBtn from "../Buttons/CollectBtn";
import { IPostCard } from "../../types";
import { parseURL } from "../../helpers/functions";

export const PostCard = ({ essenceID, profileID, tokenURI }: IPostCard) => {
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
            <div className="btn">
                <CollectBtn
                    profileID={profileID}
                    essenceID={essenceID}
                />
            </div>
            <Image src={data.image ? data.image : data.image_data} alt="post" width={400} height={400} />
            <div className="post-content">{data.content}</div>
        </div>
    );
};