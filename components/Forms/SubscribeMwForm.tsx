import { useState, MouseEvent, ChangeEvent, useContext, useEffect } from "react";
import { AuthContext } from "../../context/auth";
import { CHAIN_ID } from "../../helpers/constants";
import { useLazyQuery } from "@apollo/client";
import { ADDRESS } from "../../graphql";
import { IProfileMwCard } from "../../types";
import SubscribeMwCard from "../Cards/SubscribeMwCard";
import SetSubscribeBtn from "../Buttons/SetSubscribeBtn";

const SubscribeMwForm = () => {
    const { address, accessToken } = useContext(AuthContext);
    const [subscribeMw, setSubscribeMw] = useState<string>("free");

    /* State variable to store the profiles */
    const [profiles, setProfiles] = useState<any[]>([]);

    /* State variable to store the selected profile */
    const [selectedProfileId, setSelectedProfileId] = useState<number>(0);

    /* Query to get user information by wallet address */
    const [getAddress] = useLazyQuery(ADDRESS);

    const [showDropdown, setShowDropdown] = useState<boolean>(false);

    useEffect(() => {
        if (!(address && accessToken)) return;

        (async () => {
            /* Get all profile for the wallet address */
            const res = await getAddress({
                variables: {
                    address: address,
                    chainID: CHAIN_ID
                },
            });
            const edges = res?.data?.address?.wallet?.profiles?.edges;
            const profiles = edges?.map((edge: any) => edge?.node) || [];

            /* Set the profile profiles */
            setProfiles(profiles);
        })();
    }, [address, accessToken, getAddress]);


    const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSubscribeMw(value);
    };

    const handleOnClick = (event: MouseEvent) => {
        const target = event.target as HTMLDivElement;
        if (target.className !== "dropdown-select") {
            setShowDropdown(false);
        }
    }

    return (
        <div
            className="form essence-mw-form"
            onClick={handleOnClick}
        >
            <h2>Set middleware for Profile</h2>
            <label>Select profile</label>
            <div className="dropdown">
                <div
                    className="dropdown-select"
                    onClick={() => setShowDropdown(prev => !prev)}
                >Profile ID: {selectedProfileId}</div>
                {
                    showDropdown &&
                    <div className="dropdown-options">
                        {
                            profiles.map((profile: IProfileMwCard) => (
                                <SubscribeMwCard
                                    key={profile.profileID}
                                    profileID={profile.profileID}
                                    metadata={profile.metadata}
                                    setSelectedProfileId={setSelectedProfileId}
                                    setShowDropdown={setShowDropdown}
                                />
                            ))
                        }
                    </div>
                }
            </div>
            <div className="form-post-middleware">
                <div>Middleware</div>
                <div>
                    <label><strong>FREE:</strong> users subscribe to your profile for free
                        <input type="radio" name="middleware" value="free" defaultChecked onChange={handleOnChange} />
                    </label>
                    <label><strong>PAID:</strong> users pay 1 LINK to subscribe to your profile
                        <input type="radio" name="middleware" value="paid" onChange={handleOnChange} />
                    </label>
                </div>
            </div>
            <div className="form-note"><strong>Note:</strong> You will set the middleware for the selected profile.</div>
            <SetSubscribeBtn
                middleware={subscribeMw}
                profileID={selectedProfileId}
            />
        </div>
    );
};

export default SubscribeMwForm;
