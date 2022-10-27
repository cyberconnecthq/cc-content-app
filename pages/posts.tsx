import React, { useContext, useEffect, useState } from "react";
import type { NextPage } from "next";
import { AuthContext } from "../context/auth";
import { useLazyQuery } from "@apollo/client";
import { ADDRESS } from "../graphql";
import Navbar from "../components/Navbar";
import Panel from "../components/Panel";
import PostCard from "../components/Cards/PostCard";
import PostPlaceholder from "../components/Placeholders/PostPlaceholder";
import { timeout } from "../helpers/functions";
import { IPostCard } from "../types";
import { CHAIN_ID } from "../helpers/constants";
import { parseURL } from "../helpers/functions";

const PostPage: NextPage = () => {
    const { address, accessToken, postCount, isCreatingPost, setIsCreatingPost, setPostCount } = useContext(AuthContext);
    const [posts, setPosts] = useState<IPostCard[]>(
        [
            {
                avatar: "https://gateway.pinata.cloud/ipfs/QmNcqSpCvhiyHocUaVf7qB8qwEGerSpnELeAi567YEraYm",
                handle: "ccprotocol",
                name: "CyberConnect",
                profileID: 15,
                essenceID: 2,
                tokenURI: "https://cyberconnect.mypinata.cloud/ipfs/Qmd7G1BVZ3EQ3w2mNWBqgi4DaRrnkv5thy5UR1ParwM7AG"
            },
            {
                avatar: "https://gateway.pinata.cloud/ipfs/QmNcqSpCvhiyHocUaVf7qB8qwEGerSpnELeAi567YEraYm",
                handle: "ccprotocol",
                name: "CyberConnect",
                profileID: 15,
                essenceID: 1,
                tokenURI: "https://cyberconnect.mypinata.cloud/ipfs/QmWBjgu6Mhx1txRfzKkemoQDHjgmuwCJBp3HNUB7vZFi5F"
            },
            {
                avatar: "https://gateway.pinata.cloud/ipfs/QmV1ZVcyC96g1HYsxXgG6BP6Kc8xrZCBqj7PNkvxhPwLoz",
                handle: "snowdot",
                name: "Snowdot",
                profileID: 44,
                essenceID: 5,
                tokenURI: "https://cyberconnect.mypinata.cloud/ipfs/QmRgQ55r3Q2Wwfy2VnBrfAq3GYATyUn8ww55AghdGvro6M"
            },
            {
                avatar: "https://gateway.pinata.cloud/ipfs/QmV1ZVcyC96g1HYsxXgG6BP6Kc8xrZCBqj7PNkvxhPwLoz",
                handle: "snowdot",
                name: "Snowdot",
                profileID: 44,
                essenceID: 6,
                tokenURI: "https://cyberconnect.mypinata.cloud/ipfs/QmPgYgEvv32v8U1SZUh33f1A6zyTPtyKimGosznVhUwsVQ"
            },
        ]
    );

    /* State variable for the primary account */
    const [primaryAccount, setPrimaryAccount] = useState<any>();

    /* Query to get user information by wallet address */
    const [getAddress, { data, refetch }] = useLazyQuery(ADDRESS);

    useEffect(() => {
        if (!(address && accessToken)) return;

        (async () => {
            /* Get all profile for the wallet address */
            const res = await getAddress({
                variables: {
                    address: address,
                    chainID: CHAIN_ID
                },
            });
            const edges = res?.data?.address?.wallet?.profiles?.edges;
            const accounts = edges?.map((edge: any) => edge?.node) || [];

            /* Get the primary profile */
            const primaryAccount = accounts?.find((account: any) => account?.isPrimary);

            /* Set the state for the primary account */
            setPrimaryAccount(primaryAccount);
        })();
    }, [address, accessToken]);


    useEffect(() => {
        let isMounted = true;
        let counter = 0;

        /* Function to fetch user profiles */
        async function refetchPosts() {
            if (!isMounted) return;
            if (!data) return;
            if (!setIsCreatingPost) return;

            try {
                /* Refetch the information */
                await refetch();

                /* Get all the accounts */
                const edges = data?.address?.wallet?.profiles?.edges;
                const accounts = edges?.map((edge: any) => edge?.node) || [];

                /* Get the primary profile */
                const primaryAccount = accounts?.find((account: any) => account?.isPrimary);

                /* Get the new count */
                const newPostCount = primaryAccount?.essences?.totalCount;

                /* Check of the initial number of accounts */
                if (postCount !== newPostCount) {
                    const accountRes = await fetch(parseURL(primaryAccount?.metadata))
                    const accountData = await accountRes.json();
                    const latestPost = primaryAccount?.essences?.edges[postCount - 1];

                    const post = {
                        avatar: primaryAccount?.avatar,
                        name: accountData?.name,
                        handle: primaryAccount?.handle,
                        profileID: primaryAccount?.profileID,
                        essenceID: latestPost?.node?.essenceID,
                        tokenURI: latestPost?.node?.tokenURI
                    }

                    /* Reset the isCreatingPost in the state variable */
                    setIsCreatingPost(false);

                    /* Set the accounts in the state variable */
                    setPosts([...posts, post]);

                    /* Set the post count in the state variable */
                    setPostCount(newPostCount);
                } else {
                    /* Stop fetching after 5 mins */
                    if (counter < 100) {
                        await timeout(3000);
                        refetchPosts();
                        counter++;
                    } else {
                        /* Reset the isCreatingPost in the state variable */
                        setIsCreatingPost(false);
                    }
                }
            } catch (error) {
                /* Reset the isCreatingPost in the state variable */
                setIsCreatingPost(false);
                console.error(error);
            }
        }
        refetchPosts();

        /* Cleanup function */
        return () => {
            isMounted = false;
        }
    }, [data, posts, setIsCreatingPost]);


    return (
        <div className="container">
            <Navbar />
            <div className="wrapper">
                <div className="wrapper-content">
                    <h1>Posts</h1>
                    <hr></hr>
                    <div className="posts">
                        {
                            posts.length > 0 &&
                            posts.map((post, index) => (
                                <PostCard
                                    key={index}
                                    essenceID={post.essenceID}
                                    profileID={post.profileID}
                                    tokenURI={post.tokenURI}
                                    avatar={post.avatar}
                                    handle={post.handle}
                                    name={post.name}
                                />
                            ))
                        }
                        {
                            isCreatingPost &&
                            <PostPlaceholder />
                        }
                    </div>
                </div>
                <div className="wrapper-details">
                    <Panel />
                </div>
            </div>
        </div>
    );
};

export default PostPage;
