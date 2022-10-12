import axios from "axios";
import { IProfileMetadata } from "../types";

const apiKey = process.env.REACT_APP_PINATA_API_KEY;
const apiSecret = process.env.REACT_APP_PINATA_API_SECRET;

export const pinJSONToIPFS = async (json: IProfileMetadata) => {
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
