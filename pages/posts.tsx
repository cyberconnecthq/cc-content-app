import type { NextPage } from "next";
import Navbar from "../components/Navbar";
import Panel from "../components/Panel";
import { PostCard } from "../components/Cards/PostCard";

const PostPage: NextPage = () => {
    const posts = [
        {
            profileID: 44,
            essenceID: 2,
            tokenURI: "https://cyberconnect.mypinata.cloud/ipfs/QmWeusbdbY2SEry1GEiJpmzd3Frp29wMNS3ZbNN21hLbVw"
        },
        {
            profileID: 44,
            essenceID: 5,
            tokenURI: "https://cyberconnect.mypinata.cloud/ipfs/QmRgQ55r3Q2Wwfy2VnBrfAq3GYATyUn8ww55AghdGvro6M"
        },
        {
            profileID: 44,
            essenceID: 6,
            tokenURI: "https://cyberconnect.mypinata.cloud/ipfs/QmPgYgEvv32v8U1SZUh33f1A6zyTPtyKimGosznVhUwsVQ"
        },
        {
            profileID: 44,
            essenceID: 7,
            tokenURI: "https://cyberconnect.mypinata.cloud/ipfs/QmXE1S6jjgX88mcTdRPqiJ2SQ4UKdmu7oTqstgvg9gjHCR"
        },
    ];

    return (
        <div>
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
                                    <PostCard key={index} profileID={post.profileID} essenceID={post.essenceID} tokenURI={post.tokenURI} />
                                ))
                            }
                        </div>
                    </div>
                    <div className="wrapper-details">
                        <Panel />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostPage;
