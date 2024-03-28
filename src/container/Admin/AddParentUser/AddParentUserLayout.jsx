import React, { useState, useContext } from 'react';
import { Modal, ModalContent, ModalHeader, ModalFooter } from '../../../components/Modal/Modal';
import AddParentUserForm from './AddParentUserForm';
import './AddParentUser.scss';
import { AddParentUserContext } from './Context/AddParentUserContext';

function AddParentUserLayout({ isEdit = false }) {
    const ctx = useContext(AddParentUserContext);
    const addType = ctx.addType;
    const title = `${!isEdit ? 'Add' : 'Edit'} ${addType}`;
    const createUserHandler = () => {
        ctx.addParentUserFn();
    };
    return (
        <Modal className='add-parent-box' open={ctx.open}>
            <ModalHeader title={title} />
            <ModalContent>
                <AddParentUserForm addType={addType} isEdit={isEdit} />
            </ModalContent>
            <ModalFooter
                onClose={ctx.closeModalHandler}
                onSubmit={createUserHandler}
                close={'Close'}
                submit={'Create'}
                disabled={ctx.loading}
            />
        </Modal>
    );
}

export default AddParentUserLayout;
