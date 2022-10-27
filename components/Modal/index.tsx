import React, { useContext, MouseEvent } from "react";
import { ModalContext } from "../../context/modal";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { TiWarning } from "react-icons/ti";
import SignupForm from "../Forms/SignupForm";
import PostForm from "../Forms/PostForm";
import EssenceMwForm from "../Forms/EssenceMwForm";
import SubscribeMwForm from "../Forms/SubscribeMwForm";

const Modal = () => {
    const { modal, modalType, modalText, handleModal } = useContext(ModalContext);

    const handleOnClick = (event: MouseEvent) => {
        const target = event.target as HTMLDivElement;
        if (target.className === "modal") {
            handleModal(null, "");
        }
    }

    const render = (type: string | null): any => {
        switch (type) {
            case "success":
                return (
                    <div className="modal-success">
                        <BsFillCheckCircleFill />
                        <div><strong>Success</strong>: {modalText}</div>
                    </div>
                );
            case "error":
                return (
                    <div className="modal-error">
                        <TiWarning />
                        <div><strong>Error</strong>: {modalText}</div>
                    </div>
                );
            case "signup":
                return (
                    <div className="modal-signup">
                        <SignupForm />
                    </div>
                );
            case "post":
                return (
                    <div className="modal-post">
                        <PostForm />
                    </div>
                );
            case "essence-mw":
                return (
                    <div className="modal-essence-mw">
                        <EssenceMwForm />
                    </div>
                );
            case "subscribe-mw":
                return (
                    <div className="modal-subscribe-mw">
                        <SubscribeMwForm />
                    </div>
                );
            default:
                return null;
        }
    }

    return (
        <>
            {
                modal &&
                <div className="modal" onClick={handleOnClick}>
                    <div className="modal-wrapper">
                        <button className="modal-close-btn" onClick={() => handleModal(null, "")}>x</button>
                        {render(modalType)}
                    </div>
                </div>
            }
        </>
    );
};

export default Modal;
