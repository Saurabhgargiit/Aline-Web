import React, { useState, useContext } from 'react';
import { Modal, ModalContent, ModalHeader, ModalFooter } from '../../../components/Modal/Modal';
import AddParentUserForm from './AddParentUserForm';
import { AddParentUserContext } from './Context/AddParentUserContext';

function AddParentUserLayout({}) {
    const ctx = useContext(AddParentUserContext);
    const addType = ctx.addType;
    const title = `${!ctx.isEdit ? 'Add' : 'Edit'} ${addType}`;
    const createUserHandler = () => {
        ctx.addParentUserFn();
    };
    return (
        <Modal className='add-parent-box' open={ctx.open}>
            <ModalHeader title={title} />
            <ModalContent>
                <AddParentUserForm />
            </ModalContent>
            <ModalFooter
                onClose={ctx.closeModalHandler}
                onSubmit={createUserHandler}
                close={'Close'}
                submit={ctx.isEdit ? 'Update' : 'Create'}
                disabled={ctx.loading}
            />
        </Modal>
    );
}

export default AddParentUserLayout;
