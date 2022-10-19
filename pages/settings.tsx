import React, { useMemo, useContext, } from "react";
import type { NextPage } from "next";
import { AuthContext } from "../context/auth";
import Navbar from "../components/Navbar";
import Panel from "../components/Panel";
import SetSubscribeBtn from "../components/Buttons/SetSubscribeBtn";
import SetEssenceBtn from "../components/Buttons/SetEssenceBtn";
import { useQuery } from "@apollo/client";
import { USER_INFO_BY_ADDRESS } from "../graphql";
import { AccountCard } from "../components/Cards/AccountCard";
import { IAccountCard } from "../types";

const SettingsPage: NextPage = () => {
    const { address, accessToken, profileID } = useContext(AuthContext);
    const { data } = useQuery(USER_INFO_BY_ADDRESS, {
        variables: { address },
    });

    const accounts = useMemo(() => {
        const edges = data?.address?.goerliWallet?.profiles?.edges;
        const accounts = edges?.map((edge: any) => edge?.node);
        return accounts || [];
    }, [data]);

    return (
        <div className="container">
            <Navbar />
            <div className="wrapper">
                <div className="wrapper-content">
                    <h1>Settings</h1>
                    <hr></hr>
                    {
                        !(accessToken && address && profileID)
                            ? <div>You need to <strong>Sign in</strong> and <strong>Sign up</strong> to view details about your account.</div>
                            : (<div>
                                <h2>Account</h2>
                                <p>The list of all accounts associated to the wallet address.</p>
                                <div className="accounts">
                                    {
                                        accounts.length > 0 &&
                                        accounts.map((account: IAccountCard) => (
                                            <AccountCard
                                                key={account.profileID}
                                                profileID={account.profileID}
                                                handle={account.handle}
                                                avatar={account.avatar}
                                                metadata={account.metadata}
                                                isPrimary={account.isPrimary}
                                            />
                                        ))
                                    }
                                </div>
                                <br></br>
                                <h2>Subscribe middleware</h2>
                                <div className="middleware">
                                    <p>Set <strong>PAID</strong> Subscribe middleware. Subscribers will be able to subscribe to your profile if they <strong>pay 1 LINK</strong>.</p>
                                    <div></div>
                                    <SetSubscribeBtn option="paid" />
                                </div>
                                <div className="middleware">
                                    <p>Set <strong>FREE</strong> Subscribe middleware. Subscribers will be able to subscribe to your profile for <strong>free</strong>.</p>
                                    <div></div>
                                    <SetSubscribeBtn option="free" />
                                </div>
                                <br></br>
                                <h2>Essence middleware</h2>
                                <div className="middleware">
                                    <p>Set <strong>PAID</strong> Collect middleware. Collectors will will be able to collect your essence (post) if they <strong>pay 1 LINK</strong>.</p>
                                    <div></div>
                                    <SetEssenceBtn option="paid" />
                                </div>
                                <div className="middleware">
                                    <p>Set <strong>FREE</strong> Collect  middleware. Collectors will be able to collect your essence (post) for <strong>free</strong>.</p>
                                    <div></div>
                                    <SetEssenceBtn option="free" />
                                </div>
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
