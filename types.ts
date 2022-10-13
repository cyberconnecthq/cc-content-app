import { Web3Provider } from "@ethersproject/providers";

export interface IAuthContext {
    provider: Web3Provider | undefined;
    address: string | undefined;
    accessToken: string | undefined;
    profileID: number | undefined;
    setProvider: (provider: Web3Provider | undefined) => void;
    setAddress: (address: string | undefined) => void;
    setAccessToken: (accessToken: string | undefined) => void;
    setProfileID: (profileID: number | undefined) => void;
    checkNetwork: (provider: Web3Provider) => Promise<void>;
}

/* Metadata schema for Profile NFT */
export interface IProfileMetadata {
    name: string;
    bio: string;
    handle: string;
    version: string;
}
