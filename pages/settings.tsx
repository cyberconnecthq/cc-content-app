import React, { useContext, useEffect, useState } from "react";
import type { NextPage } from "next";
import { AuthContext } from "../context/auth";
import Navbar from "../components/Navbar";
import Panel from "../components/Panel";
import SetSubscribeBtn from "../components/Buttons/SetSubscribeBtn";
import SetEssenceBtn from "../components/Buttons/SetEssenceBtn";
import { useLazyQuery } from "@apollo/client";
import { ADDRESS } from "../graphql";
import AccountCard from "../components/Cards/AccountCard";
import AccountPlaceholder from "../components/Placeholders/AccountPlaceholder";
import { IAccountCard } from "../types";
import { timeout } from "../helpers/functions";
import { CHAIN_ID } from "../helpers/constants";

const SettingsPage: NextPage = () => {
    const { address, accessToken, primayProfileID, isCreatingProfile, accountCount, setIsCreatingProfile, setAccountCount } = useContext(AuthContext);

    /* State variable to store the accounts */
    const [accounts, setAccounts] = useState<IAccountCard[]>([]);

    /* Query to get user information by wallet address */
    const [getAddress, { data, refetch }] = useLazyQuery(ADDRESS);

    useEffect(() => {
        if (!address) return;

        (async () => {
            /* Get all profile for the wallet address */
            const res = await getAddress({
                variables: {
                    address: address,
                    chainID: CHAIN_ID
                },
            });
            const edges = res?.data?.address?.wallet?.profiles?.edges;
            const profiles = edges?.map((edge: any) => edge?.node) || [];

            /* Set the profile accounts */
            setAccounts(profiles);
        })();
    }, [address]);

    useEffect(() => {
        let isMounted = true;
        let counter = 0;

        /* Function to fetch user profiles */
        async function refetchAccounts() {
            if (!isMounted) return;
            if (!data) return;
            if (!isCreatingProfile) return;

            try {
                /* Refetch the information */
                await refetch();

                /* Get the new count */
                const newAccountCount = data?.wallet?.profiles?.totalCount;

                /* Check of the initial number of accounts */
                if (accountCount !== newAccountCount) {
                    /* Get the profiles */
                    const edges = data?.address?.wallet?.profiles?.edges;
                    const accounts = edges?.map((edge: any) => edge?.node) || [];

                    /* Reset the isCreatingProfile in the state variable */
                    setIsCreatingProfile(false);

                    /* Set the accounts in the state variable */
                    setAccounts(accounts);

                    /* Set the account count in the state variable */
                    setAccountCount(newAccountCount);
                } else {
                    /* Stop fetching after 5 mins */
                    if (counter < 100) {
                        await timeout(3000);
                        refetchAccounts();
                        counter++;
                    } else {
                        /* Reset the isCreatingProfile in the state variable */
                        setIsCreatingProfile(false);
                    }
                }
            } catch (error) {
                /* Reset the isCreatingProfile in the state variable */
                setIsCreatingProfile(false);
                console.error(error);
            }
        }
        refetchAccounts();

        /* Cleanup function */
        return () => {
            isMounted = false;
        }
    }, [address, data, accountCount, isCreatingProfile]);


    return (
        <div className="container">
            <Navbar />
            <div className="wrapper">
                <div className="wrapper-content">
                    <h1>Settings</h1>
                    <hr></hr>
                    {
                        !(accessToken && address && primayProfileID)
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
