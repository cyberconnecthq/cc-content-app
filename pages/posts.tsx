import type { NextPage } from "next";
import Navbar from "../components/Navbar";
import Panel from "../components/Panel";
import { PostCard } from "../components/Cards/PostCard";

const PostPage: NextPage = () => {
    const posts = [
        {
            profileID: 22,
            essenceID: 4,
            tokenURI: "https://cyberconnect.mypinata.cloud/ipfs/QmdDEA2VwqvPJtLZnHSTNQakuhdyB1Q84H4EpfWW7cuXZW"
        },
        {
            profileID: 25,
            essenceID: 1,
            tokenURI: "https://cyberconnect.mypinata.cloud/ipfs/QmVTsttA5VsA8vhXphPjky1BPNjtniNrjNH2huKoVHjEkP"
        },
        {
            profileID: 27,
            essenceID: 1,
            tokenURI: "https://cyberconnect.mypinata.cloud/ipfs/QmNcfoyNMW9fDURgd5KaLKUDLZ5wi5kVqSSHvYgH7gymUG"
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
