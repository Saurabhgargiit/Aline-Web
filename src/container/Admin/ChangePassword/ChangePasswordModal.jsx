import React, { useState, useContext } from 'react';
import { Modal, ModalContent, ModalHeader, ModalFooter } from '../../../components/Modal/Modal';
// import './AddParentUser.scss';
import { AddParentUserContext } from '../AddParentUser/Context/AddParentUserContext';
import ChangePasswordForm from './ChangePasswordForm';

function ChangePasswordModal({}) {
    const ctx = useContext(AddParentUserContext);
    const addType = ctx.addType;
    const title = `Change Password`;
    const changePassword = () => {
        ctx.changePasswordFn();
    };
    console.log(ctx.isResetPassModalOpen);
    return (
        <Modal className='add-parent-box' open={ctx.isResetPassModalOpen}>
            <ModalHeader title={title} />
            <ModalContent>
                <ChangePasswordForm />
            </ModalContent>
            <ModalFooter
                onClose={ctx.closeModalHandler}
                onSubmit={changePassword}
                close={'Close'}
                submit={'Change Password'}
                disabled={ctx.loading}
            />
        </Modal>
    );
}

export default ChangePasswordModal;
