import { useState } from "react";

const useModal = () => {
    const [modal, setModal] = useState<boolean>(false);
    const [modalType, setModalType] = useState<string | null>(null);
    const [modalText, setModalText] = useState<string>("");

    const handleModal = (type: string | null, text: string) => {
        setModal(Boolean(type));
        if (type) {
            setModalType(type);
            setModalText(text);
        }
    };

    return {
        modal,
        modalType,
        modalText,
        handleModal
    }

}

export default useModal;
