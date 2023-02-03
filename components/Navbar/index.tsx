import { useContext } from "react";
import Link from "next/link";
import { IoSparklesOutline } from "react-icons/io5";
import { FiSettings } from "react-icons/fi";
import { MdOutlineDashboard } from "react-icons/md";
import { MdHistoryEdu } from "react-icons/md";
import { useRouter } from "next/router";
import { AuthContext } from "../../context/auth";
import { ModalContext } from "../../context/modal";

const Navbar = () => {
	const { accessToken, primaryProfile } = useContext(AuthContext);
	const { handleModal } = useContext(ModalContext);
	const router = useRouter();

	const handleOnClick = () => {
		if (!accessToken) {
			handleModal("error", "You need to Sign in.");
		} else if (!primaryProfile?.profileID) {
			handleModal("error", "You need to Mint a profile.");
		} else {
			handleModal("post", "");
		}
	};

	return (
		<nav className="navbar">
			<div>
				<Link href="/">
					<div className={`navbar-link ${router.pathname === "/" && "active"}`}>
						{<MdOutlineDashboard />}
					</div>
				</Link>
				<Link href="/posts">
					<div
						className={`navbar-link ${router.pathname === "/posts" && "active"
							}`}
					>
						{<IoSparklesOutline />}
					</div>
				</Link>
				<Link href="/settings">
					<div
						className={`navbar-link ${router.pathname === "/settings" && "active"
							}`}
					>
						{<FiSettings />}
					</div>
				</Link>
				<hr></hr>
				<button className="create-btn center" onClick={handleOnClick}>
					{<MdHistoryEdu />}
				</button>
			</div>
		</nav>
	);
};

export default Navbar;
