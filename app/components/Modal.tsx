import React from 'react';
import '../css/Components/modal.css'
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="shadow-xl modal-screen">
                <div className="mb-4">{children}</div>
                <div className="flex justify-center">
                    <button onClick={onClose} className="modal-btn"> 닫기 </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;

