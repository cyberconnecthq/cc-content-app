import type { NextPage } from "next";
import Navbar from "../components/Navbar";
import Panel from "../components/Panel";
import { PostCard } from "../components/Cards/PostCard";

const PostPage: NextPage = () => {
    const posts = [
        {
            profileID: 26,
            essenceID: 3,
            tokenURI: "https://cyberconnect.mypinata.cloud/ipfs/QmQja7HqkEnHU5TnoMrbK35AgxjAjjcq9fwagh6YmgpSaG"
        },
        {
            profileID: 26,
            essenceID: 4,
            tokenURI: "https://cyberconnect.mypinata.cloud/ipfs/QmRrsRq3WCm8jLnYdw2erxSSzou9wtNnbTxv2vAJrfTJ5E"
        },
        {
            profileID: 27,
            essenceID: 6,
            tokenURI: "https://cyberconnect.mypinata.cloud/ipfs/QmNcfoyNMW9fDURgd5KaLKUDLZ5wi5kVqSSHvYgH7gymUG"
        },
    ];

    return (
        <div>
            <div className="container">
                <Navbar />
                <div className="g-wrapper">
                    <div className="g-wrapper-content">
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
                    <div className="g-wrapper-details">
                        <Panel />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostPage;
