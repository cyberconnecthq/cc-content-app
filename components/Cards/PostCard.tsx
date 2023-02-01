import React, { useEffect, useState } from "react";
import Image from "next/image";
import CollectBtn from "../Buttons/CollectBtn";
import { IPostCard } from "../../types";
import { parseURL, timeSince } from "../../helpers/functions";
import Loader from "../Loader";

const PostCard = ({ essenceID, tokenURI, createdBy, isCollectedByMe, isIndexed, collectMw }: IPostCard) => {
	const { avatar, handle, profileID, metadata } = createdBy;
	const [name, setName] = useState("");
	const [data, setData] = useState({
		image: "",
		image_data: "",
		content: "",
		issue_date: "",
		attributes: [],
	});
	const [avatarSrc, setAvatarSrc] = useState(parseURL(avatar));
	const [nftSrc, setNftSrc] = useState(data.image ? parseURL(data.image) : data.image_data);

	useEffect(() => {
		if (!tokenURI) return;
		(async () => {
			setData({
				image: "",
				image_data: "",
				content: "",
				issue_date: "",
				attributes: [],
			});
			try {
				const res = await fetch(parseURL(tokenURI));
				if (res.status === 200) {
					const data = await res.json();
					setData(data);
				}
			} catch (error) {
				console.error(error);
			}
		})();
	}, [tokenURI]);

	useEffect(() => {
		if (!metadata) return;
		(async () => {
			setName("");
			try {
				const res = await fetch(parseURL(metadata));
				if (res.status === 200) {
					const data = await res.json();
					setName(data?.name);
				}
			} catch (error) {
				console.error(error);
			}
		})();
	}, [metadata]);

	return (
		<>
			{
				data?.attributes?.length === 0 &&
				<div className="post-card">
					<div className="post-avatar center">
						<Image
							src={avatarSrc}
							alt="avatar"
							width={50}
							height={50}
							onError={() => setAvatarSrc("/assets/avatar-placeholder.svg")}
							placeholder="blur"
							blurDataURL="/assets/avatar-placeholder.svg"
						/>
					</div>
					<div className="post-profile">
						<div className="post-profile-details">
							<div className="post-profile-name">{name}</div>
							<div className="post-profile-handle">@{handle} •</div>
							<div className="post-profile-time">{timeSince(new Date(data.issue_date))}</div>
						</div>
						<div className="post-content">{JSON.stringify(data.content)}</div>
					</div>
					<div className="post-nft center">
						<Image
							src={nftSrc}
							alt="nft"
							width={350}
							height={350}
							onError={() => setNftSrc("/assets/essence-placeholder.svg")}
							placeholder="blur"
							blurDataURL="/assets/essence-placeholder.svg"
						/>
					</div>
					<div className="post-collect">
						{
							isIndexed
								? <CollectBtn
									profileID={profileID}
									essenceID={essenceID}
									isCollectedByMe={isCollectedByMe}
									collectMw={collectMw}
								/>
								: <Loader />
						}
					</div>
				</div>
			}
		</>
	);
};

export default PostCard;
