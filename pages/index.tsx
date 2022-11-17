import { useContext, useEffect, useState } from "react";
import type { NextPage } from "next";
import { AuthContext } from "../context/auth";
import Navbar from "../components/Navbar";
import Panel from "../components/Panel";
import PostCard from "../components/Cards/PostCard";
import { IPostCard } from "../types";
import { useLazyQuery } from "@apollo/client";
import { ESSENCES_BY_FILTER, PRIMARY_PROFILE_ESSENCES } from "../graphql";
import { FEATURED_POSTS } from "../helpers/constants";

const Home: NextPage = () => {
  const { address } = useContext(AuthContext);
  const [getEssencesByFilter] = useLazyQuery(PRIMARY_PROFILE_ESSENCES);
  const [featuredPosts, setFeaturedPosts] = useState<IPostCard[]>([]);

  useEffect(() => {
    const getEssences = async () => {
      const { data } = await getEssencesByFilter({
        variables: {
          address: "0xbd358966445e1089e3AdD528561719452fB78198",
          chainID: 5,
          me: address,
        },
      });

      console.log(data);

      setFeaturedPosts(
        data?.address.wallet.primaryProfile.essences.edges.map(
          (item: any) => item.node
        ) || []
      );
    };

    getEssences();
  }, [getEssencesByFilter]);

  return (
    <div className="container">
      <Navbar />
      <div className="wrapper">
        <div className="wrapper-content">
          <h1 className="text-2xl font-bold">Recommendations</h1>
          <div className="posts">
            <div>
              {featuredPosts.length > 0 &&
                featuredPosts.map((post) => (
                  <PostCard
                    key={`${post.createdBy.profileID}-${post.essenceID}`}
                    {...post}
                    isIndexed={true}
                  />
                ))}
            </div>
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
