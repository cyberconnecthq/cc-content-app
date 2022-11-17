import { useState, ChangeEvent } from "react";
import { IPostInput } from "../../types";
import PostBtn from "../Buttons/PostBtn";

const PostForm = () => {
  const [postInput, setPostInput] = useState<IPostInput>({
    nftImageURL: "",
    content: "",
    middleware: "free",
    title: "",
    description: "",
  });

  const handleOnChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const name = event.target.name;
    const value = event.target.value;
    setPostInput({
      ...postInput,
      [name]: value,
    });
  };

  return (
    <div className="form post-form">
      <h2 className="text-2xl font-bold">Create post</h2>
      <div>
        <label>NFT image url</label>
        <input
          name="nftImageURL"
          value={postInput.nftImageURL}
          onChange={handleOnChange}
          placeholder="https://"
          required
        />
      </div>
      <div>
        <label>Title</label>
        <input
          name="title"
          value={postInput.title}
          onChange={handleOnChange}
          placeholder="A Perfect Post Title"
          required
        />
      </div>
      <div>
        <label>Description</label>
        <input
          name="description"
          value={postInput.description}
          onChange={handleOnChange}
          placeholder="Give a short description of your post"
          required
        />
      </div>
      <div>
        <label>Content</label>
        <textarea
          name="content"
          value={postInput.content}
          onChange={handleOnChange}
          placeholder="What's on your mind?"
          required
        ></textarea>
      </div>
      <div className="form-post-middleware">
        <div>Middleware</div>
        <div>
          <label>
            <strong>FREE:</strong> users collect post for free
            <input
              type="radio"
              name="middleware"
              value="free"
              defaultChecked
              onChange={handleOnChange}
            />
          </label>
          <label>
            <strong>PAID:</strong> users pay 1 LINK to collect
            <input
              type="radio"
              name="middleware"
              value="paid"
              onChange={handleOnChange}
            />
          </label>
        </div>
      </div>
      <div className="form-note">
        <strong>Note:</strong> For empty fields we will randomly generate
        values.
      </div>
      <PostBtn {...postInput} />
    </div>
  );
};

export default PostForm;
