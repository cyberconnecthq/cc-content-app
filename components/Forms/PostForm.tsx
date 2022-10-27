import { useState, ChangeEvent } from "react";
import { IPostInput } from "../../types";
import PostBtn from "../Buttons/PostBtn";

const PostForm = () => {
    const [postInput, setPostInput] = useState<IPostInput>({
        nftImageURL: "",
        content: "",
        middleware: "free"
    });

    const handleOnChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
                    onChange={handleOnChange}
                    placeholder="https://"
                ></input>
            </div>
            <div>
                <label>Post message</label>
                <textarea
                    name="content"
                    value={postInput.content}
                    onChange={handleOnChange}
                    placeholder="What's on your mind?"
                ></textarea>
            </div>
            <div className="form-post-middleware">
                <div>Middleware</div>
                <div>
                    <label><strong>FREE:</strong> users collect post for free
                        <input type="radio" name="middleware" value="free" defaultChecked onChange={handleOnChange} />
                    </label>
                    <label><strong>PAID:</strong> users pay 1 LINK to collect
                        <input type="radio" name="middleware" value="paid" onChange={handleOnChange} />
                    </label>
                </div>
            </div>
            <div className="form-note"><strong>Note:</strong> For empty fields we will randomly generate values.</div>
            <PostBtn {...postInput} />
        </div>
    );
};

export default PostForm;
