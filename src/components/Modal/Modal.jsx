import React from 'react';
import Button from '../Button/Button';
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

export const ModalContent = ({ children, className }) => {
    return <div className={'modalContent px-2 ' + className}>{children}</div>;
};

export const ModalFooter = ({ onClose, close = '', onSubmit, submit = '' }) => {
    return (
        <div className='modalfooter p-4'>
            {!!close && <Button onClickCallBk={onClose} title={close} />}
            {!!submit && <Button onClickCallBk={onSubmit} title={submit} type={'primary'} />}
        </div>
    );
};

export const InformativeErrorModal = ({
    open = false,
    title = 'Error',
    errorMsg = 'Error Occurred',
    btnName = 'Close',
    btnFunction,
    className = '',
}) => {
    return (
        <Modal className={className} open={open}>
            <ModalHeader title={title} />
            <ModalContent className={'my-5'}>{errorMsg}</ModalContent>
            <ModalFooter
                // onClose={closeHanler}
                onSubmit={btnFunction}
                submit={btnName}
            />
        </Modal>
    );
};
