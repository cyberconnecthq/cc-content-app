import React, { useEffect, useState } from "react";
import Image from "next/image";
import { IAccountCard } from "../../types";
import { parseURL } from "../../helpers/functions";

export const AccountCard = ({ handle, avatar, metadata, profileID, isPrimary }: IAccountCard) => {
    const [data, setData] = useState({
        name: "",
        bio: ""
    });

    useEffect(() => {
        if (!metadata) return;
        (async () => {
            setData({
                name: "",
                bio: ""
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
        <div className="account-card">
            <div className="account-card-img">
                <Image src={parseURL(avatar)} alt="avatar" width={60} height={60} />
            </div>
            <div>
                <div className="account-card-name">{data.name}</div>
                <div className="account-card-handle">@{handle}</div>
            </div>
            <div>
                {
                    isPrimary
                        ? <div className="account-card-primary">Primary</div>
                        : <div></div>

                }
            </div>
        </div>
    );
};
