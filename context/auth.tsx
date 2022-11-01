import { ReactNode, createContext, useState, useEffect } from "react";
import { Web3Provider } from "@ethersproject/providers";
import { ethers } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";
import { ExternalProvider } from "@ethersproject/providers";
import { CHAIN_ID } from "../helpers/constants";
import { IAuthContext, IPrimaryProfileCard, IPostCard, IAccountCard } from "../types";;
import { ADDRESS } from "../graphql";
import { useCancellableQuery } from "../hooks/useCancellableQuery";
import { timeout } from "../helpers/functions";

export const AuthContext = createContext<IAuthContext>({
    address: undefined,
    accessToken: undefined,
    primaryProfile: undefined,
    isCreatingProfile: false,
    isCreatingPost: false,
    profileCount: 0,
    postCount: 0,
    posts: [],
    profiles: [],
    setAddress: () => { },
    setAccessToken: () => { },
    setPrimaryProfile: () => { },
    setIsCreatingProfile: () => { },
    setIsCreatingPost: () => { },
    setProfileCount: () => { },
    setPostCount: () => { },
    setPosts: () => { },
    setProfiles: () => { },
    connectWallet: async () => new Promise(() => { }),
    checkNetwork: async () => new Promise(() => { }),
});
AuthContext.displayName = "AuthContext";

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    /* State variable to store the provider */
    const [provider, setProvider] = useState<Web3Provider | undefined>(undefined);

    /* State variable to store the address */
    const [address, setAddress] = useState<string | undefined>(undefined);

    /* State variable to store the access token */
    const [accessToken, setAccessToken] = useState<string | undefined>(undefined);

    /* State variable to store the primary profile */
    const [primaryProfile, setPrimaryProfile] = useState<IPrimaryProfileCard | undefined>(undefined);

    /* State variable to store the initial number of accounts */
    const [profileCount, setProfileCount] = useState<number>(0);

    /* State variable to store the initial number of posts */
    const [postCount, setPostCount] = useState<number>(0);

    /* State variable to store the tokenURI for post created */
    const [isCreatingProfile, setIsCreatingProfile] = useState<boolean>(false);

    /* State variable to store the tokenURI for post created */
    const [isCreatingPost, setIsCreatingPost] = useState<boolean>(false);

    /* State variable to store the posts */
    const [posts, setPosts] = useState<IPostCard[]>([]);

    /* State variable to store the profiles */
    const [profiles, setProfiles] = useState<IAccountCard[]>([]);

    useEffect(() => {
        /* Check if the user connected with wallet */
        if (!(provider && address)) return;

        try {
            /* Function to check if the network is the correct one */
            checkNetwork(provider);
        } catch (error) {
            /* Display error message */
            alert(error.message);
        }
    }, [provider, address]);

    useEffect(() => {
        if (!(address && accessToken)) return;

        let query: any;
        let counter: number = 0;

        const fetchData = async () => {
            try {
                /* Fetch data */
                query = useCancellableQuery({
                    query: ADDRESS,
                    variables: {
                        address: address,
                        chainID: CHAIN_ID
                    },
                });
                const res = await query;

                /* Get the primary profile */
                const primaryProfile = res?.data?.address?.wallet?.primaryProfile;

                /* Get the posts */
                const edgesPosts = primaryProfile?.essences?.edges;
                const posts = edgesPosts?.map((edge: any) => edge?.node) || [];

                /* Get the profiles */
                const edgesProfiles = res?.data?.address?.wallet?.profiles?.edges;
                const profiles = edgesProfiles?.map((edge: any) => edge?.node) || [];

                if (!isCreatingProfile && !isCreatingPost) {
                    /* Get the total count of essences */
                    const postCount = primaryProfile?.essences?.totalCount;

                    /* Get the total count of profiles */
                    const profileCount = profiles.length;

                    /* Set the profile ID variable*/
                    setPrimaryProfile(primaryProfile);

                    /* Set the posts */
                    setPosts(posts);

                    /* Set the profiles */
                    setProfiles(profiles);

                    /* Set the initial number of posts */
                    setPostCount(postCount);

                    /* Set the initial number of accounts */
                    setProfileCount(profileCount);
                } else {
                    /* Get the updated count of essences */
                    const updatedPostCount = primaryProfile?.essences?.totalCount;

                    /* Get the updated count of profiles */
                    const updatedProfileCount = profiles.length;

                    if (postCount !== updatedPostCount) {
                        const latestPost = primaryProfile?.essences?.edges[updatedPostCount - 1]?.node;

                        /* Reset the isCreatingPost in the state variable */
                        setIsCreatingPost(false);

                        /* Set the posts in the state variable */
                        setPosts([...posts, latestPost]);

                        /* Set the post count in the state variable */
                        setPostCount(updatedPostCount);

                    } else if (profileCount !== updatedProfileCount) {
                        const latestProfile = profiles[updatedProfileCount - 1];

                        /* Reset the isCreatingProfile in the state variable */
                        setIsCreatingProfile(false);

                        /* Set the profiles in the state variable */
                        setProfiles([...profiles, latestProfile]);

                        /* Set the profiles count in the state variable */
                        setProfileCount(updatedProfileCount);

                    } else {
                        /* Data hasn't been indexed try to fetch again after 2s */
                        if (counter < 150) {
                            /* Wait 2s before fetching data again */
                            counter++;
                            console.log("Fetching data again.");
                            await timeout(2000);
                            fetchData();
                        } else {
                            /* Cancel the query */
                            query.cancel();
                            console.log("Fetching data cancelled.");

                            /* Reset the isCreatingPost in the state variable */
                            setIsCreatingPost(false);

                            /* Reset the isCreatingProfile in the state variable */
                            setIsCreatingProfile(false);
                        }
                    }
                }
            } catch (error) {
                /* Reset the isCreatingPost in the state variable */
                setIsCreatingPost(false);

                /* Reset the isCreatingProfile in the state variable */
                setIsCreatingProfile(false);

                console.error(error);
            }
        }
        fetchData();

        return () => {
            if (query) {
                query.cancel();
            }
        }
    }, [address, accessToken, postCount, profileCount, isCreatingPost, isCreatingProfile,]);

    /* Function to connect with MetaMask wallet */
    const connectWallet = async () => {
        try {
            /* Function to detect most providers injected at window.ethereum */
            const detectedProvider = (await detectEthereumProvider()) as ExternalProvider;

            /* Check if the Ethereum provider exists */
            if (!detectedProvider) {
                throw new Error("Please install MetaMask!");
            }

            /* Ethers Web3Provider wraps the standard Web3 provider injected by MetaMask */
            const web3Provider = new ethers.providers.Web3Provider(detectedProvider);

            /* Connect to Ethereum. MetaMask will ask permission to connect user accounts */
            await web3Provider.send("eth_requestAccounts", []);

            /* Get the signer from the provider */
            const signer = web3Provider.getSigner();

            /* Get the address of the connected wallet */
            const address = await signer.getAddress();

            /* Set the providers in the state variables */
            setProvider(web3Provider);

            /* Set the address in the state variable */
            setAddress(address);

            return web3Provider;
        } catch (error) {
            /* Throw the error */
            throw error;
        }
    }

    /* Function to check if the network is the correct one */
    const checkNetwork = async (provider: Web3Provider) => {
        try {
            /* Get the network from the provider */
            const network = await provider.getNetwork();

            /* Check if the network is the correct one */
            if (network.chainId !== CHAIN_ID) {
                /* Switch network if the chain id doesn't correspond to Goerli Testnet Network */
                await provider.send("wallet_switchEthereumChain", [{ chainId: "0x" + CHAIN_ID.toString(16) }]);

                /* Trigger a page reload */
                window.location.reload();
            }
        } catch (error) {
            /* This error code indicates that the chain has not been added to MetaMask */
            if (error.code === 4902) {
                await provider.send("wallet_addEthereumChain", [{ chainId: "0x" + CHAIN_ID.toString(16), rpcUrls: ["https://goerli.infura.io/v3/"] }]);

                /* Trigger a page reload */
                window.location.reload();
            } else {
                /* Throw the error */
                throw error;
            }
        }
    }

    return (
        <AuthContext.Provider
            value={{
                address,
                accessToken,
                primaryProfile,
                profileCount,
                postCount,
                posts,
                profiles,
                isCreatingProfile,
                isCreatingPost,
                setAddress,
                setAccessToken,
                setPrimaryProfile,
                setProfileCount,
                setPostCount,
                setIsCreatingProfile,
                setIsCreatingPost,
                setPosts,
                setProfiles,
                checkNetwork,
                connectWallet
            }}>
            {children}
        </AuthContext.Provider>
    );
};

