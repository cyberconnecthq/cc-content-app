import { useContext } from "react";
import Image from "next/image";
import { AuthContext } from "../../context/auth";
import { ModalContext } from "../../context/modal";
import SigninBtn from "../../components/Buttons/SigninBtn";
import SubscribeBtn from "../Buttons/SubscribeBtn";
import PrimaryProfileCard from "../Cards/PrimaryProfileCard";

const Panel = () => {
    const { accessToken, primaryProfile } = useContext(AuthContext);
    const { handleModal } = useContext(ModalContext);
    const suggestedProfiles = [
        {
            name: "CyberConnect",
            handle: "ccprotocol",
            avatar: "https://gateway.pinata.cloud/ipfs/QmNcqSpCvhiyHocUaVf7qB8qwEGerSpnELeAi567YEraYm",
            profileID: 15,
        },
        {
            name: "Cyberlab",
            handle: "cyberlab",
            avatar: "https://gateway.pinata.cloud/ipfs/QmTMBsha6BjtNQqQFRjrpwQAfkt1DHpe5VTr2idw5piE47",
            profileID: 16,
        },
        {
            name: "Snowdot",
            handle: "snowdot",
            avatar: "https://gateway.pinata.cloud/ipfs/QmV1ZVcyC96g1HYsxXgG6BP6Kc8xrZCBqj7PNkvxhPwLoz",
            profileID: 44,
        },
        {
            name: "Satoshi Nakamoto",
            handle: "satoshi",
            avatar: "https://gateway.pinata.cloud/ipfs/QmaGUuGqxJ29we67C7RbCHSQaPybPdfoNr8Zccd7pfw8et",
            profileID: 5,
        },
    ];

    return (
        <div className="panel">
            <div>
                {
                    primaryProfile &&
                    <PrimaryProfileCard {...primaryProfile} />
                }
                <div>
                    {!accessToken && <SigninBtn />}
                    {
                        !primaryProfile?.profileID &&
                        <button
                            className="signup-btn"
                            onClick={() => handleModal("signup", "")}
                        >Sign up</button>
                    }
                </div>
            </div>
            <div className="panel-profiles">
                <h2>Who to subscribe</h2>
                {
                    suggestedProfiles.length > 0 &&
                    suggestedProfiles.map((profile, index) => (
                        <div key={index} className="panel-profile-card">
                            <div className="panel-profile-card-img">
                                <Image
                                    src={profile.avatar}
                                    alt="avatar"
                                    width={80}
                                    height={80}
                                />
                            </div>
                            <div className="profile-card-user">
                                <div>{profile.name}</div>
                                <div>@{profile.handle}</div>
                            </div>
                            <SubscribeBtn profileID={profile.profileID} />
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default Panel;
