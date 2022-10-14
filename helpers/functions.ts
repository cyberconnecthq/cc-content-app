import axios from "axios";

const apiKey = process.env.NEXT_PUBLIC_API_KEY || "";
const apiSecret = process.env.NEXT_PUBLIC_API_SECRET || "";

export const pinJSONToIPFS = async (json: { [key: string]: any }) => {
    const data = JSON.stringify(json);
    const url = "https://api.pinata.cloud/pinning/pinJSONToIPFS";

    return axios
        .post(url, data, {
            headers: {
                "Content-Type": "application/json",
                pinata_api_key: apiKey,
                pinata_secret_api_key: apiSecret,
            },
        })
        .then((response) => response.data.IpfsHash)
        .catch((error) => {
            throw error;
        });
};

export const parseURL = (url: string) => {
    if (!url) return "";
    const str = url.substring(0, 4);

    if (str === "http") {
        return url;
    } else {
        return `https://cyberconnect.mypinata.cloud/ipfs/${url}`;
    }
};
