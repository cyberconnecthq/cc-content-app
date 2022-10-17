import { useContext } from "react";
import Link from "next/link";
import Logo from "../Logo";
import { IoSparklesOutline } from "react-icons/io5";
import { FiSettings } from "react-icons/fi";
import { MdOutlineDashboard } from "react-icons/md";
import { MdHistoryEdu } from "react-icons/md";
import { useRouter } from "next/router";
import { AuthContext } from "../../context/auth";

const Navbar = () => {
    const { address } = useContext(AuthContext);
    const router = useRouter();

    return (
        <nav className="navbar">
            <Logo />
            <div>
                <Link href="/">
                    <div className={`navbar-link ${router.pathname === "/" && "active"}`}>{<MdOutlineDashboard />}</div>
                </Link>
                <Link href="/posts">
                    <div className={`navbar-link ${router.pathname === "/posts" && "active"}`}>{<IoSparklesOutline />}</div>
                </Link>
                <Link href="/settings">
                    <div className={`navbar-link ${router.pathname === "/settings" && "active"}`}>{<FiSettings />}</div>
                </Link>
                <hr></hr>
                <Link href="/create">
                    <div className="create-btn center">{<MdHistoryEdu />}</div>
                </Link>
            </div>
            <div className="navbar-address">
                {
                    address &&
                    <div className="center">{`${address.slice(0, 4)}..`}</div>
                }
            </div>
        </nav>
    );
};

export default Navbar;
