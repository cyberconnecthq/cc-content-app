import { useState, ChangeEvent } from "react";
import { IPostInput } from "../../types";
import PostBtn from "../Buttons/PostBtn";

const PostForm = () => {
    const [postInput, setPostInput] = useState<IPostInput>({
        nftImageURL: "",
        content: ""
    });

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const name = event.target.name;
        const value = event.target.value;
        setPostInput({
            ...postInput,
            [name]: value
        });
    };

    return (
        <div className="form post-form">
            <h2>Create post</h2>
            <div>
                <label>NFT image url</label>
                <input
                    name="nftImageURL"
                    value={postInput.nftImageURL}
                    onChange={handleChange}
                    placeholder="https://"
                ></input>
            </div>
            <div>
                <label>Post message</label>
                <textarea
                    name="content"
                    value={postInput.content}
                    onChange={handleChange}
                ></textarea>
            </div>
            <div className="form-note"><strong>Note:</strong> For empty fields we will randomly generate values.</div>
            <PostBtn {...postInput} />
        </div>
    );
};

export default PostForm;
