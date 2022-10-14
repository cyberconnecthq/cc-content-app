import { useContext } from "react";
import Image from "next/image";
import { AuthContext } from "../../context/auth";
import SigninBtn from "../../components/Buttons/SigninBtn";
import ConnectBtn from "../../components/Buttons/ConnectBtn";
import SignupBtn from "../../components/Buttons/SignupBtn";
import SubscribeBtn from "../Buttons/SubscribeBtn";

const Panel = () => {
    const { provider, address, accessToken, profileID } = useContext(AuthContext);
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
                    (provider && address) ?
                        <div>
                            {!accessToken && <SigninBtn />}
                            {!profileID && <SignupBtn />}
                        </div>
                        : <ConnectBtn />

                }
            </div>
            <div className="panel-profiles">
                <h2>Who to subscribe</h2>
                {
                    suggestedProfiles.length > 0 &&
                    suggestedProfiles.map((profile, index) => (
                        <div key={index} className="profile-card">
                            <div>
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
