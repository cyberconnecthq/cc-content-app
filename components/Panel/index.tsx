import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/auth";
import { ModalContext } from "../../context/modal";
import SigninBtn from "../../components/Buttons/SigninBtn";
import PrimaryProfileCard from "../Cards/PrimaryProfileCard";
import { useLazyQuery } from "@apollo/client";
import { PROFILES_BY_IDS } from "../../graphql";
import { SUGGESTED_PROFILES } from "../../helpers/constants";
import SuggestedProfileCard from "../Cards/SuggestedProfileCard";
import { IProfileCard } from "../../types";

const Panel = () => {
  const { accessToken, primaryProfile, address } = useContext(AuthContext);
  const { handleModal } = useContext(ModalContext);
  const [getProfilesByIDs] = useLazyQuery(PROFILES_BY_IDS);
  const [profiles, setProfiles] = useState<IProfileCard[]>([]);

  useEffect(() => {
    if (!address) {
      return;
    }
    const getProfiles = async () => {
      const { data } = await getProfilesByIDs({
        variables: {
          // chainID: 5,
          profileIDs: [155],
          myAddress:
            address && accessToken
              ? address
              : "0x0000000000000000000000000000000000000000",
        },
      });

      if (data) {
        setProfiles([...data.profilesByIDs]);
      }
    };

    getProfiles();
  }, [accessToken, address, accessToken]);

  const handleLogOut = () => {
    localStorage.clear();
    window.location.reload();
  };
  return (
    <div className="panel">
      <div className="min-h-[193px] flex flex-col justify-center w-full">
        {primaryProfile && (
          <div className="w-full">
            <PrimaryProfileCard {...primaryProfile} />
          </div>
        )}

        <div className="w-full">
          {accessToken ? (
            !primaryProfile?.profileID && (
              <div>
                <button
                  className="signup-btn"
                  onClick={() => handleModal("signup", "")}
                >
                  Sign up
                </button>
                <button className="signup-btn" onClick={handleLogOut}>
                  Log out
                </button>
              </div>
            )
          ) : (
            <div>
              <SigninBtn />
              <button
                className="signup-btn"
                onClick={() => handleModal("signup", "")}
              >
                Sign up
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="panel-profiles">
        <h2>Who to subscribe</h2>
        {profiles.length > 0 &&
          profiles.map((profile) => (
            <SuggestedProfileCard key={profile.profileID} {...profile} />
          ))}
      </div>
    </div>
  );
};

export default Panel;
