import type { NextPage } from "next";
import { useMemo } from "react";
import Navbar from "../components/Navbar";
import Panel from "../components/Panel";
import { useQuery } from "@apollo/client";
import { PROFILES } from "../graphql";
import ProfileCard from "../components/Cards/ProfileCard";
import { IProfileCard } from "../types";

const Home: NextPage = () => {
  const { data } = useQuery(PROFILES);

  const profiles = useMemo(() => {
    const edges = data?.profiles?.edges;
    const profiles = edges?.map((edge: any) => edge?.node);
    return profiles || [];
  }, [data]);

  return (
    <div className="container">
      <Navbar />
      <div className="wrapper">
        <div className="wrapper-content">
          <h1>Profiles</h1>
          <hr></hr>
          <div className="profiles">
            {
              profiles.length > 0 &&
              profiles.map((profile: IProfileCard) => (
                <ProfileCard
                  key={profile.profileID}
                  profileID={profile.profileID}
                  handle={profile.handle}
                  avatar={profile.avatar}
                  metadata={profile.metadata}
                />
              ))
            }
          </div>
        </div>
        <div className="wrapper-details">
          <Panel />
        </div>
      </div>
    </div>
  )
}

export default Home;
