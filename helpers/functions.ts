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

export const renderSVGData = (post: string) => {
    const svg = `
    <svg width="350" height="350" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <rect x="0" y="0" width="350" height="350" rx="8" fill="#fdf5f2" stroke="rgba(235, 87, 87, 0.3)" stroke-width="2" />
        <defs>
            <path id="path1" d="M20,10 H330 M20,40 H330 M20,70 H330 M20,100 H330 M20,130 H330 M20,160 H330 M20,190 H330 M20,220 H330 M20,250 H330 M20,280 H330"></path>
        </defs>
        <use xlink:href="#path1" x="0" y="35" stroke="transparent" stroke-width="1" />
        <text transform="translate(0,35)" fill="#000" font-size="20">
            <textPath xlink:href="#path1">${post}</textPath>
        </text>
    </svg>`;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
};
