import { useContext } from "react";
import type { NextPage } from "next";
import { AuthContext } from "../context/auth";
import { ModalContext } from "../context/modal";
import Navbar from "../components/Navbar";
import Panel from "../components/Panel";
import AccountCard from "../components/Cards/AccountCard";
import AccountPlaceholder from "../components/Placeholders/AccountPlaceholder";
import { IAccountCard } from "../types";

const SettingsPage: NextPage = () => {
    const {
        address,
        accessToken,
        primaryProfile,
        isCreatingProfile,
        profiles
    } = useContext(AuthContext);
    const { handleModal } = useContext(ModalContext);

    return (
        <div className="container">
            <Navbar />
            <div className="wrapper">
                <div className="wrapper-content">
                    <h1>Settings</h1>
                    <hr></hr>
                    {
                        !(accessToken && address && primaryProfile?.profileID)
                            ? <div>You need to <strong>Sign in</strong> and <strong>Sign up</strong> to view details about your account.</div>
                            : (<div>
                                <h2>Account</h2>
                                <p>The list of all accounts associated to the wallet address.</p>
                                <div className="accounts">
                                    {
                                        profiles.length > 0 &&
                                        profiles.map((account: IAccountCard, index: number) => (
                                            <AccountCard
                                                key={index}
                                                profileID={account.profileID}
                                                handle={account.handle}
                                                avatar={account.avatar}
                                                metadata={account.metadata}
                                                isPrimary={account.isPrimary}
                                            />
                                        ))
                                    }
                                    {
                                        isCreatingProfile &&
                                        <AccountPlaceholder />
                                    }
                                </div>
                                <br></br>
                                <br></br>
                                <h2>Middlewares</h2>
                                <div className="middleware">
                                    <div>
                                        <h2>Subscribe</h2>
                                        <p>Set the middleware for your profile to be either <strong>FREE</strong> or <strong>PAID</strong> when users subscribe to it.</p>
                                    </div>
                                    <button
                                        className="middleware-btn"
                                        onClick={() => handleModal("subscribe-mw", "")}
                                    >Set Subscribe MW</button>
                                </div>
                                <div className="middleware">
                                    <div>
                                        <h2>Essence</h2>
                                        <p>Set the middleware for your posts to be either <strong>FREE</strong> or <strong>PAID</strong> when users collect them.</p>
                                    </div>
                                    <button
                                        className="middleware-btn"
                                        onClick={() => handleModal("essence-mw", "")}
                                    >Set Essence MW</button>
                                </div>
                                <br></br>
                                <br></br>
                            </div>)
                    }
                </div>
                <div className="wrapper-details">
                    <Panel />
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
