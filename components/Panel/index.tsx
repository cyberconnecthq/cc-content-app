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
  const { accessToken, primaryProfile } = useContext(AuthContext);
  const { handleModal } = useContext(ModalContext);
  const [getProfilesByIDs] = useLazyQuery(PROFILES_BY_IDS);
  const [profiles, setProfiles] = useState<IProfileCard[]>([]);

  useEffect(() => {
    const getProfiles = async () => {
      const { data } = await getProfilesByIDs({
        variables: {
          chainID: 5,
          profileIDs: [15, 16, 44, 5],
        },
      });

      if (data) {
        setProfiles([...data.profilesByIDs]);
      }
    };

    if (accessToken) {
      getProfiles();
    } else {
      setProfiles(SUGGESTED_PROFILES);
    }
  }, [accessToken]);

  return (
    <div className="panel">
      <div className="min-h-[193px] flex flex-col justify-center w-full">
        {primaryProfile && (
          <div className="w-full">
            <PrimaryProfileCard {...primaryProfile} />
          </div>
        )}

        <div className="w-full">
          {!accessToken && <SigninBtn />}
          {!primaryProfile?.profileID && (
            <button
              className="signup-btn"
              onClick={() => handleModal("signup", "")}
            >
              Sign up
            </button>
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
