import { useEffect, useState } from "react";
import { IProfileMwCard } from "../../types";
import { parseURL } from "../../helpers/functions";

const SubscribeMwCard = ({ profileID, metadata, setSelectedProfileId, setShowDropdown }: IProfileMwCard) => {
    const [handle, setHandle] = useState<string>("");

    useEffect(() => {
        if (!metadata) return;
        (async () => {
            setHandle("");
            try {
                const res = await fetch(parseURL(metadata));
                if (res.status === 200) {
                    const data = await res.json();
                    setHandle(data?.handle);
                }
            } catch (error) {
                console.error(error);
            }
        })();
    }, [metadata]);

    const handleOnClick = () => {
        setSelectedProfileId(profileID);
        setShowDropdown(false);
    }

    return (
        <div
            className="subscribe-mw-card"
            onClick={handleOnClick}
        >
            <div>{profileID}</div>
            <div>@{handle}</div>
        </div>
    );
};

export default SubscribeMwCard;