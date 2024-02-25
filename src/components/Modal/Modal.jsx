import React from 'react';
import './Modal.scss';

export const Modal = ({ open, onClose, children, className }) => {
    return !open ? null : (
        <div className='modal-container scrollable-section'>
            <div className='modal-overlay center-position'>
                <div className={className + ' modalBox'}>{children}</div>
            </div>
        </div>
    );
};

export const ModalHeader = ({ title, className }) => {
    return <div className='modalheader py-2 px-2 mb-3'>{title}</div>;
};

export const ModalContent = ({ children }) => {
    return <div className='modalContent px-2'>{children}</div>;
};

export const ModalFooter = ({ onClose, close, onSubmit, submit }) => {
    return (
        <div className='modalfooter p-4'>
            <button onClick={onClose}>{close}</button>
            <button onClick={onSubmit}>{submit}</button>
        </div>
    );
};
