import React, { useMemo, useContext, useEffect, useState } from "react";
import type { NextPage } from "next";
import { AuthContext } from "../context/auth";
import Navbar from "../components/Navbar";
import Panel from "../components/Panel";
import SetSubscribeBtn from "../components/Buttons/SetSubscribeBtn";
import SetEssenceBtn from "../components/Buttons/SetEssenceBtn";
import { useLazyQuery } from "@apollo/client";
import { USER_INFO_BY_ADDRESS } from "../graphql";
import AccountCard from "../components/Cards/AccountCard";
import AccountPlaceholder from "../components/Placeholders/AccountPlaceholder";
import { IAccountCard } from "../types";
import { timeout } from "../helpers/functions";

const SettingsPage: NextPage = () => {
    const { address, accessToken, profileID, isCreatingProfile, initAccountCount, setIsCreatingProfile } = useContext(AuthContext);
    /* Query to get user information by wallet address */
    const [getUserInfoByAddress, { data, refetch }] = useLazyQuery(USER_INFO_BY_ADDRESS);

    /* State variable to store the accounts */
    const [accounts, setAccounts] = useState<IAccountCard[]>([]);

    useEffect(() => {
        if (!address) return;

        (async () => {
            /* Get all profile for the wallet address */
            const res = await getUserInfoByAddress({
                variables: {
                    address: address,
                },
            });
            const edges = res?.data?.address?.goerliWallet?.profiles?.edges;
            const profiles = edges?.map((edge: any) => edge?.node) || [];

            /* Set the profile accounts */
            setAccounts(profiles);
        })();
    }, [address]);

    useEffect(() => {
        let isMounted = true;

        /* Function to fetch user profiles */
        async function refetchAccounts() {
            if (!isMounted) return;
            if (!data) return;
            if (!isCreatingProfile) return;

            /* Refetch the information */
            await refetch();

            /* Check of the initial number of accounts */
            if (initAccountCount !== data?.address?.goerliWallet?.profiles?.totalCount) {
                /* Get the profiles */
                const edges = data?.address?.goerliWallet?.profiles?.edges;
                const profiles = edges?.map((edge: any) => edge?.node) || [];

                /* Set the isCreatingProfile in the state variable */
                setIsCreatingProfile(false);

                /* Set the accounts in the state variable */
                setAccounts(profiles);
            } else {
                await timeout(3000);
                refetchAccounts();
            }
        }
        refetchAccounts();

        /* Cleanup function */
        return () => {
            isMounted = false;
        }
    }, [address, accessToken, data, isCreatingProfile]);


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
                                    {
                                        isCreatingProfile &&
                                        <AccountPlaceholder />
                                    }
                                </div>
                                <br></br>
                                <h2>Subscribe middleware</h2>
                                <div className="middleware">
                                    <p>Set <strong>PAID</strong> Subscribe middleware. Subscribers will be able to subscribe to your profile if they <strong>pay 1 LINK</strong>.</p>
                                    <SetSubscribeBtn option="paid" />
                                </div>
                                <div className="middleware">
                                    <p>Set <strong>FREE</strong> Subscribe middleware. Subscribers will be able to subscribe to your profile for <strong>free</strong>.</p>
                                    <SetSubscribeBtn option="free" />
                                </div>
                                <br></br>
                                <h2>Essence middleware</h2>
                                <div className="middleware">
                                    <p>Set <strong>PAID</strong> Collect middleware. Collectors will will be able to collect your essence (post) if they <strong>pay 1 LINK</strong>.</p>
                                    <SetEssenceBtn option="paid" />
                                </div>
                                <div className="middleware">
                                    <p>Set <strong>FREE</strong> Collect  middleware. Collectors will be able to collect your essence (post) for <strong>free</strong>.</p>
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
