import type { NextPage } from "next";
import Navbar from "../components/Navbar";
import Panel from "../components/Panel";
import CollectBtn from "../components/Buttons/CollectBtn";

const PostPage: NextPage = () => {
    const posts = [
        {
            profileID: 22,
            tokenURI: "https://cyberconnect.mypinata.cloud/ipfs/QmdDEA2VwqvPJtLZnHSTNQakuhdyB1Q84H4EpfWW7cuXZW",
            essenceID: 4,
        }
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
                                    <div className="post" key={index}>
                                        <CollectBtn essenceID={post.essenceID} />
                                    </div>
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
