import React from "react";
import '../css/Components/modal.css'

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="modal-screen">
            <p className="test">{children}</p>
                <button onClick={onClose}
                        className="mt-4 modal-btn hover:bg-blue-600">
                    닫기
                </button>
            </div>
        </div>
    );
};

export default Modal;