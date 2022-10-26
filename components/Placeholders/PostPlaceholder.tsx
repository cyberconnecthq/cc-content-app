import React from "react";
import AccountPlaceholder from "./AccountPlaceholder";

const PostPlaceholder = () => {
    return (
        <div className="post-placeholder">
            <AccountPlaceholder />
            <div className="placeholder-content"></div>
        </div>
    );
};

export default PostPlaceholder;
