import { ReactNode, createContext, useState, useEffect } from "react";
import { Web3Provider } from "@ethersproject/providers";
import { CHAIN_ID } from "../helpers/constants";
import { IAuthContext } from "../types";;
import { useLazyQuery } from "@apollo/client";
import { ADDRESS } from "../graphql";

export const AuthContext = createContext<IAuthContext>({
    provider: undefined,
    address: undefined,
    accessToken: undefined,
    primayProfileID: undefined,
    primaryHandle: undefined,
    isCreatingProfile: false,
    isCreatingPost: false,
    accountCount: 0,
    postCount: 0,
    setProvider: () => { },
    setAddress: () => { },
    setAccessToken: () => { },
    setPrimayProfileID: () => { },
    setPrimaryHandle: () => { },
    setIsCreatingProfile: () => { },
    setIsCreatingPost: () => { },
    setAccountCount: () => { },
    setPostCount: () => { },
    checkNetwork: async () => new Promise(() => { }),
});
AuthContext.displayName = "AuthContext";

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    /* State variable to store the provider */
    const [provider, setProvider] = useState<Web3Provider | undefined>(
        undefined
    );

    /* State variable to store the address */
    const [address, setAddress] = useState<string | undefined>(undefined);

    /* State variable to store the profile ID */
    const [primayProfileID, setPrimayProfileID] = useState<number | undefined>(undefined);

    /* State variable to store the handle */
    const [primaryHandle, setPrimaryHandle] = useState<string | undefined>(undefined);

    /* State variable to store the access token */
    const [accessToken, setAccessToken] = useState<string | undefined>(undefined);

    /* State variable to store the initial number of accounts */
    const [accountCount, setAccountCount] = useState<number>(0);

    /* State variable to store the initial number of posts */
    const [postCount, setPostCount] = useState<number>(0);

    /* State variable to store the tokenURI for post created */
    const [isCreatingProfile, setIsCreatingProfile] = useState<boolean>(false);

    /* State variable to store the tokenURI for post created */
    const [isCreatingPost, setIsCreatingPost] = useState<boolean>(false);


    /* Query to get user information by wallet address */
    const [getAddress] = useLazyQuery(ADDRESS);

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
            const accounts = edges?.map((edge: any) => edge?.node) || [];

            /* Get the primary profile */
            const primaryAccount = accounts?.find((account: any) => account?.isPrimary);

            /* Set the profile ID variable*/
            setPrimayProfileID(primaryAccount?.profileID);

            /* Set the primaryHandle variable */
            setPrimaryHandle(primaryAccount?.handle);

            /* Set the initial number of accounts */
            setAccountCount(accounts.length);

            /* Set the initial number of posts */
            setPostCount(primaryAccount?.essences?.totalCount || 0);
        })();
    }, [address]);

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
                provider,
                address,
                accessToken,
                primayProfileID,
                primaryHandle,
                accountCount,
                postCount,
                isCreatingProfile,
                isCreatingPost,
                setProvider,
                setAddress,
                setAccessToken,
                setPrimayProfileID,
                setPrimaryHandle,
                setAccountCount,
                setPostCount,
                setIsCreatingProfile,
                setIsCreatingPost,
                checkNetwork,
            }}>
            {children}
        </AuthContext.Provider>
    );
};

