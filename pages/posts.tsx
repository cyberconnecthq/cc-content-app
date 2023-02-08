import { useContext, useEffect, useState } from "react";
import type { NextPage } from "next";
import { AuthContext } from "../context/auth";
import Navbar from "../components/Navbar";
import Panel from "../components/Panel";
import PostCard from "../components/Cards/PostCard";
import { IPostCard } from "../types";
import { useLazyQuery } from "@apollo/client";
import { PRIMARY_PROFILE_ESSENCES } from "../graphql";
import Loading from "@/components/Loading";

const PostPage: NextPage = () => {
  const { accessToken, indexingPosts, posts, address } =
    useContext(AuthContext);
  const [getEssencesByFilter] = useLazyQuery(PRIMARY_PROFILE_ESSENCES);
  const [featuredPosts, setFeaturedPosts] = useState<IPostCard[]>([]);
  const [loading, setIsLoading] = useState(true);

  useEffect(() => {
    const getEssences = async () => {
      const { data } = await getEssencesByFilter({
        variables: {
          address,
          // chainID: 5,
          myAddress: address,
        },
      });

      setFeaturedPosts(
        data?.address?.wallet?.primaryProfile?.essences?.edges?.map(
          (item: any) => item.node
        ) || []
      );

      setIsLoading(false);
    };

    getEssences();
  }, [address, getEssencesByFilter]);

  return (
    <div className="container">
      <Navbar />
      <div className="wrapper">
        <div className="wrapper-content">
          <h1 className="text-2xl font-bold">My posts</h1>
          <div className="posts">
            {!accessToken ? (
              <div className="h-96 flex items-center justify-center">
                You need to <strong className="m-1">Sign in</strong> to view
                your posts.
              </div>
            ) : loading ? (
              <Loading />
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
                  </div>
                ) : (
                  <div className="h-96 flex items-center justify-center">
                    You haven&apos;t created any posts yet.
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

export default PostPage;
