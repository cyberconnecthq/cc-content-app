import React, { useContext, useState, ChangeEvent } from "react";
import type { NextPage } from "next";
import { AuthContext } from "../context/auth";
import Navbar from "../components/Navbar";
import Panel from "../components/Panel";
import PostBtn from "../components/Buttons/PostBtn";

const NotificationsPage: NextPage = () => {
    const [post, setPost] = useState<string>("");

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setPost(event.target.value);
    };

    return (
        <div>
            <div className="container">
                <Navbar />
                <div className="g-wrapper">
                    <div className="g-wrapper-content">
                        <h1>Create post</h1>
                        <hr></hr>
                        <div className="post">
                            <textarea value={post} onChange={handleChange} placeholder="What's going on?" required />
                            <div className="btn">
                                <PostBtn post={post} />
                            </div>
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

export default NotificationsPage;
