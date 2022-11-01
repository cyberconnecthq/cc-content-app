import { useContext } from "react";
import type { NextPage } from "next";
import { AuthContext } from "../context/auth";
import Navbar from "../components/Navbar";
import Panel from "../components/Panel";
import PostCard from "../components/Cards/PostCard";
import PostPlaceholder from "../components/Placeholders/PostPlaceholder";
import { IPostCard } from "../types";

const PostPage: NextPage = () => {
    const {
        address,
        accessToken,
        primaryProfile,
        isCreatingPost,
        posts
    } = useContext(AuthContext);
    const featuredPosts: IPostCard[] = [
        {
            essenceID: 2,
            tokenURI: "https://cyberconnect.mypinata.cloud/ipfs/Qmd7G1BVZ3EQ3w2mNWBqgi4DaRrnkv5thy5UR1ParwM7AG",
            createdBy: {
                avatar: "https://gateway.pinata.cloud/ipfs/QmNcqSpCvhiyHocUaVf7qB8qwEGerSpnELeAi567YEraYm",
                handle: "ccprotocol",
                profileID: 15,
                metadata: "QmRiyArHF4abhXo4pdKVQj3fVg6jLvcnH4DitVijuTaoyq"
            }
        },
        {
            essenceID: 1,
            tokenURI: "https://cyberconnect.mypinata.cloud/ipfs/QmWBjgu6Mhx1txRfzKkemoQDHjgmuwCJBp3HNUB7vZFi5F",
            createdBy: {
                avatar: "https://gateway.pinata.cloud/ipfs/QmNcqSpCvhiyHocUaVf7qB8qwEGerSpnELeAi567YEraYm",
                handle: "ccprotocol",
                profileID: 15,
                metadata: "QmRiyArHF4abhXo4pdKVQj3fVg6jLvcnH4DitVijuTaoyq"
            }
        },
    ];

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
                        {
                            featuredPosts.length > 0 &&
                            featuredPosts.map((post, index) => (
                                <PostCard
                                    key={index}
                                    essenceID={post.essenceID}
                                    createdBy={post.createdBy}
                                    tokenURI={post.tokenURI}
                                />
                            ))
                        }
                        <h2>My posts</h2>
                        <br></br>
                        {
                            !accessToken
                                ? <div>You need to <strong>Sign in</strong> to view your posts.</div>
                                : (
                                    <div>
                                        {
                                            posts.length === 0 &&
                                            (
                                                isCreatingPost
                                                    ? <PostPlaceholder />
                                                    : <div>You do not have a post yet.</div>
                                            )
                                        }
                                        {
                                            posts.length > 0 &&
                                            <>
                                                {
                                                    posts.map((post, index) => (
                                                        <PostCard
                                                            key={index}
                                                            essenceID={post.essenceID}
                                                            createdBy={post.createdBy}
                                                            tokenURI={post.tokenURI}
                                                        />
                                                    ))
                                                }
                                                {isCreatingPost && <PostPlaceholder />}
                                            </>
                                        }
                                    </div>
                                )
                        }
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
