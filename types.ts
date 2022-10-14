import { Web3Provider } from "@ethersproject/providers";

export interface IAuthContext {
    provider: Web3Provider | undefined;
    address: string | undefined;
    accessToken: string | undefined;
    profileID: number | undefined;
    handle: string | undefined;
    setProvider: (provider: Web3Provider | undefined) => void;
    setAddress: (address: string | undefined) => void;
    setAccessToken: (accessToken: string | undefined) => void;
    setProfileID: (profileID: number | undefined) => void;
    setHandle: (handle: string | undefined) => void;
    checkNetwork: (provider: Web3Provider) => Promise<void>;
}

/* Metadata schema for Profile NFT */
export interface IProfileMetadata {
    name: string;
    bio: string;
    handle: string;
    version: string;
}

/* Metadata schema for Content NFT */
export enum Version {
    V1 = "1.0.0",
}

export interface Media {
    /* The MIME type for the media */
    media_type: string;
    /* The URL link for the media */
    media_url: string;
    /* Alternative text when media can't be rendered */
    alt_tag?: string;
    /* The preview image for the media */
    preview_image_url?: string;
}

export interface Metadata {
    /* ~~ REQUIRED ~~ */
    /* Version of the metadata schema used for the issued item. */
    version: Version;

    /* ~~ OPTIONAL ~~ */
    /* Id of the application under which the items are being minted. */
    app_id?: string;

    /* Language of the content as a BCP47 language tag. */
    lang?: string;

    /* Creation time of the item as ISO 8601. */
    issue_date?: string;

    /* The content associated with the item */
    content?: string;

    /* Media refers to any image, video, or any other MIME type attached to the content.
    Limited to max. 10 media objects. */
    media?: Media[];

    /* Field indicating the tags associated with the content. Limited to max. 5 tags. */
    tags?: string[];

    /* ~~ OPENSEA (optional) ~~ */
    /* URL to the image of the item. */
    image?: string;

    /* SVG image data when the image is not passed. Only use this if you're not including the image parameter. */
    image_data?: string;

    /* Name of the item. */
    name?: string;

    /* Description of the item. */
    description?: string;

    /* URL to a multi-media attachment for the item. */
    animation_url?: string;
}

export interface IProfileCard {
    handle: string;
    avatar: string;
    metadata: string;
    profileID: number;
}
