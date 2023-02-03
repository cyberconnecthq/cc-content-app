import { useContext, useEffect, useState } from "react";
import type { NextPage } from "next";
import { AuthContext } from "../context/auth";
import Navbar from "../components/Navbar";
import Panel from "../components/Panel";
import PostCard from "../components/Cards/PostCard";
import { IPostCard } from "../types";
import { useLazyQuery } from "@apollo/client";
import { ESSENCES_BY_FILTER } from "../graphql";
import { FEATURED_POSTS } from "../helpers/constants";

const PostPage: NextPage = () => {
  const { accessToken, indexingPosts, posts, address } =
    useContext(AuthContext);
  const [getEssencesByFilter] = useLazyQuery(ESSENCES_BY_FILTER);
  const [featuredPosts, setFeaturedPosts] = useState<IPostCard[]>([]);

  useEffect(() => {
    const getEssences = async () => {
      const { data } = await getEssencesByFilter({
        variables: {
          appID: "cyberconnect-bnbt",
          me: address,
        },
      });
      const filtered = data?.essenceByFilter || [];
      setFeaturedPosts(filtered);

      console.log("filtered", filtered);
    };

    if (accessToken) {
      getEssences();
    } else {
      setFeaturedPosts(FEATURED_POSTS);
    }
  }, [accessToken]);

  return (
    <div className="container">
      <Navbar />
      <div className="wrapper">
        <div className="wrapper-content">
          <h1>Posts</h1>
          <hr></hr>
          <div className="posts">
            <h2>Featured</h2>
            <br></br>
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
            <br></br>
            <br></br>
            <h2>My posts</h2>
            <br></br>
            {!accessToken ? (
              <div>
                You need to <strong>Sign in</strong> to view your posts.
              </div>
            ) : (
              <div>
                {posts.length === 0 && (
                  <div>You haven&apos;t created any posts yet.</div>
                )}
                {posts.length > 0 && (
                  <div>
                    {posts.map((post) => (
                      <PostCard
                        key={`${post.createdBy.profileID}-${post.essenceID}`}
                        {...post}
                        isIndexed={true}
                      />
                    ))}
                  </div>
                )}
                <div>
                  <h3>Relaying Posts</h3>
                  {indexingPosts.length > 0 &&
                    indexingPosts.map((post) => (
                      <PostCard
                        key={`${post.createdBy.profileID}-${post.essenceID}`}
                        {...post}
                      />
                    ))}
                </div>
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
