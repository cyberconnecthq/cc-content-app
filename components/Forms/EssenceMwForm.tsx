import {
	useState,
	MouseEvent,
	ChangeEvent,
	useContext,
	useEffect,
} from "react";
import { AuthContext } from "../../context/auth";
import { useLazyQuery } from "@apollo/client";
import { ADDRESS } from "../../graphql";
import { IEssenceMwCard } from "../../types";
import EssenceMwCard from "../Cards/EssenceMwCard";
import SetEssenceBtn from "../Buttons/SetEssenceBtn";
import { BsCaretUpFill, BsFillCaretDownFill } from "react-icons/bs";

const EssenceMwForm = () => {
	const { address, accessToken } = useContext(AuthContext);
	const [essenceMw, setEssenceMw] = useState<string>("free");

	/* State variable to store the essences */
	const [essences, setEssences] = useState<IEssenceMwCard[]>([]);

	/* State variable to store the selected essence */
	const [selectedEssence, setSelectedEssence] = useState({
		essenceID: 0,
		tokenURI: "",
	});

	/* State variable to store the selected essence */
	const [selectedEssenceContent, setSelectedEssenceContent] =
		useState<string>("");

	/* Query to get user information by wallet address */
	const [getAddress] = useLazyQuery(ADDRESS);

	const [showDropdown, setShowDropdown] = useState<boolean>(false);

	useEffect(() => {
		if (!(address && accessToken)) return;

		(async () => {
			/* Get the primary profile for the wallet address */
			const res = await getAddress({
				variables: {
					address: address,
				},
			});
			const primaryProfile = res?.data?.address?.wallet?.primaryProfile;
			const essences =
				primaryProfile?.essences?.edges?.map((edge: any) => edge?.node) || [];

			/* Set the essences */
			setEssences(essences);
		})();
	}, [address, accessToken, getAddress]);

	const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		setEssenceMw(value);
	};

	const handleOnClick = (event: MouseEvent) => {
		const target = event.target as HTMLDivElement;
		if (target.className !== "dropdown-select-btn") {
			setShowDropdown(false);
		}
	};

	return (
		<div className="form essence-mw-form" onClick={handleOnClick}>
			<h2>Set middleware for Post</h2>
			<label>Post</label>
			<div className="dropdown">
				<div className="dropdown-select">
					<div className="dropdown-select-post">
						{!selectedEssence ? "Select post" : `${selectedEssenceContent}`}
					</div>
					<div>
						{showDropdown ? <BsCaretUpFill /> : <BsFillCaretDownFill />}
					</div>
					<button
						className="dropdown-select-btn"
						onClick={() => setShowDropdown((prev) => !prev)}
					></button>
				</div>
				{showDropdown && (
					<div className="dropdown-options">
						{essences.map((essence: any, index: number) => (
							<EssenceMwCard
								key={index}
								essence={essence}
								selectedEssenceContent={selectedEssenceContent}
								setSelectedEssence={setSelectedEssence}
								setSelectedEssenceContent={setSelectedEssenceContent}
								setShowDropdown={setShowDropdown}
							/>
						))}
					</div>
				)}
			</div>
			<div className="form-post-middleware">
				<div>Middleware</div>
				<div>
					<label>
						<strong>FREE:</strong> users collect post for free
						<input
							type="radio"
							name="middleware"
							value="free"
							defaultChecked
							onChange={handleOnChange}
						/>
					</label>
					<label>
						<strong>PAID:</strong> users pay 1 LINK to collect
						<input
							type="radio"
							name="middleware"
							value="paid"
							onChange={handleOnChange}
						/>
					</label>
				</div>
			</div>
			<div className="form-note">
				<strong>Note:</strong> You will set the middleware for the selected
				post.
			</div>
			<SetEssenceBtn middleware={essenceMw} essence={selectedEssence} />
		</div>
	);
};

export default EssenceMwForm;
