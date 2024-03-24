import React, { useState, useContext } from 'react';
import { Modal, ModalContent, ModalHeader, ModalFooter } from '../../../components/Modal/Modal';
import AddParentUser from './AddParentUser';
import './AddParentUser.scss';
import { AddParentUserContext } from './Context/AddParentUserContext';

function AddParentUserLayout({ isEdit = false }) {
    const ctx = useContext(AddParentUserContext);
    const addType = ctx.addType;
    const title = `${!isEdit ? 'Add' : 'Edit'} ${addType}`;
    const createUserHandler = () => {};
    return (
        <Modal className='add-Parent-box' open={ctx.open}>
            <ModalHeader title={title} />
            <ModalContent>
                <AddParentUser addType={addType} isEdit={isEdit} />
            </ModalContent>
            <ModalFooter
                onClose={ctx.closeModalHandler}
                onSubmit={createUserHandler}
                close={'Close'}
                submit={'Create'}
            />
        </Modal>
    );
}

export default AddParentUserLayout;
