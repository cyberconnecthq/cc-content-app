import { useContext, useEffect, useState } from "react";
import type { NextPage } from "next";
import { AuthContext } from "@/context/auth";
import Navbar from "@/components/Navbar";
import Panel from "@/components/Panel";
import PostCard from "@/components/Cards/PostCard";
import { IPostCard } from "@/types";
import { useLazyQuery } from "@apollo/client";
import { ESSENCES_BY_FILTER, PRIMARY_PROFILE_ESSENCES } from "../../graphql";
import { FEATURED_POSTS } from "@/helpers/constants";
import { useRouter } from "next/router";

const Profile: NextPage = () => {
  const { accessToken, indexingPosts, posts, address } =
    useContext(AuthContext);
  const [getEssencesByFilter] = useLazyQuery(PRIMARY_PROFILE_ESSENCES);
  const [featuredPosts, setFeaturedPosts] = useState<IPostCard[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!router.query.address) {
      return;
    }

    const getEssences = async () => {
      const { data } = await getEssencesByFilter({
        variables: {
          address: router.query.address as string,
          chainID: 5,
          me: address,
        },
      });

      setFeaturedPosts(
        data?.address.wallet.primaryProfile.essences.edges.map(
          (item: any) => item.node
        ) || []
      );
    };

    getEssences();
  }, [router.query.address, getEssencesByFilter]);

  return (
    <div className="container">
      <Navbar />
      <div className="wrapper">
        <div className="wrapper-content">
          <h1 className="text-2xl font-bold">My posts</h1>
          <div className="posts">
            {!accessToken ? (
              <div>
                You need to <strong>Sign in</strong> to view your posts.
              </div>
            ) : (
              <div>
                {posts.length > 0 ? (
                  <div>
                    {posts.map((post) => (
                      <PostCard
                        key={`${post.createdBy.profileID}-${post.essenceID}`}
                        {...post}
                        isIndexed={true}
                      />
                    ))}
                    {indexingPosts.length > 0 &&
                      indexingPosts.map((post) => (
                        <PostCard
                          key={`${post.createdBy.profileID}-${post.essenceID}`}
                          {...post}
                        />
                      ))}
                  </div>
                ) : (
                  <div>You haven&apos;t created any posts yet.</div>
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
