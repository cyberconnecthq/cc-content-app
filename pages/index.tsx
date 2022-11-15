import type { NextPage } from "next";
import { useContext, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Panel from "../components/Panel";
import { useLazyQuery } from "@apollo/client";
import { PROFILES_BY_IDS } from "../graphql";
import { PROFILES } from "../helpers/constants";
import ProfileCard from "../components/Cards/ProfileCard";
import { IProfileCard } from "../types";
import { AuthContext } from "../context/auth";

const Home: NextPage = () => {
  const { accessToken } = useContext(AuthContext);
  const [getProfilesByIDs] = useLazyQuery(PROFILES_BY_IDS);
  const [profiles, setProfiles] = useState<IProfileCard[]>([]);

  useEffect(() => {
    const getProfiles = async () => {
      const { data } = await getProfilesByIDs({
        variables: {
          chainID: 5,
          profileIDs: [2, 5, 12, 10, 15, 16, 77],
        },
      });
      setProfiles([...data.profilesByIDs]);
    };

    if (accessToken) {
      getProfiles();
    } else {
      setProfiles(PROFILES);
    }
  }, [accessToken]);

  return (
    <div className="container">
      <Navbar />
      <div className="wrapper">
        <div className="wrapper-content">
          <h1 className="text-2xl font-bold">Profiles</h1>
          <hr></hr>
          <div className="profiles">
            {profiles.length > 0 &&
              profiles.map((profile) => (
                <ProfileCard key={profile.profileID} {...profile} />
              ))}
          </div>
        </div>
        <div className="wrapper-details">
          <Panel />
        </div>
      </div>
    </div>
  );
};

export default Home;
