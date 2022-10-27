import { useState, ChangeEvent } from "react";
import { ISignupInput } from "../../types";
import SignupBtn from "../../components/Buttons/SignupBtn";

const SignupForm = () => {
    const [signupInput, setSignupInput] = useState<ISignupInput>({
        handle: "",
        name: "",
        bio: "",
        avatar: ""
    });

    const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name;
        const value = event.target.value;
        setSignupInput({
            ...signupInput,
            [name]: value
        });
    };

    return (
        <div className="form signup-form">
            <h2>Create profile</h2>
            <div>
                <label>Handle</label>
                <input
                    name="handle"
                    value={signupInput.handle}
                    onChange={handleOnChange}
                    placeholder="@"
                ></input>
            </div>
            <div>
                <label>Avatar url</label>
                <input
                    name="avatar"
                    value={signupInput.avatar}
                    onChange={handleOnChange}
                    placeholder="https://"
                ></input>
            </div>
            <div>
                <label>Name</label>
                <input
                    name="name"
                    value={signupInput.name}
                    onChange={handleOnChange}
                ></input>
            </div>
            <div>
                <label>Bio</label>
                <input
                    name="bio"
                    value={signupInput.bio}
                    onChange={handleOnChange}
                ></input>
            </div>
            <div className="form-note"><strong>Note:</strong> For empty fields we will randomly generate values.</div>
            <SignupBtn {...signupInput} />
        </div>
    );
};

export default SignupForm;
