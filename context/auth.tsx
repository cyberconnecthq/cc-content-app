import { ReactNode, createContext, useState, useEffect } from "react";
import { Web3Provider } from "@ethersproject/providers";
import { CHAIN_ID } from "../helpers/constants";
import { IAuthContext } from "../types";;

export const AuthContext = createContext<IAuthContext>({
    provider: undefined,
    address: undefined,
    accessToken: undefined,
    profileID: undefined,
    setProvider: () => { },
    setAddress: () => { },
    setAccessToken: () => { },
    setProfileID: () => { },
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
    const [profileID, setProfileID] = useState<number | undefined>(undefined);

    /* State variable to store the handle */
    const [handle, setHandle] = useState<string | undefined>(undefined);

    /* State variable to store the access token */
    const [accessToken, setAccessToken] = useState<string | undefined>(undefined);

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
                profileID,
                setProvider,
                setAddress,
                setAccessToken,
                setProfileID,
                checkNetwork,
            }}>
            {children}
        </AuthContext.Provider>
    );
};

