import { useContext, useEffect, useState } from "react";
import type { NextPage } from "next";
import { AuthContext } from "@/context/auth";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import Panel from "@/components/Panel";
import PostCard from "@/components/Cards/PostCard";
import { IPostCard } from "@/types";
import { useLazyQuery } from "@apollo/client";
import {
  ESSENCES_BY_FILTER,
  PRIMARY_PROFILE_ESSENCES,
  PRIMARY_PROFILE,
} from "../../graphql";
import { FEATURED_POSTS } from "@/helpers/constants";
import { useRouter } from "next/router";

const Profile: NextPage = () => {
  const { accessToken, address } = useContext(AuthContext);
  const [getEssencesByFilter] = useLazyQuery(PRIMARY_PROFILE_ESSENCES);
  const [getProfile] = useLazyQuery(PRIMARY_PROFILE);
  const [featuredPosts, setFeaturedPosts] = useState<IPostCard[]>([]);
  const [loading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchProfile = async () => {
    try {
      /* Fetch primary profile */
      const { data } = await getProfile({
        variables: {
          address: router.query.address,
          // chainID: 5,
          myAddress:
            accessToken && address
              ? address
              : "0x0000000000000000000000000000000000000000",
        },
      });
    } catch (error) {
      /* Display error message */
      console.error(error);
    }
  };

  useEffect(() => {
    if (!router.query.address || !address) {
      return;
    }

    const getEssences = async () => {
      const { data } = await getEssencesByFilter({
        variables: {
          address: router.query.address as string,
          // chainID: 5,
          myAddress:
            accessToken && address
              ? address
              : "0x0000000000000000000000000000000000000000",
        },
      });

      setFeaturedPosts(
        data?.address.wallet.primaryProfile.essences.edges.map(
          (item: any) => item.node
        ) || []
      );

      setIsLoading(false);
    };

    getEssences();

    fetchProfile();
  }, [router.query.address, getEssencesByFilter, address]);

  return (
    <div className="container">
      <Navbar />
      <div className="wrapper">
        <div className="wrapper-content">
          <h1 className="text-2xl font-bold">Posts</h1>
          <div className="posts">
            {loading ? (
              <Loading />
            ) : (
              <div>
                {featuredPosts.length > 0 ? (
                  <div>
                    {featuredPosts.map((post) => (
                      <PostCard
                        key={`${post.createdBy.profileID}-${post.essenceID}`}
                        {...post}
                        isIndexed={true}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="h-96 flex items-center justify-center">
                    No posts
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="wrapper-details">
          <Panel />
        </div>
      </div>
    </div>
  );
};

export default Profile;
