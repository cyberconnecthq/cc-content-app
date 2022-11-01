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
    const { address } = useContext(AuthContext);
    const { handleModal } = useContext(ModalContext);
    const router = useRouter();

    return (
        <nav className="navbar">
            <div></div>
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
                <button
                    className="create-btn center"
                    onClick={() => handleModal("post", "")}
                >{<MdHistoryEdu />}</button>
            </div>
            <div className="navbar-address">
                <Link href="/settings">
                    {
                        address &&
                        <div className="center">{`${address.slice(0, 4)}..`}</div>
                    }
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
