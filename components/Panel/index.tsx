import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "../../context/auth";
import { ModalContext } from "../../context/modal";
import SigninBtn from "../../components/Buttons/SigninBtn";
import PrimaryProfileCard from "../Cards/PrimaryProfileCard";
import { useLazyQuery } from "@apollo/client";
import { PROFILES_BY_IDS } from "../../graphql";
import { SUGGESTED_PROFILES } from "../../helpers/constants";
import SuggestedProfileCard from "../Cards/SuggestedProfileCard";
import { IProfileCard } from "../../types";

const Panel = () => {
	const { accessToken, primaryProfile, address } = useContext(AuthContext);
	const { handleModal } = useContext(ModalContext);
	const [getProfilesByIDs] = useLazyQuery(PROFILES_BY_IDS);
	const [profiles, setProfiles] = useState<IProfileCard[]>([]);
	const router = useRouter();

	useEffect(() => {
		const getProfiles = async () => {
			const { data } = await getProfilesByIDs({
				variables: {
					profileIDs: [15, 16, 44, 5, 227],
					myAddress: address,
				},
			});
			setProfiles([...data.profilesByIDs]);
		};

		if (accessToken && address) {
			getProfiles();
		} else {
			setProfiles(SUGGESTED_PROFILES);
		}
	}, [accessToken, address]);

	return (
		<div className="panel">
			<div>
				{primaryProfile && <PrimaryProfileCard {...primaryProfile} />}
				<div>
					{!accessToken && <SigninBtn />}
					{!primaryProfile?.profileID && (
						<button
							className="signup-btn"
							onClick={() => router.push("https://testnet.cyberconnect.me/")}
						>
							Mint Profile
						</button>
					)}
				</div>
			</div>
			<div className="panel-profiles">
				<h2>Who to subscribe</h2>
				{profiles.length > 0 &&
					profiles.map((profile) => (
						<SuggestedProfileCard key={profile.profileID} {...profile} />
					))}
			</div>
		</div>
	);
};

export default Panel;
