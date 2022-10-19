import type { NextPage } from "next";
import Navbar from "../components/Navbar";
import Panel from "../components/Panel";
import { PostCard } from "../components/Cards/PostCard";

const PostPage: NextPage = () => {
    const posts = [
        {
            avatar: "https://gateway.pinata.cloud/ipfs/QmNcqSpCvhiyHocUaVf7qB8qwEGerSpnELeAi567YEraYm",
            handle: "ccprotocol",
            name: "CyberConnect",
            profileID: 15,
            essenceID: 2,
            tokenURI: "https://cyberconnect.mypinata.cloud/ipfs/Qmd7G1BVZ3EQ3w2mNWBqgi4DaRrnkv5thy5UR1ParwM7AG"
        },
        {
            avatar: "https://gateway.pinata.cloud/ipfs/QmNcqSpCvhiyHocUaVf7qB8qwEGerSpnELeAi567YEraYm",
            handle: "ccprotocol",
            name: "CyberConnect",
            profileID: 15,
            essenceID: 1,
            tokenURI: "https://cyberconnect.mypinata.cloud/ipfs/QmWBjgu6Mhx1txRfzKkemoQDHjgmuwCJBp3HNUB7vZFi5F"
        },
        {
            avatar: "https://gateway.pinata.cloud/ipfs/QmV1ZVcyC96g1HYsxXgG6BP6Kc8xrZCBqj7PNkvxhPwLoz",
            handle: "snowdot",
            name: "Snowdot",
            profileID: 44,
            essenceID: 5,
            tokenURI: "https://cyberconnect.mypinata.cloud/ipfs/QmRgQ55r3Q2Wwfy2VnBrfAq3GYATyUn8ww55AghdGvro6M"
        },
        {
            avatar: "https://gateway.pinata.cloud/ipfs/QmV1ZVcyC96g1HYsxXgG6BP6Kc8xrZCBqj7PNkvxhPwLoz",
            handle: "snowdot",
            name: "Snowdot",
            profileID: 44,
            essenceID: 6,
            tokenURI: "https://cyberconnect.mypinata.cloud/ipfs/QmPgYgEvv32v8U1SZUh33f1A6zyTPtyKimGosznVhUwsVQ"
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
                        {
                            posts.length > 0 &&
                            posts.map((post, index) => (
                                <PostCard
                                    key={index}
                                    essenceID={post.essenceID}
                                    profileID={post.profileID}
                                    tokenURI={post.tokenURI}
                                    avatar={post.avatar}
                                    handle={post.handle}
                                    name={post.name}
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
    );
};

export default PostPage;
