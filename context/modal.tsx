import React, { ReactNode, createContext } from "react";
import useModal from "../hooks/useModal";
import ModalContainer from "../components/Modal";
import { IModalContext } from "../types";

const ModalContext = createContext<IModalContext>({
    modal: false,
    modalType: null,
    modalText: "",
    handleModal: () => { },
});
ModalContext.displayName = "ModalContext";

const ModalContextProvider = ({ children }: { children: ReactNode }) => {
    const { modal, modalType, modalText, handleModal } = useModal();

    return (
        <ModalContext.Provider value={{ modal, modalType, modalText, handleModal }}>
            <ModalContainer />
            {children}
        </ModalContext.Provider>
    );
};

export { ModalContext, ModalContextProvider };
