import React from 'react';

export const Modal = ({ open, onClose, children, className }) => {
    return !open ? null : (
        <div className='modal-container center-position'>
            <div className={className}>{children}</div>
        </div>
    );
};

export const ModalHeader = ({ title, className }) => {
    return <div>{title}</div>;
};

export const ModalContent = ({ children }) => {
    return <div>{children}</div>;
};

export const ModalFooter = ({ onClose, close, onSubmit, submit }) => {
    return (
        <div className='modalfooter p-4'>
            <button onClick={onClose}>{close}</button>
            <button onClick={onSubmit}>{submit}</button>
        </div>
    );
};
