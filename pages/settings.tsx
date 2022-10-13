import React, {
    useState,
    useEffect,
    useContext,
} from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { AuthContext } from "../context/auth";

const SettingsPage: NextPage = () => {
    const router = useRouter();
    const { address, profileID } = useContext(AuthContext);

    return (
        <div>
            <div className="settings-page">
                {
                    !(address && profileID) &&
                    <div>You need to Sign in or Sign up.</div>
                }
            </div>
        </div>
    );
};

export default SettingsPage;
