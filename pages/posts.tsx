import type { NextPage } from "next";
import Navbar from "../components/Navbar";
import Panel from "../components/Panel";

const PostPage: NextPage = () => {

    return (
        <div>
            <div className="container">
                <Navbar />
                <div className="g-wrapper">
                    <div className="g-wrapper-content">
                        <h1>Posts</h1>
                        <hr></hr>
                        <div className="posts">

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
