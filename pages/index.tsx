import type { NextPage } from "next";
import { useMemo } from "react";
import Navbar from "../components/Navbar";
import Panel from "../components/Panel";
import { useQuery } from "@apollo/client";
import { PROFILES } from "../graphql";

const Home: NextPage = () => {
  const { data, loading, error } = useQuery(PROFILES);

  const profiles = useMemo(() => {
    console.log(data);
    return [];
  }, [data]);

  return (
    <div>
      <div className="container">
        <Navbar />
        <div className="g-wrapper">
          <div className="g-wrapper-content">
            <h1>Profiles</h1>
            <hr></hr>
            {
              profiles.length > 0 &&
              profiles.map((profile, index) => (
                <div key={index} className="profile-card">
                </div>
              ))
            }
          </div>
          <div className="g-wrapper-details">
            <Panel />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home;
