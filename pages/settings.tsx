import React, { useMemo, useContext, } from "react";
import type { NextPage } from "next";
import { AuthContext } from "../context/auth";
import Navbar from "../components/Navbar";
import Panel from "../components/Panel";
import { useQuery } from "@apollo/client";
import { USER_INFO_BY_ADDRESS } from "../graphql";
import { AccountCard } from "../components/Cards/AccountCard";
import { IAccountCard } from "../types";

const SettingsPage: NextPage = () => {
    const { address, accessToken } = useContext(AuthContext);
    const { data } = useQuery(USER_INFO_BY_ADDRESS, {
        variables: { address },
    });

    const accounts = useMemo(() => {
        const edges = data?.address?.goerliWallet?.profiles?.edges;
        const accounts = edges?.map((edge: any) => edge?.node);
        return accounts || [];
    }, [data]);

    return (
        <div>
            <div className="container">
                <Navbar />
                <div className="wrapper">
                    <div className="wrapper-content">
                        <h1>Settings</h1>
                        <hr></hr>
                        {
                            !(accessToken && address)
                                ? <div>You need to <strong>Sign in</strong> or <strong>Sign up</strong> to view details about your account.</div>
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
                                    <h2>Subscribe middelware</h2>
                                    <p>You can set the middleware to </p>
                                    <br></br>
                                    <h2>Collect middelware</h2>
                                    <p>You can set the middleware to </p>
                                </div>)
                        }
                    </div>
                    <div className="wrapper-details">
                        <Panel />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
